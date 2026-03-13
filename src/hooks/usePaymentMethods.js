import { useEffect, useState } from "react";
import { db } from "../db/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function usePaymentMethods() {
  const [methods, setMethods] = useState([]);

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        const snap = await getDocs(
          collection(db, "payment-method", "crypto", "coins")
        );

        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));

        setMethods(data);
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