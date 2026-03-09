import {
  collection,
  onSnapshot,
  getFirestore,
  getDoc,
  doc,
} from "firebase/firestore";
import { useState } from "react";
import { db } from "../db/firebase";

useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, "deposits"),
    async (snapshot) => {
      const deposits = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

      // Collect unique user IDs to avoid duplicate fetches
      const uniqueUserIds = [...new Set(deposits.map((d) => d.user))];

      // Fetch all users in parallel
      const userDocs = await Promise.all(
        uniqueUserIds.map((userId) => getDoc(doc(db, "users", userId)))
      );

      // Build a userId → userData map
      const usersMap = {};
      userDocs.forEach((userDoc) => {
        if (userDoc.exists()) {
          usersMap[userDoc.id] = { id: userDoc.id, ...userDoc.data() };
        }
      });

      // Merge each deposit with its user
      const depositsWithUsers = deposits.map((deposit) => ({
        ...deposit,
        userData: usersMap[deposit.user] ?? null,
      }));

      console.log("Deposits with users:", depositsWithUsers);

      // ... same logic above
      setDeposits(depositsWithUsers);
    }
  );

  return () => unsubscribe();
}, []);
