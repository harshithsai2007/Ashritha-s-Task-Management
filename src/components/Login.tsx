/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, ArrowLeft, Shield } from "lucide-react";

interface LoginProps {
  onLogin: (user: "ashritha" | "harshith") => void;
}

const CREDENTIALS: Record<string, { password: string; user: "ashritha" | "harshith" }> = {
  ashritha22: { password: "22may2007", user: "ashritha" },
  harshith22: { password: "22may2007", user: "harshith" },
};

export default function Login({ onLogin }: LoginProps) {
  const [selectedProfile, setSelectedProfile] = React.useState<string | null>(null);
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isShaking, setIsShaking] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProfile) return;

    const cred = CREDENTIALS[selectedProfile];
    if (cred && password === cred.password) {
      onLogin(cred.user);
    } else {
      setError("Incorrect password");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setTimeout(() => setError(""), 2000);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: "#F0E7D5" }}>
      {/* Warm ambient background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: "rgba(191,126,129,0.15)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ backgroundColor: "rgba(127,1,31,0.10)", animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl" style={{ backgroundColor: "rgba(33,40,66,0.06)" }} />
      </div>

      <AnimatePresence mode="wait">
        {!selectedProfile ? (
          /* Profile Selection Screen */
          <motion.div
            key="profiles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 text-center"
          >
            {/* Header */}
            <div className="mb-10">
              <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "rgba(33,40,66,0.08)", border: "1.5px solid rgba(33,40,66,0.15)" }}>
                <Shield className="h-7 w-7" style={{ color: "#212842" }} />
              </div>
              <h1 className="text-3xl font-black tracking-tight mb-2" style={{ color: "#212842" }}>
                Welcome Back
              </h1>
              <p className="text-sm" style={{ color: "#6b7280" }}>
                Choose your profile to continue
              </p>
            </div>

            {/* Profile Cards */}
            <div className="flex gap-6">
              {/* Ashritha Profile Card */}
              <motion.button
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedProfile("ashritha22")}
                className="group w-52 p-6 rounded-3xl cursor-pointer text-center transition-all duration-300"
                style={{ backgroundColor: "#fff0ee", border: "1.5px solid rgba(191,126,129,0.25)" }}
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #FFB3BA, #BF7E81)" }}>
                  <span className="text-2xl font-black text-white select-none">A</span>
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: "#212842" }}>ashritha22</h3>
                <p className="text-[11px] font-medium" style={{ color: "#9C6568" }}>AI Engineer</p>
                <div className="mt-4 py-1.5 px-4 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: "rgba(191,126,129,0.12)", border: "1px solid rgba(191,126,129,0.25)", color: "#BF7E81" }}>
                  Select
                </div>
              </motion.button>

              {/* Harshith Profile Card */}
              <motion.button
                whileHover={{ scale: 1.04, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedProfile("harshith22")}
                className="group w-52 p-6 rounded-3xl cursor-pointer text-center transition-all duration-300"
                style={{ backgroundColor: "#fdf5ee", border: "1.5px solid rgba(127,1,31,0.20)" }}
              >
                <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg, #7F011F, #a81a38)" }}>
                  <span className="text-2xl font-black text-white select-none">H</span>
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: "#212842" }}>harshith22</h3>
                <p className="text-[11px] font-medium" style={{ color: "#7F011F" }}>System Architect</p>
                <div className="mt-4 py-1.5 px-4 rounded-full text-[10px] font-bold uppercase tracking-widest" style={{ backgroundColor: "rgba(127,1,31,0.10)", border: "1px solid rgba(127,1,31,0.20)", color: "#7F011F" }}>
                  Select
                </div>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* Password Entry Screen */
          <motion.div
            key="password"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative z-10 w-full max-w-sm"
          >
            <form onSubmit={handleSubmit} className="text-center">
              {/* Back button */}
              <button
                type="button"
                onClick={() => {
                  setSelectedProfile(null);
                  setPassword("");
                  setError("");
                }}
                className="absolute -top-12 left-0 flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
                style={{ color: "#6b7280" }}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to profiles
              </button>

              {/* Avatar */}
              <div className={`w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center shadow-lg`}
                style={{
                  background: selectedProfile === "ashritha22"
                    ? "linear-gradient(135deg, #FFB3BA, #BF7E81)"
                    : "linear-gradient(135deg, #7F011F, #a81a38)"
                }}
              >
                <span className="text-2xl font-black text-white select-none">
                  {selectedProfile === "ashritha22" ? "A" : "H"}
                </span>
              </div>

              <h2 className="text-xl font-bold mb-1" style={{ color: "#212842" }}>{selectedProfile}</h2>
              <p className="text-xs mb-8" style={{ color: "#6b7280" }}>Enter your password to continue</p>

              {/* Password input */}
              <motion.div
                animate={isShaking ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.4 }}
              >
                <div className="relative mb-4">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "#9ca3af" }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Password"
                    autoFocus
                    className="w-full py-3.5 pl-11 pr-4 rounded-2xl text-sm outline-none transition-all"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.7)",
                      border: "1.5px solid rgba(33,40,66,0.15)",
                      color: "#212842",
                    }}
                    id="login-password-input"
                  />
                </div>
              </motion.div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="text-xs mb-4 font-medium"
                    style={{ color: "#dc2626" }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-2xl text-white text-sm font-bold tracking-wide transition-all cursor-pointer shadow-lg"
                style={{
                  backgroundColor: selectedProfile === "ashritha22" ? "#BF7E81" : "#7F011F",
                }}
                id="login-submit-button"
              >
                Sign In
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
