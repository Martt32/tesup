import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { db } from "../db/firebase";

const addTransaction = async (uid, amount, coin, status, title, depositId) => {
  await addDoc(
    collection(db, "users", uid, "transactions"),
    {
      amount,
      coin,
      status,
      title,
      depositId,      // ✅ link to the deposit
      timestamp: serverTimestamp(),
    }
  );
};

export const handleDeposit = async (amount, coin, userUid) => {
  try {
    // addDoc returns the ref, grab the id from it
    const depositRef = await addDoc(collection(db, "deposits"), {
      approved: false,
      amount,
      coin,
      status: "pending",
      user: userUid,
      timestamp: serverTimestamp(),
    });

    await addTransaction(userUid, amount, coin, "pending", "deposit", depositRef.id);
  } catch (err) {
    console.error("Deposit error:", err);
  }
};