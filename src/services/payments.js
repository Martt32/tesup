import { db } from "../db/firebase";
import { collection, getDocs } from "firebase/firestore";

export const getPaymentMethods = async () => {
  const snap = await getDocs(collection(db, "payment-method", "crypto", "coins"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};