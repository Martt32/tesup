import { useEffect, useState } from "react";
import { db } from "../db/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function useAdminRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const unsubDeposits = onSnapshot(collection(db, "deposits"), (snap) => {
      const deposits = snap.docs.map(d => ({ id: d.id, ...d.data(), type: "deposit" }));
      setRequests(prev => [...prev.filter(r => r.type !== "deposit"), ...deposits]);
    });

    const unsubWithdrawals = onSnapshot(collection(db, "withdrawals"), (snap) => {
      const withdrawals = snap.docs.map(d => ({ id: d.id, ...d.data(), type: "withdrawal" }));
      setRequests(prev => [...prev.filter(r => r.type !== "withdrawal"), ...withdrawals]);
    });

    return () => {
      unsubDeposits();
      unsubWithdrawals();
    };
  }, []);

  return requests;
}