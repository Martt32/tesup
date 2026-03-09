import { doc, getDoc } from "firebase/firestore";
import { db } from '../db/firebase'
export const getUserProfile = async (uid) => {
  try {
    const docRef = doc(db, "users", uid);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      return { success: true, data: snapshot.data() };
    } else {
      return { success: false, message: "User not found" };
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
};


import { collection, getDocs } from "firebase/firestore";

export const getAllUsers = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "users"));

    const users = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return { success: true, data: users };
  } catch (error) {
    return { success: false, message: error.message };
  }
};