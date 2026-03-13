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

export const sendEmailVerification = https.onCall(
  { secrets: [SMTP_USER, SMTP_PASS] },
  async (request) => {

  if (!request.auth) {
    throw new https.HttpsError("unauthenticated", "Login required");
  }

  const uid = request.auth.uid;
  const email = request.auth.token.email;

  if (!email) {
    throw new https.HttpsError("invalid-argument", "Email missing");
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const now = admin.firestore.Timestamp.now();
  const expiresAt = admin.firestore.Timestamp.fromMillis(
    now.toMillis() + 5 * 60 * 1000 // 5 minutes
  );

  const verificationRef = db.doc(`emailVerifications/${uid}`);

  await verificationRef.set({
    email,
    code,
    createdAt: now,
    expiresAt,
  });
  const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
      user: SMTP_USER.value(),
      pass: SMTP_PASS.value(),
    },
  });
  await transporter.sendMail({
    from: `"TesUP" <${SMTP_USER.value()}>`,
    to: email,
    subject: "Verify your email",
    html: `<div style="
    font-family: Arial, sans-serif;
    max-width: 600px;
    margin: auto;
    padding: 20px;
    border-radius: 10px;
    margin: 0;
  background:
    linear-gradient(to right, rgba(168, 85, 247, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(168, 85, 247, 0.1) 1px, transparent 1px),
    #0f0c29;
  background-size: 40px 40px;
    color: #fff;
    line-height: 1.6;
  ">
    <div style="text-align: center; margin-bottom: 20px;">
      <h1 style="font-size: 28px; margin: 0;">Welcome to TesUP, 🎉</h1>
      <p style="font-size: 16px; margin-top: 5px;">We’re excited to have you on board.</p>
    </div>
  
    <div style="
      background: rgba(255, 255, 255, 0.15);
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      margin: 20px 0;
    ">
      <p style="margin: 0; font-size: 16px;">Your verification code is:</p>
      <h2 style="
        font-size: 32px;
        letter-spacing: 4px;
        margin: 10px 0 0 0;
        color: #ffe6ff;
      ">${code}</h2>
    </div>
  
    <p style="text-align: center; font-size: 14px; margin-top: 10px;">
      Enter this code in the app to verify your account and get started.
    </p>
  
    <div style="text-align: center; margin-top: 30px;">
      <a href="https://tesup.io" style="
        display: inline-block;
        padding: 12px 25px;
        background: #fff;
        color: #0f0c29;
        text-decoration: none;
        font-weight: bold;
        border-radius: 5px;
      ">Go to Dashboard</a>
    </div>
  
    <p style="font-size: 12px; text-align: center; margin-top: 30px; opacity: 0.8;">
      If you did not create an account, please ignore this email.
    </p>
  </div>
  `

  });

  return { success: true };
});

export const verifyEmailCode = https.onCall(async (request) => {

  if (!request.auth) {
    throw new https.HttpsError("unauthenticated", "Login required");
  }

  const uid = request.auth.uid;
  const { code } = request.data;

  if (!code) {
    throw new https.HttpsError("invalid-argument", "Code required");
  }

  const verificationRef = db.doc(`emailVerifications/${uid}`);
  const snap = await verificationRef.get();

  if (!snap.exists) {
    throw new https.HttpsError("not-found", "Verification expired");
  }

  const data = snap.data();

  const now = admin.firestore.Timestamp.now();

  if (now.toMillis() > data.expiresAt.toMillis()) {
    await verificationRef.delete();
    throw new https.HttpsError("deadline-exceeded", "Code expired");
  }

  if (data.code !== code) {
    throw new https.HttpsError("permission-denied", "Invalid code");
  }

  const userRef = db.doc(`users/${uid}`);

  const batch = db.batch();

  batch.update(userRef, {
    verified: true,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  batch.delete(verificationRef);

  await batch.commit();

  return { success: true };
});

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
  if (!newUser.profileCompleted) return;

  const SIGNUP_BONUS = 20;
  const generateReferralCode = (uid) => uid.substring(0, 8).toUpperCase();

  const referralCode = generateReferralCode(userId);

  const batch = db.batch();

  const userRef = db.doc(`users/${userId}`);
  const walletRef = db.doc(`users/${userId}/wallet/main`);
  const referralCodeRef = db.doc(`referralCodes/${referralCode}`);

  // 1️⃣ attach referral code to user
  batch.set(
    userRef,
    {
      referralCode,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  // 2️⃣ create referral lookup
  batch.set(referralCodeRef, {
    uid: userId,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // 3️⃣ if user was referred, give THEM $20
  if (newUser.referredBy) {

    // give signup bonus to the NEW user
    batch.set(
      walletRef,
      {
        availableBalance: admin.firestore.FieldValue.increment(SIGNUP_BONUS),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    const inviterId = newUser.referredBy;

    const inviterReferralRef = db.doc(`users/${inviterId}/referrals/${userId}`);

    // create referral tracking record
    batch.set(inviterReferralRef, {
      userId,
      username: newUser.username || null,
      email: newUser.email || null,
      joinedAt: admin.firestore.Timestamp.now(),
      totalInvested: 0,
      bonusEarned: 0, // earnings will come from investments
    });

  }

  await batch.commit();

  logger.info(`User ${userId} created with referral code ${referralCode}`);
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

    // 1️⃣ Fetch plan
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

    const userRef = db.doc(`users/${userId}`);
    const walletRef = db.doc(`users/${userId}/wallet/main`);
    const investRef = db.collection("users").doc(userId).collection("investments").doc();

    const now = admin.firestore.Timestamp.now();

    await db.runTransaction(async (tx) => {

      // 2️⃣ Fetch user
      const userSnap = await tx.get(userRef);
      if (!userSnap.exists) {
        throw new Error("User not found");
      }

      const userData = userSnap.data();
      const inviterId = userData?.referredBy ?? null;

      // 3️⃣ Fetch wallet
      const walletSnap = await tx.get(walletRef);
      if (!walletSnap.exists) {
        throw new Error("Wallet not found");
      }

      const wallet = walletSnap.data();

      if ((wallet.availableBalance || 0) < investAmount) {
        throw new Error("Insufficient balance");
      }

      // 4️⃣ Deduct investor balance
      tx.update(walletRef, {
        totalInvested: (wallet.totalInvested || 0) + investAmount,
        availableBalance: wallet.availableBalance - investAmount,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // 5️⃣ Create investment
      tx.set(investRef, {
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

      // 6️⃣ Handle referral bonus
      if (inviterId) {
        const REFERRAL_RATE = 0.05;
        const referralBonus = investAmount * REFERRAL_RATE;

        const inviterWalletRef = db.doc(`users/${inviterId}/wallet/main`);
        const referralRef = db.doc(`users/${inviterId}/referrals/${userId}`);

        // credit inviter wallet
        tx.set(
          inviterWalletRef,
          {
            availableBalance: admin.firestore.FieldValue.increment(referralBonus),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );

        // update referral stats
        tx.set(
          referralRef,
          {
            userId,
            totalInvested: admin.firestore.FieldValue.increment(investAmount),
            bonusEarned: admin.firestore.FieldValue.increment(referralBonus),
          },
          { merge: true }
        );

        logger.info(
          `Referral bonus: ${inviterId} earned $${referralBonus} from ${userId}`
        );
      }
    });

    return {
      success: true,
      investmentId: investRef.id,
    };

  } catch (err) {
    logger.error("createInvestment error:", err);

    if (err instanceof https.HttpsError) throw err;

    throw new https.HttpsError(
      "internal",
      err.message || "Internal server error"
    );
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