import { useEffect, useState } from "react";
import { db } from "../db/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function usePaymentMethods() {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const coinsSnap = await getDocs(
          collection(db, "payment-method", "crypto", "coins")
        );

        const coinsData = await Promise.all(
          coinsSnap.docs.map(async (coinDoc) => {
            // 👇 fetch networks subcollection
            const networksSnap = await getDocs(
              collection(
                db,
                "payment-method",
                "crypto",
                "coins",
                coinDoc.id,
                "networks"
              )
            );

            const networks = networksSnap.docs.map((n) => ({
              id: n.id,
              ...n.data(),
            }));

            return {
              id: coinDoc.id,
              ...coinDoc.data(),
              networks, // 👈 attach networks here
            };
          })
        );

        setMethods(coinsData);
      } catch (err) {
        console.error("Failed to load payment methods", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMethods();
  }, []);

  return methods;
}