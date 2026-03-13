import { useEffect, useState } from "react";
import { db } from "../db/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Search, Users, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminReferrals() {
  const [referrals, setReferrals] = useState([]);
  const [search, setSearch] = useState("");

  const [stats, setStats] = useState({
    totalReferrals: 0,
    totalBonus: 0,
    totalInvested: 0,
  });

  useEffect(() => {
    const fetchReferrals = async () => {
      const usersSnap = await getDocs(collection(db, "users"));

      let list = [];
      let totalBonus = 0;
      let totalInvested = 0;
      let totalReferrals = 0;

      for (const userDoc of usersSnap.docs) {
        const userId = userDoc.id;

        const refSnap = await getDocs(
          collection(db, "users", userId, "referrals")
        );

        refSnap.forEach((doc) => {
          const data = doc.data();

          totalBonus += data.bonusEarned || 0;
          totalInvested += data.totalInvested || 0;
          totalReferrals++;

          list.push({
            id: doc.id,
            ...data,
            joinedAt: data.joinedAt?.toDate()?.toLocaleString() || "-",
          });
        });
      }

      setReferrals(list);

      setStats({
        totalReferrals,
        totalBonus,
        totalInvested,
      });
    };

    fetchReferrals();
  }, []);

  const filtered = referrals.filter((r) => {
    const name = r.username || "";
    const email = r.email || "";

    return (
      name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-10">Referral System</h1>

      {/* Stats */}

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex gap-4 items-center"
        >
          <Users />
          <div>
            <p className="text-zinc-400 text-sm">Total Referrals</p>
            <p className="text-xl font-bold">{stats.totalReferrals}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex gap-4 items-center"
        >
          <DollarSign />
          <div>
            <p className="text-zinc-400 text-sm">Total Bonus Paid</p>
            <p className="text-xl font-bold">${stats.totalBonus}</p>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex gap-4 items-center"
        >
          <DollarSign />
          <div>
            <p className="text-zinc-400 text-sm">Total Invested</p>
            <p className="text-xl font-bold">${stats.totalInvested}</p>
          </div>
        </motion.div>
      </div>

      {/* Search */}

      <div className="relative mb-6 max-w-sm">
        <Search size={18} className="absolute left-3 top-3 text-zinc-400" />

        <input
          className="bg-zinc-900 border border-zinc-800 pl-10 pr-4 py-2 rounded-lg w-full"
          placeholder="Search username or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-zinc-800 text-zinc-400">
            <tr>
              <th className="p-4 text-left">Username</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-left">User ID</th>
              <th className="p-4 text-left">Joined</th>
              <th className="p-4 text-left">Total Invested</th>
              <th className="p-4 text-left">Bonus Earned</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((r) => (
              <tr
                key={r.id}
                className="border-b border-zinc-800 hover:bg-zinc-800/40"
              >
                <td className="p-4">{r.username}</td>

                <td className="p-4 text-zinc-400">{r.email}</td>

                <td className="p-4 text-xs text-zinc-500">{r.userId}</td>

                <td className="p-4 text-zinc-400">{r.joinedAt}</td>

                <td className="p-4 text-green-400">${r.totalInvested || 0}</td>

                <td className="p-4 text-yellow-400">${r.bonusEarned || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
