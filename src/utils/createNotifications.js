import {
    collection,
    addDoc,
  } from "firebase/firestore";
  import { db } from "../db/firebase";


/* ================= CREATE NOTIFICATION FUNCTION ================= */
export async function createNotification(userId, { type, title, message }) {
    if (!userId) return;
    const notifRef = collection(db, "users", userId, "notifications");
    await addDoc(notifRef, {
      type,
      title,
      message,
      read: false,
      timestamp: new Date(), // store as server timestamp if needed
    });
  }