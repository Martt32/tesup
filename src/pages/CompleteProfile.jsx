import { useState, useContext } from "react";
import { auth, db } from "../db/firebase";
import {
  doc,
  setDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import Loader from "../components/Loader";
import { LoadingContext } from "../context/Context";
import CountrySelector from "../components/CountrySelector";
import { messageTg } from "../utils/sendToTg";

// Generates a clean 8-char code from the user's UID e.g. "A1B2C3D4"
const generateReferralCode = (uid) => uid.substring(0, 8).toUpperCase();

export default function CompleteProfile() {
  const { loading, setLoading } = useContext(LoadingContext);
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [referralInput, setReferralInput] = useState(""); // code the user was referred by
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [countryName, setCountryName] = useState(false);

  const handleCompleteProfile = async () => {
    const user = auth.currentUser;

    if (!user) {
      toast.error("Not authenticated");
      return;
    }

    if (!selected) {
      toast.error("Please select your country");
      return;
    }

    setLoading(true);

    try {
      let referredBy = null;

      // 🔎 Lookup referral code
      if (referralInput.trim()) {
        const code = referralInput.trim().toUpperCase();

        const ref = doc(db, "referralCodes", code);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          toast.error("Invalid referral code");
          setLoading(false);
          return;
        }

        referredBy = snap.data().uid;

        // prevent self referral
        if (referredBy === user.uid) {
          toast.error("You cannot use your own referral code");
          setLoading(false);
          return;
        }
      }

      console.log("Creating user profile");

      // Create profile
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        firstName,
        lastName,
        username,
        phone,
        country: countryName,
        role: "user",
        referredBy,
        profileCompleted: true,
        createdAt: serverTimestamp(),
      });

      console.log("Creating wallet");

      // Create wallet
      await setDoc(doc(db, "users", user.uid, "wallet", "main"), {
        availableBalance: 0,
        totalProfit: 0,
        totalInvested: 0,
        pendingWithdrawals: 0,
        updatedAt: serverTimestamp(),
      });

      messageTg(
        "Profile Completed",
        `Email: ${user.email}
  Name: ${firstName} ${lastName}
  Phone: ${phone}
  Country: ${countryName}
  Username: ${username}
  ${referredBy ? `Referred By: ${referredBy}` : ""}`
      );

      toast.success("Profile completed!");
      navigate("/app/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }

    setLoading(false);
  };

  return (
    <>
      {loading && <Loader />}
      <div className="min-h-screen bg-[#0b1020] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-white shadow-2xl">
          <h2 className="text-2xl font-bold">Complete Your Profile</h2>
          <p className="text-gray-400 mb-6">Let's get to know more about you</p>

          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                onChange={(e) => setFirstName(e.target.value)}
                className="input-glow"
                placeholder="First Name"
              />
              <input
                onChange={(e) => setLastName(e.target.value)}
                className="input-glow"
                placeholder="Last Name"
              />
            </div>

            <div className="flex space-x-2">
              <CountrySelector
                selected={selected}
                setSelected={setSelected}
                search={search}
                setSearch={setSearch}
                open={open}
                setOpen={setOpen}
                setCountryName={setCountryName}
              />
              <input
                onChange={(e) => setPhone(e.target.value)}
                className="input-glow"
                placeholder={selected?.dial || "+1"}
              />
            </div>

            <input
              onChange={(e) => setUsername(e.target.value)}
              className="input-glow"
              placeholder="Username"
            />

            <input
              onChange={(e) => setReferralInput(e.target.value)}
              className="input-glow"
              placeholder="Referral code (optional)"
            />

            <button
              onClick={handleCompleteProfile}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 font-semibold"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
