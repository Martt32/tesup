import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../db/firebase";
import { signOut } from "firebase/auth";

export const signup = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // SUCCESS
    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error) {
    // FAILURE
    return {
      success: false,
      code: error.code,
      message: error.message,
    };
  }
};


export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );

    return {
      success: true,
      user: userCredential.user,
    };
  } catch (error) {
    return {
      success: false,
      code: error.code,
      message: error.message,
    };
  }
};



export const logout = async () => {
  try {
    await signOut(auth);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};