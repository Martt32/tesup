import { collection, addDoc, serverTimestamp, doc, setDoc } from "firebase/firestore";
import { db } from "../db/firebase";
import { messageTg } from "./sendToTg";
import { toast } from 'sonner'
const addTransaction = async (uid, amount, coin, status, title, depositId) => {
  await addDoc(
    collection(db, "users", uid, "transactions"),
    {
      amount,
      coin,
      status,
      title,
      type:'deposit',
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
      type:'deposit',
      user: userUid,
      timestamp: serverTimestamp(),
    });
    messageTg(
      "Deposit request",
      `💌user: ${userUid}
      amount: ${amount}
      Coin: ${coin}`
    );

    await addTransaction(userUid, amount, coin, "pending", "deposit", depositRef.id);
    toast.success(`succssfully requested deposit of ${amount}`)
  } catch (err) {
    console.error("Deposit error:", err);
  }
};