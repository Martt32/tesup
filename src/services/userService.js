import { db } from "../db/firebase";
import { doc, getDoc, collection, onSnapshot } from "firebase/firestore";

export const getProfile = async (uid) => {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
};

export const listenToWallet = (uid, callback) => {
  return onSnapshot(doc(db, "users", uid, "wallet", "main"), (snap) => {
    if (snap.exists()) callback(snap.data());
  });
};

export const listenToReferrals = (uid, callback) => {
  const ref = collection(db, "users", uid, "referrals");

  return onSnapshot(ref, (snap) => {
    const list = snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    callback(list);
  });
};