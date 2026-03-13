import { AuthContext } from "../context/AuthContext";
import { useContext, useState, useEffect
 } from "react";

 import { db } from "../db/firebase";
 import { collection, doc, onSnapshot } from "firebase/firestore";
export default function  useInvestments (){

    const { user } = useContext(AuthContext);
    const [investments, setInvestments] = useState([]);
  
    useEffect(() => {
  
      if (!user) return;
  
      const unsub = onSnapshot(
        collection(db, "users", user.uid, "investments"),
        (snap) => {
  
          const data = snap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }));
  
          setInvestments(data);
        }
      );
  
      return () => unsub();
  
    }, [user]);
  
    return investments;
  };