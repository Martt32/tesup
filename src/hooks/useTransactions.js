
import { useState, useEffect, useContext } from 'react';
import { onSnapshot, collection, query, orderBy } from 'firebase/firestore';
import { db } from "../db/firebase";
import { AuthContext } from '../context/AuthContext';

export default function  useTransactions (){

    const { user } = useContext(AuthContext);
    const [transactions, setTransactions] = useState([]);
  
    useEffect(() => {
  
      if (!user) return;
  
      const q = query(
        collection(db, "users", user.uid, "transactions"),
        orderBy("timestamp", "desc")
      );
  
      const unsub = onSnapshot(q, (snap) => {
  
        const data = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
  
        setTransactions(data);
      });
  
      return () => unsub();
  
    }, [user]);
  
    return transactions;
  };