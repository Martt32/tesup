import {
  doc,
  getDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../db/firebase";

const addTransaction = async (uid, amount, coin, withdrawalId) => {
  await addDoc(collection(db, "users", uid, "transactions"), {
    amount,
    coin,
    type: "withdrawal",
    direction: "debit",
    status: "pending",
    withdrawalId,
    timestamp: serverTimestamp(),
  });
};

export const handleWithdrawal = async (amount, coin, uid) => {
  try {
    // Get wallet
    const walletRef = doc(db, "users", uid, "wallet", "main");
    const walletSnap = await getDoc(walletRef);

    if (!walletSnap.exists()) {
      throw new Error("Wallet not found");
    }

    const wallet = walletSnap.data();
    const balance = wallet.availableBalance + wallet.totalProfit;

    // Balance validation
    if (amount > balance) {
      alert("Insufficient balance");
      return;
    }

    // Create withdrawal request
    const withdrawRef = await addDoc(collection(db, "withdrawals"), {
      user: uid,
      coin,
      amount,
      status: "pending",
      approved: false,
      createdAt: serverTimestamp(),
    });

    // Log transaction
    await addTransaction(uid, amount, coin, withdrawRef.id);
  } catch (err) {
    console.error("Withdrawal error:", err);
  }
};
