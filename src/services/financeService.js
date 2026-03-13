import { db } from "../db/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

export const listenToTransactions = (uid, callback) => {
  const q = query(
    collection(db, "users", uid, "transactions"),
    orderBy("timestamp", "desc")
  );

  return onSnapshot(q, (snap) => {
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    callback(data);
  });
};

export const listenToInvestments = (uid, callback) => {
  const ref = collection(db, "users", uid, "investments");

  return onSnapshot(ref, (snap) => {
    const data = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    callback(data);
  });
};