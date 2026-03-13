
import { useState, useEffect, useContext } from 'react';
import { onSnapshot, doc } from 'firebase/firestore';
import { db } from "../db/firebase";
import { AuthContext } from '../context/AuthContext';

export default function  useWallet (){

    const { user } = useContext(AuthContext);
    const [wallet, setWallet] = useState(null);
  
    useEffect(() => {
  
      if (!user) return;
  
      const unsub = onSnapshot(
        doc(db, "users", user.uid, "wallet", "main"),
        (snap) => {
          if (snap.exists()) setWallet(snap.data());
        }
      );
  
      return () => unsub();
  
    }, [user]);
  
    return wallet;
  };