import { https, setGlobalOptions } from "firebase-functions/v2";
import { logger } from "firebase-functions/logger";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import adminModule from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { defineSecret } from "firebase-functions/params";
import { onRequest } from "firebase-functions/v2/https";
import nodemailer from "nodemailer";
import cors from "cors";

setGlobalOptions({ timeoutSeconds: 60, maxInstances: 10 });

if (!adminModule.apps.length) adminModule.initializeApp();

const admin = adminModule;
const db = admin.firestore();



const SMTP_USER = defineSecret("SMTP_USER");
const SMTP_PASS = defineSecret("SMTP_PASS");
const corsHandler = cors({ origin: true });

export const sendEmail = onRequest(
  { secrets: [SMTP_USER, SMTP_PASS] },
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        const transporter = nodemailer.createTransport({
          host: "smtp.hostinger.com",
          port: 465,
          secure: true,
          auth: {
            user: SMTP_USER.value(),
            pass: SMTP_PASS.value(),
          },
        });

        const { to, subject, html } = req.body;

        await transporter.sendMail({
          from: `"TesUP" <${SMTP_USER.value()}>`,
          to,
          subject,
          html,
        });

        res.send({ success: true });
      } catch (err) {
        console.error(err);
        res.status(500).send("Email failed");
      }
    });
  }
);

