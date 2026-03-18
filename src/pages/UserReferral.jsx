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

  const referralCode = user?.uid.slice(0, 8).toUpperCase() || "";
  const referralLink = referralCode
    ? `${window.location.origin}/complete-profile?ref=${referralCode}`
    : "";

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

  const copyCode = async () => {
    if (!referralCode) return;

    try {
      await navigator.clipboard.writeText(referralCode);
      toast.success("Referral code copied");
    } catch {
      toast.error("Failed to copy referral code");
    }
  };
  const copyLink = async () => {
    if (!referralLink) return;

    try {
      await navigator.clipboard.writeText(referralLink);
      toast.success("Referral link copied");
    } catch {
      toast.error("Failed to copy referral Link");
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Referrals</h1>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Invite friends and earn bonuses
        </p>
      </div>

      {/* Referral Code */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-6">
        <p className="text-sm text-gray-400 mb-2">Your Referral Code</p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="bg-black/40 px-4 py-3 rounded-lg font-mono text-sm sm:text-base break-all w-full">
            {referralCode || "—"}
          </div>

          <button
            onClick={copyCode}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-lg w-full sm:w-auto whitespace-nowrap transition"
          >
            <Copy size={16} />
            {/* Copy */}
          </button>
        </div>
        Optional referral link
        <p className="text-sm text-gray-400 mt-4">Referral Link</p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <div className="mt-2 bg-black/40 p-3 rounded-lg break-all text-sm">
            {referralLink}
          </div>
          <button
            onClick={copyLink}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-lg w-full sm:w-auto whitespace-nowrap transition"
          >
            <Copy size={16} />
            {/* Copy */}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 flex items-center gap-4">
          <Users className="shrink-0" />
          <div>
            <p className="text-gray-400 text-sm">Total Referrals</p>
            <p className="text-lg sm:text-xl font-bold">
              {stats.totalReferrals}
            </p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 flex items-center gap-4">
          <DollarSign className="shrink-0" />
          <div>
            <p className="text-gray-400 text-sm">Bonus Earned</p>
            <p className="text-lg sm:text-xl font-bold">
              ${Number(stats.totalBonus || 0).toLocaleString()}
            </p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-6 flex items-center gap-4">
          <DollarSign className="shrink-0" />
          <div>
            <p className="text-gray-400 text-sm">Total Invested</p>
            <p className="text-lg sm:text-xl font-bold">
              ${Number(stats.totalInvested || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 lg:hidden">
        {referrals.length > 0 ? (
          referrals.map((ref) => (
            <div
              key={ref.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-gray-500">Username</p>
                  <p className="font-medium">{ref.username || "—"}</p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-gray-500">Bonus Earned</p>
                  <p className="text-yellow-400 font-medium">
                    ${Number(ref.bonusEarned || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-gray-400 break-all">{ref.email || "—"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Joined</p>
                  <p className="text-gray-400">{ref.joinedAt || "—"}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Invested</p>
                  <p className="text-green-400">
                    ${Number(ref.totalInvested || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center text-gray-500">
            No referrals yet
          </div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden lg:block bg-white/5 border border-white/10 rounded-2xl overflow-x-auto">
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
                className="border-b border-white/5 hover:bg-white/5 transition"
              >
                <td className="p-4">{ref.username || "—"}</td>
                <td className="p-4 text-gray-400">{ref.email || "—"}</td>
                <td className="p-4 text-gray-400">{ref.joinedAt || "—"}</td>
                <td className="p-4 text-green-400">
                  ${Number(ref.totalInvested || 0).toLocaleString()}
                </td>
                <td className="p-4 text-yellow-400">
                  ${Number(ref.bonusEarned || 0).toLocaleString()}
                </td>
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
