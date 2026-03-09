import { getFunctions, httpsCallable } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { app } from "../db/firebase";

const functions = getFunctions(app);
const createInvestment = httpsCallable(functions, "createInvestment");

export const handleInvest = async (amount, planId) => {
  console.log(amount, planId)
  try {
    const auth = getAuth();
    if (!auth.currentUser) {
      throw new Error("User not logged in");
    }

    const res = await createInvestment({
      amount:amount,
      planId:planId,
    });

    console.log("Investment created:", res.data);
    return res.data;
  } catch (err) {
    console.error("Investment error:", err.message);
    throw err;
  }
};