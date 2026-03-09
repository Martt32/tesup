import { useState } from "react";
import { Upload, Eye, EyeOff } from "lucide-react";

export default function Settings() {
  const [showPassword, setShowPassword] = useState(false);

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
          <div className="w-24 h-24 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-gray-400">
            Avatar
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
          <Input label="First Name" placeholder="John" />
          <Input label="Last Name" placeholder="Doe" />
          <Input label="Username" placeholder="johndoe" />
          <Select label="Gender">
            <option>Select gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </Select>
          <Input label="Date of Birth" type="date" />
          <Input label="Location" placeholder="Nigeria" />
        </div>
      </Section>

      {/* ================= CONTACT INFO ================= */}
      <Section title="Contact Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Email Address" type="email" placeholder="user@email.com" />
          <Input label="Phone Number" placeholder="+234..." />
        </div>
      </Section>

      {/* ================= ACCOUNT META ================= */}
      <Section title="Account Information">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReadOnly label="Joined On" value="17 May 2025" />
          <ReadOnly label="Account Status" value="Active" />
        </div>
      </Section>

      {/* ================= CHANGE PASSWORD ================= */}
      <Section title="Change Password">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input label="Current Password" type="password" />
          
          <div className="relative">
            <label className="text-sm text-gray-400">New Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="input-glow mt-2 pr-12"
              placeholder="New password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[42px] text-gray-400 hover:text-purple-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <Input label="Confirm New Password" type="password" />
        </div>

        <div className="mt-6">
          <button
            className="px-8 py-3 rounded-xl 
            bg-gradient-to-r from-purple-600 to-indigo-600 
            hover:opacity-90 transition font-semibold"
          >
            Update Password
          </button>
        </div>
      </Section>

      {/* ===== SAVE BUTTON ===== */}
      <div className="flex justify-end">
        <button
          className="px-10 py-3 rounded-xl 
          bg-gradient-to-r from-purple-600 to-indigo-600 
          hover:opacity-90 transition font-semibold"
        >
          Save Changes
        </button>
      </div>

    </div>
  );
}

/* ================= SECTION ================= */

function Section({ title, children }) {
  return (
    <div
      className="bg-white/5 border border-white/10 backdrop-blur-xl 
      rounded-2xl p-6 space-y-6"
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </div>
  );
}

/* ================= INPUT ================= */

function Input({ label, type = "text", placeholder }) {
  return (
    <div>
      <label className="text-sm text-gray-400">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="input-glow mt-2"
      />
    </div>
  );
}

/* ================= SELECT ================= */

function Select({ label, children }) {
  return (
    <div>
      <label className="text-sm text-gray-400">{label}</label>
      <select className="input-glow mt-2">
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
