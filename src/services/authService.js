import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../db/firebase";

export const listenToAuth = (callback) => {
  return onAuthStateChanged(auth, callback);
};