export const createReferralCode = onDocumentCreated(
  "users/{userId}",
  async (event) => {

    const userId = event.params.userId;
    const user = event.data.data();

    if (!user.profileCompleted) return;

    const referralCode = userId.substring(0,8).toUpperCase();

    const batch = db.batch();

    // add code to user
    batch.update(db.doc(`users/${userId}`), {
      referralCode
    });

    // create lookup document
    batch.set(db.doc(`referralCodes/${referralCode}`), {
      uid: userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    await batch.commit();

    logger.info(`Referral code created for ${userId}`);
  }
);

export const onUserCreated = onDocumentCreated("users/{userId}", async (event) => {

  const userId = event.params.userId;
  const newUser = event.data?.data();

  if (!newUser) return;

  // only run when profile is completed
  if (!newUser.profileCompleted) return;

  const SIGNUP_BONUS = 20;
  const generateReferralCode = (uid) => uid.substring(0, 8).toUpperCase();

  const referralCode = generateReferralCode(userId);

  const batch = db.batch();

  const userRef = db.doc(`users/${userId}`);
  const referralCodeRef = db.doc(`referralCodes/${referralCode}`);

  // 1️⃣ attach referral code to user profile
  batch.set(
    userRef,
    {
      referralCode,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  // 2️⃣ create referral lookup document
  batch.set(referralCodeRef, {
    uid: userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // 3️⃣ handle inviter reward
  if (newUser.referredBy) {

    const inviterId = newUser.referredBy;

    const inviterWalletRef = db.doc(`users/${inviterId}/wallet/main`);
    const inviterReferralRef = db.doc(`users/${inviterId}/referrals/${userId}`);

    // credit inviter wallet
    batch.set(
      inviterWalletRef,
      {
        availableBalance: admin.firestore.FieldValue.increment(SIGNUP_BONUS),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // create referral tracking record
    batch.set(inviterReferralRef, {
      userId,
      username: newUser.username || null,
      email: newUser.email || null,
      joinedAt: admin.firestore.Timestamp.now(),
      totalInvested: 0,
      bonusEarned: SIGNUP_BONUS,
    });

  }

  await batch.commit();

  logger.info(`User ${userId} processed with referral code ${referralCode}`);
});


// ─────────────────────────────────────────────
// 💰 CALLABLE: Create Investment + pay referral bonus
// ─────────────────────────────────────────────
export const createInvestment = https.onCall(async (request) => {
  try {
    if (!request.auth) {
      throw new https.HttpsError("unauthenticated", "User must be logged in");
    }

    const userId = request.auth.uid;
    const { planId, amount } = request.data;

    if (!planId || amount == null) {
      throw new https.HttpsError("invalid-argument", "Missing planId or amount");
    }

    const investAmount = Number(amount);
    if (Number.isNaN(investAmount)) {
      throw new https.HttpsError("invalid-argument", "Invalid amount");
    }

    // 1. Fetch plan
    const planSnap = await db.collection("plans").doc(planId).get();
    if (!planSnap.exists) {
      throw new https.HttpsError("not-found", "Plan not found");
    }

    const plan = planSnap.data();
    const min = Number(plan.minInvestment || 0);
    const max = Number(plan.maxInvestment || Infinity);

    if (investAmount < min || investAmount > max) {
      throw new https.HttpsError(
        "failed-precondition",
        `Amount must be between ${min} and ${max}`
      );
    }

    // 2. Fetch user to check referredBy
    const userSnap = await db.collection("users").doc(userId).get();
    const userData = userSnap.data();
    const inviterId = userData?.referredBy ?? null;

    // 3. Create investment doc
    const investRef = db.collection("users").doc(userId).collection("investments").doc();
    const now = admin.firestore.Timestamp.now();

    await investRef.set({
      planId,
      amount: investAmount,
      status: "active",
      createdAt: now,
      lastProfitAt: now,
      userId,
      endsAt: admin.firestore.Timestamp.fromMillis(
        now.toMillis() + plan.investPeriodDays * 24 * 60 * 60 * 1000
      ),
    });

    // 4. Deduct from investor wallet (transaction for safety)
    const walletRef = db.doc(`users/${userId}/wallet/main`);
    await db.runTransaction(async (tx) => {
      const walletSnap = await tx.get(walletRef);

      if (!walletSnap.exists) {
        throw new Error("Wallet not found");
      }

      const wallet = walletSnap.data();
      if ((wallet.availableBalance || 0) < investAmount) {
        throw new Error("Insufficient balance");
      }

      tx.update(walletRef, {
        totalInvested: (wallet.totalInvested || 0) + investAmount,
        availableBalance: wallet.availableBalance - investAmount,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    // 5. Pay referral bonus if user was referred
    if (inviterId) {
      const REFERRAL_BONUS_RATE = 0.05;
      const referralBonus = investAmount * REFERRAL_BONUS_RATE;

      const batch = db.batch();

      // Credit inviter's wallet
      const inviterWalletRef = db.doc(`users/${inviterId}/wallet/main`);
      batch.set(inviterWalletRef, {
        availableBalance: admin.firestore.FieldValue.increment(referralBonus),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });

      // Update the referral record (totalInvested + bonusEarned)
      const referralRef = db.doc(`users/${inviterId}/referrals/${userId}`);
      batch.update(referralRef, {
        totalInvested: admin.firestore.FieldValue.increment(investAmount),
        bonusEarned: admin.firestore.FieldValue.increment(referralBonus),
      });

      await batch.commit();
      logger.info(`Referral bonus: ${inviterId} earned $${referralBonus} from ${userId}'s investment`);
    }

    return { success: true, investmentId: investRef.id };
  } catch (err) {
    logger.error("createInvestment error:", err);
    if (err instanceof https.HttpsError) throw err;
    throw new https.HttpsError("internal", err.message || "Internal server error");
  }
});



export const autoProfit = onSchedule("every 5 minutes", async () => {
  console.log("Auto profit started");

  const WEEK_SLICES = 2016; // 7 days * 24 hrs * 12 (five-min intervals per hr)
  const batch = db.batch();

  const usersSnap = await db.collection("users").get();

  for (const userDoc of usersSnap.docs) {
    const investmentsSnap = await userDoc.ref
      .collection("investments")
      .where("status", "==", "active")
      .get();

    console.log(`User ${userDoc.id} — investments found: ${investmentsSnap.size}`);

    for (const doc of investmentsSnap.docs) {
      const investment = doc.data();

      const planSnap = await db.collection("plans").doc(investment.planId).get();
      if (!planSnap.exists) {
        console.log(`Plan missing for investment ${doc.id}, skipping`);
        continue;
      }

      const plan = planSnap.data();
      const sliceRate = (plan.returnRate / 100) / WEEK_SLICES;
      const profit = investment.amount * sliceRate;

      console.log(`Investment ${doc.id} — plan rate: ${plan.returnRate}%, profit this slice: ${profit}`);

      const walletRef = db.doc(`users/${userDoc.id}/wallet/main`);
      batch.set(walletRef, {
        totalProfit: admin.firestore.FieldValue.increment(profit),
        availableBalance: admin.firestore.FieldValue.increment(profit),
      }, { merge: true });

      batch.update(doc.ref, {
        lastProfitAt: admin.firestore.Timestamp.now(),
      });
    }
  }

  await batch.commit();
  console.log("Auto profit finished");
});