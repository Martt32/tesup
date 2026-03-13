import { useEffect, useState, useContext } from "react";
import { db } from "../db/firebase";
import { collection, getDocs } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { Copy, Users, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function Referrals() {
  const { user } = useContext(AuthContext);

  const [referrals, setReferrals] = useState([]);
  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalBonus: 0,
    totalInvested: 0,
  });

  const referralCode = user?.uid;

  useEffect(() => {
    const fetchReferrals = async () => {
      if (!user) return;

      const snap = await getDocs(
        collection(db, "users", user.uid, "referrals")
      );

      let list = [];
      let totalBonus = 0;
      let totalInvested = 0;

      snap.forEach((doc) => {
        const data = doc.data();

        totalBonus += data.bonusEarned || 0;
        totalInvested += data.totalInvested || 0;

        list.push({
          id: doc.id,
          ...data,
          joinedAt: data.joinedAt?.toDate()?.toLocaleString() || "-",
        });
      });

      setReferrals(list);

      setStats({
        totalReferrals: list.length,
        totalBonus,
        totalInvested,
      });
    };

    fetchReferrals();
  }, [user]);

  const copyCode = () => {
    navigator.clipboard.writeText(referralCode);

    toast.success("Referral code copied");
  };

  const referralLink = `${window.location.origin}/register?ref=${referralCode}`;

  return (
    <div className="space-y-10">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">Referrals</h1>
        <p className="text-gray-400 mt-2">Invite friends and earn bonuses</p>
      </div>

      {/* Referral Code */}

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <p className="text-sm text-gray-400 mb-2">Your Referral Code</p>

        <div className="flex items-center gap-4">
          <div className="bg-black/40 px-4 py-2 rounded-lg font-mono">
            {referralCode}
          </div>

          <button
            onClick={copyCode}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
          >
            <Copy size={16} />
            Copy
          </button>
        </div>

        {/* <p className="text-sm text-gray-400 mt-4">Referral Link</p>

        <div className="mt-2 bg-black/40 p-3 rounded-lg break-all">
          {referralLink}
        </div> */}
      </div>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center gap-4">
          <Users />

          <div>
            <p className="text-gray-400 text-sm">Total Referrals</p>
            <p className="text-xl font-bold">{stats.totalReferrals}</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center gap-4">
          <DollarSign />

          <div>
            <p className="text-gray-400 text-sm">Bonus Earned</p>
            <p className="text-xl font-bold">${stats.totalBonus}</p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex items-center gap-4">
          <DollarSign />

          <div>
            <p className="text-gray-400 text-sm">Total Invested</p>
            <p className="text-xl font-bold">${stats.totalInvested}</p>
          </div>
        </div>
      </div>

      {/* Referral Table */}

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-white/10 text-gray-400">
            <tr>
              <th className="text-left p-4">Username</th>
              <th className="text-left p-4">Email</th>
              <th className="text-left p-4">Joined</th>
              <th className="text-left p-4">Invested</th>
              <th className="text-left p-4">Bonus Earned</th>
            </tr>
          </thead>

          <tbody>
            {referrals.map((ref) => (
              <tr
                key={ref.id}
                className="border-b border-white/5 hover:bg-white/5"
              >
                <td className="p-4">{ref.username}</td>

                <td className="p-4 text-gray-400">{ref.email}</td>

                <td className="p-4 text-gray-400">{ref.joinedAt}</td>

                <td className="p-4 text-green-400">${ref.totalInvested}</td>

                <td className="p-4 text-yellow-400">${ref.bonusEarned}</td>
              </tr>
            ))}

            {referrals.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">
                  No referrals yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
