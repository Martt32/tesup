import { db } from "../db/firebase";
import { collection, getDocs } from "firebase/firestore";

export const getPlans = async () => {
  const snap = await getDocs(collection(db, "plans"));
  console.log(snap)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};