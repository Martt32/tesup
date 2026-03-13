
import { useState, useEffect, useContext } from 'react';
import { onSnapshot, collection } from 'firebase/firestore';
import { db } from "../db/firebase";
import { AuthContext } from '../context/AuthContext';

export default function  useReferrals (){

    const { user } = useContext(AuthContext);
    const [referrals, setReferrals] = useState([]);
  
    useEffect(() => {
  
      if (!user) return;
  
      const unsub = onSnapshot(
        collection(db, "users", user.uid, "referrals"),
        (snap) => {
  
          const list = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          setReferrals(list);
        }
      );
  
      return () => unsub();
  
    }, [user]);
  
    return referrals;
  };