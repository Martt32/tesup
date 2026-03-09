import { createContext, useEffect, useState, useRef } from "react";
import { auth, db } from "../db/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [plans, setPlans] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [payment, setPayment] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [referrals, setReferrals] = useState([]);

  // Track all snapshot unsubs so we can clean them up on sign-out
  const unsubs = useRef([]);

  const clearListeners = () => {
    unsubs.current.forEach((fn) => fn());
    unsubs.current = [];
  };

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      // Clean up previous user's listeners before setting up new ones
      clearListeners();

      if (!firebaseUser) {
        setUser(null);
        setProfile(null);
        setWallet(null);
        setInvestments([]);
        setTransactions([]);
        setDeposits([]);
        setLoading(false);
        return;
      }

      setUser(firebaseUser);

      try {
        const uid = firebaseUser.uid;

        // ── Profile ───────────────────────────────────────
        const profileSnap = await getDoc(doc(db, "users", uid));
        const profileData = profileSnap.exists() ? profileSnap.data() : null;
        setProfile(profileData);

        // ── Wallet (live) ─────────────────────────────────
        const unsubWallet = onSnapshot(
          doc(db, "users", uid, "wallet", "main"),
          (snap) => snap.exists() && setWallet(snap.data())
        );
        unsubs.current.push(unsubWallet);

        // ── Plans (static, rarely changes) ────────────────
        const plansSnap = await getDocs(collection(db, "plans"));
        setPlans(plansSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        // ── Payment methods ───────────────────────────────
        const coinsSnap = await getDocs(
          collection(db, "payment-method", "crypto", "coins")
        );
        setPayment(coinsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));

        // ── Transactions (live) ───────────────────────────
        const unsubTx = onSnapshot(
          query(
            collection(db, "users", uid, "transactions"),
            orderBy("timestamp", "desc")
          ),
          (snap) =>
            setTransactions(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        );
        unsubs.current.push(unsubTx);

        // ── Investments (live) ────────────────────────────
        const unsubInv = onSnapshot(
          collection(db, "users", uid, "investments"),
          (snap) =>
            setInvestments(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        );
        unsubs.current.push(unsubInv);

        // ── Requests (Deposits + Withdrawals) — admin only ───────────────
        if (profileData?.role === "admin") {
          const unsubDeposits = onSnapshot(
            collection(db, "deposits"),
            async (snapshot) => {
              const deposits = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
                type: "deposit",
              }));

              updateRequests(deposits, "deposit");
            }
          );

          const unsubWithdrawals = onSnapshot(
            collection(db, "withdrawals"),
            async (snapshot) => {
              const withdrawals = snapshot.docs.map((d) => ({
                id: d.id,
                ...d.data(),
                type: "withdrawal",
              }));

              updateRequests(withdrawals, "withdrawal");
            }
          );

          unsubs.current.push(unsubDeposits);
          unsubs.current.push(unsubWithdrawals);
        }

        //merger function
        const requestsCache = {
          deposit: [],
          withdrawal: [],
        };

        const updateRequests = async (data, type) => {
          requestsCache[type] = data;

          const allRequests = [
            ...requestsCache.deposit,
            ...requestsCache.withdrawal,
          ];

          const uniqueUserIds = [...new Set(allRequests.map((r) => r.user))];

          const userDocs = await Promise.all(
            uniqueUserIds.map((id) => getDoc(doc(db, "users", id)))
          );

          const usersMap = {};

          userDocs.forEach((u) => {
            if (u.exists()) usersMap[u.id] = { id: u.id, ...u.data() };
          });

          const enriched = allRequests.map((req) => ({
            ...req,
            userData: usersMap[req.user] ?? null,
          }));

          // newest first
          enriched.sort((a, b) => b.timestamp?.seconds - a.timestamp?.seconds);

          setRequests(enriched);
          console.log(enriched);
        };

        //referrals

        if (!user) return;

        const ref = collection(db, "users", user.uid, "referrals");

        const unsub = onSnapshot(ref, (snap) => {
          const list = snap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setReferrals(list);
        });

        return () => unsub();
      } catch (error) {
        console.error("AuthContext error:", error);
      }

      setLoading(false);
    });

    return () => {
      setLoading(false);
      unsubAuth();
      clearListeners();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        wallet,
        loading,
        plans,
        investments,
        payment,
        transactions,
        deposits,
        requests,
        referrals,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
