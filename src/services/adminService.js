import { db } from "../db/firebase";
import { collection, onSnapshot, getDoc, doc } from "firebase/firestore";

export const listenToRequests = (callback) => {
  const cache = {
    deposit: [],
    withdrawal: [],
  };

  const update = async () => {
    const all = [...cache.deposit, ...cache.withdrawal];

    const uniqueIds = [...new Set(all.map((r) => r.user))];

    const users = await Promise.all(
      uniqueIds.map((id) => getDoc(doc(db, "users", id)))
    );

    const usersMap = {};

    users.forEach((u) => {
      if (u.exists()) usersMap[u.id] = { id: u.id, ...u.data() };
    });

    const enriched = all.map((req) => ({
      ...req,
      userData: usersMap[req.user] ?? null,
    }));

    enriched.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);

    callback(enriched);
  };

  const unsubDeposits = onSnapshot(collection(db, "deposits"), (snap) => {
    cache.deposit = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      type: "deposit",
    }));

    update();
  });

  const unsubWithdrawals = onSnapshot(collection(db, "withdrawals"), (snap) => {
    cache.withdrawal = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      type: "withdrawal",
    }));

    update();
  });

  return () => {
    unsubDeposits();
    unsubWithdrawals();
  };
};