import { useState, useEffect } from "react";
import { Upload, Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";
import { useProfile } from "../hooks";
export default function Settings() {
  const { user } = useContext(AuthContext);

  const pf = useProfile();
  const profile = pf.profile;

  const formatDate = (value) => {
    if (!value) return "—";
    if (value?.toDate) return value.toDate().toLocaleString();
    return new Date(value).toLocaleString();
  };

  return (
    <div className="space-y-12">
      {/* ===== Header ===== */}
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-400 mt-2">
          Manage your account information and security
        </p>
      </div>

      {/* ================= PROFILE & AVATAR ================= */}
      <Section title="Profile Photo">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-gray-400 overflow-hidden">
            <img
              src={
                "https://plus.unsplash.com/premium_photo-1739786995646-480d5cfd83dc?q=80&w=580&auto=format&fit=crop"
              }
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <label className="cursor-pointer">
            <span className="px-5 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20 transition">
              Change Avatar
            </span>
            <input type="file" className="hidden" />
          </label>
        </div>
      </Section>

      {/* ================= PERSONAL INFO ================= */}
      <Section title="Personal Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name"
            name="firstName"
            value={profile.firstName}
          />
          <Input label="Last Name" name="lastName" value={profile.lastName} />
          <Input label="Username" name="username" value={profile.username} />
          <Select label="Gender" name="gender" value={profile.gender}>
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </Select>
          <Input
            label="Date of Birth"
            type="date"
            name="dob"
            value={profile.dob}
          />
          <Input label="Location" name="location" value={profile.location} />
        </div>
      </Section>

      {/* ================= CONTACT INFO ================= */}
      <Section title="Contact Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Email Address"
            type="email"
            name="email"
            value={profile.email}
          />
          <Input label="Phone Number" name="phone" value={profile.phone} />
        </div>
      </Section>

      {/* ================= ACCOUNT META ================= */}
      <Section title="Account Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReadOnly label="Joined On" value={formatDate(profile?.createdAt)} />
          <ReadOnly label="Account Status" value={profile.role} />
        </div>
      </Section>

      {/* ================= CHANGE PASSWORD ================= */}
      <Section title="Change Password">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Current Password" type="password" name="current" />

          <div className="relative">
            <label className="text-sm text-gray-400">New Password</label>
            <input
              name="new"
              className="input-glow mt-2 pr-12"
              placeholder="New password"
            />
            <button
              type="button"
              className="absolute right-3 top-[42px] text-gray-400 hover:text-purple-400"
            >
              {true ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Input label="Confirm New Password" type="password" name="confirm" />
        </div>

        <div className="mt-6">
          <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition font-semibold">
            Update Password
          </button>
        </div>
      </Section>

      {/* ===== SAVE BUTTON ===== */}
      <div className="flex justify-end">
        <button className="px-10 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 transition font-semibold">
          Save Changes
        </button>
      </div>
    </div>
  );
}

/* ================= SECTION ================= */
function Section({ title, children }) {
  return (
    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 space-y-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}

/* ================= INPUT ================= */
function Input({ label, type = "text", name, value, onChange }) {
  return (
    <div>
      <label className="text-sm text-gray-400">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="input-glow mt-2"
      />
    </div>
  );
}

/* ================= SELECT ================= */
function Select({ label, name, value, onChange, children }) {
  return (
    <div>
      <label className="text-sm text-gray-400">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="input-glow mt-2"
      >
        {children}
      </select>
    </div>
  );
}

/* ================= READ ONLY ================= */
function ReadOnly({ label, value }) {
  return (
    <div>
      <label className="text-sm text-gray-400">{label}</label>
      <div className="mt-2 px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-gray-300">
        {value}
      </div>
    </div>
  );
}
