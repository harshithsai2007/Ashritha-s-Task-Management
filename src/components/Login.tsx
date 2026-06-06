/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { Lock, ArrowLeft } from "lucide-react";

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

  const selectedUser = selectedProfile ? CREDENTIALS[selectedProfile]?.user : null;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#030107]" style={{ background: "radial-gradient(circle at center, #0F091D 0%, #030107 100%)" }}>
      
      {/* Animated 3D Glass Orbs Background - Spider-Verse Portal */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gwen Orb (Pink/Teal) */}
        <motion.div 
          animate={{ 
            x: [0, 60, -20, 0], 
            y: [0, -50, 40, 0], 
            scale: [1, 1.15, 0.9, 1]
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[110px] opacity-45" 
          style={{ background: "linear-gradient(135deg, #FF1493, #22D3EE)" }} 
        />
        {/* Miles Orb (Red/Black/Dark Purple) */}
        <motion.div 
          animate={{ 
            x: [0, -60, 40, 0], 
            y: [0, 60, -30, 0], 
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[-15%] right-[-15%] w-[600px] h-[600px] rounded-full blur-[120px] opacity-40" 
          style={{ background: "linear-gradient(135deg, #EF4444, #120A2A)" }} 
        />
        {/* Subtle background web grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none opacity-40" />
        <div className="absolute inset-0 backdrop-blur-[70px] z-0" />
      </div>

      <AnimatePresence mode="wait">
        {!selectedProfile ? (
          /* Profile Selection Screen */
          <motion.div
            key="profiles"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 flex flex-col items-center"
            style={{ fontFamily: "'Saonara', 'Italiana', 'Playfair Display', serif" }}
          >
            {/* Header with Cute Logo */}
            <div className="mb-12 text-center">
              <motion.div 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="w-24 h-24 mx-auto mb-6 rounded-[2rem] overflow-hidden flex items-center justify-center p-1"
                style={{ 
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.3), inset 0 2px 10px rgba(255,255,255,0.05)"
                }}
              >
                <img 
                  src="https://i.pinimg.com/1200x/9f/1e/c8/9f1ec8fadf609c05da366f9111d2bd70.jpg" 
                  alt="Cute Profile Logo" 
                  className="w-full h-full object-cover rounded-[1.75rem] shadow-md"
                />
              </motion.div>
              <motion.h1 
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="text-4xl font-black tracking-tight mb-2 text-white drop-shadow-[0_2px_15px_rgba(255,255,255,0.15)]"
              >
                Welcome Back
              </motion.h1>
              <motion.p 
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.05, ease: "easeOut" }}
                className="text-slate-400 font-medium tracking-wide text-sm"
              >
                Select your profile to load dashboard
              </motion.p>
            </div>

            {/* Profile Cards */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Ashritha Profile Card */}
              <motion.button
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5, 
                  boxShadow: "0 20px 40px rgba(255, 20, 147, 0.25), 0 0 20px rgba(34, 211, 238, 0.15)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedProfile("ashritha22")}
                className="group relative w-56 p-8 rounded-[2rem] cursor-pointer text-center transition-all duration-200 overflow-hidden"
                style={{ 
                  background: "rgba(255, 255, 255, 0.03)", 
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.05)"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <motion.div 
                  className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center relative z-10 overflow-hidden border border-white/10 group-hover:border-pink-500/30 transition-colors" 
                  style={{ 
                    background: "linear-gradient(135deg, #FF1493 0%, #22D3EE 100%)",
                    boxShadow: "0 10px 25px rgba(255, 20, 147, 0.3)"
                  }}
                >
                  <img src="https://i.pinimg.com/736x/40/14/ba/4014ba3d3a6ecb4b56f7488cd781b4f4.jpg" alt="A" className="w-full h-full object-cover" />
                </motion.div>
                <h3 className="text-xl font-bold mb-5 text-white relative z-10">ashritha22</h3>
                <div className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors relative z-10 border border-pink-500/20 group-hover:border-pink-500/60" 
                     style={{ background: "rgba(255, 20, 147, 0.08)", color: "#FF1493" }}>
                  Select
                </div>
              </motion.button>

              {/* Harshith Profile Card */}
              <motion.button
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.05, ease: "easeOut" }}
                whileHover={{ 
                  scale: 1.05, 
                  y: -5, 
                  boxShadow: "0 20px 40px rgba(239, 68, 68, 0.25), 0 0 20px rgba(0,0,0,0.5)"
                }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedProfile("harshith22")}
                className="group relative w-56 p-8 rounded-[2rem] cursor-pointer text-center transition-all duration-200 overflow-hidden"
                style={{ 
                  background: "rgba(255, 255, 255, 0.03)", 
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.2), inset 0 1px 2px rgba(255,255,255,0.05)"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <motion.div 
                  className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center relative z-10 overflow-hidden border border-white/10 group-hover:border-red-500/30 transition-colors" 
                  style={{ 
                    background: "linear-gradient(135deg, #EF4444 0%, #000000 100%)",
                    boxShadow: "0 10px 25px rgba(239, 68, 68, 0.3)"
                  }}
                >
                  <img src="https://i.pinimg.com/1200x/6a/af/47/6aaf47796dea920c7d50b0ae83b9fa4a.jpg" alt="H" className="w-full h-full object-cover" />
                </motion.div>
                <h3 className="text-xl font-bold mb-5 text-white relative z-10">harshith22</h3>
                <div className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors relative z-10 border border-red-500/20 group-hover:border-red-500/60" 
                     style={{ background: "rgba(239, 68, 68, 0.08)", color: "#EF4444" }}>
                  Select
                </div>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* Password Entry Screen */
          <motion.div
            key="password"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative z-10 w-full max-w-sm"
            style={{ fontFamily: "'Saonara', 'Italiana', 'Playfair Display', serif" }}
          >
            <div 
              className="p-8 rounded-[2.5rem] transition-all duration-300" 
              style={{ 
                background: "rgba(255, 255, 255, 0.04)", 
                backdropFilter: "blur(28px)",
                border: selectedUser === "ashritha" ? "1px solid rgba(255, 20, 147, 0.25)" : "1px solid rgba(239, 68, 68, 0.25)",
                boxShadow: selectedUser === "ashritha"
                  ? "0 30px 60px rgba(0,0,0,0.4), 0 0 30px rgba(255, 20, 147, 0.15), inset 0 1px 2px rgba(255,255,255,0.05)"
                  : "0 30px 60px rgba(0,0,0,0.4), 0 0 30px rgba(239, 68, 68, 0.15), inset 0 1px 2px rgba(255,255,255,0.05)"
              }}
            >
              <form onSubmit={handleSubmit} className="text-center relative">
                {/* Back button */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProfile(null);
                    setPassword("");
                    setError("");
                  }}
                  className="absolute -top-3 -left-2 flex items-center justify-center w-8 h-8 rounded-full bg-slate-900/60 border border-slate-700 text-slate-350 hover:text-white hover:scale-110 transition-all cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                {/* Avatar */}
                <motion.div 
                  initial={{ y: -20 }} 
                  animate={{ y: 0 }}
                  className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center overflow-hidden border border-white/10"
                  style={{
                    background: selectedUser === "ashritha"
                      ? "linear-gradient(135deg, #FF1493 0%, #22D3EE 100%)"
                      : "linear-gradient(135deg, #EF4444 0%, #000000 100%)",
                    boxShadow: selectedUser === "ashritha"
                      ? "0 15px 30px rgba(255, 20, 147, 0.35)"
                      : "0 15px 30px rgba(239, 68, 68, 0.35)"
                  }}
                >
                  <img 
                    src={selectedUser === "ashritha" ? "https://i.pinimg.com/736x/40/14/ba/4014ba3d3a6ecb4b56f7488cd781b4f4.jpg" : "https://i.pinimg.com/1200x/6a/af/47/6aaf47796dea920c7d50b0ae83b9fa4a.jpg"}
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                </motion.div>

                <h2 className="text-2xl font-black mb-1 text-white tracking-tight">{selectedProfile}</h2>
                <p className="text-sm mb-8 text-slate-400 font-medium">Enter password to unlock</p>

                {/* Password input */}
                <motion.div
                  animate={isShaking ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <div className="relative mb-6">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-450" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Password"
                      autoFocus
                      className="w-full py-4 pl-14 pr-5 rounded-[1.5rem] text-base outline-none transition-all placeholder-slate-500"
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.45)",
                        border: selectedUser === "ashritha" ? "1px solid rgba(255, 20, 147, 0.2)" : "1px solid rgba(239, 68, 68, 0.2)",
                        color: "#FFFFFF",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.3)"
                      }}
                    />
                  </div>
                </motion.div>

                {/* Error message */}
                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm mb-6 font-bold text-red-500"
                    >
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Submit button */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: selectedUser === "ashritha" ? "0 0 20px rgba(255,20,147,0.5)" : "0 0 20px rgba(239,68,68,0.5)" }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 rounded-[1.5rem] text-white text-base font-bold tracking-wide transition-all shadow-xl cursor-pointer"
                  style={{
                    background: selectedUser === "ashritha" 
                      ? "linear-gradient(135deg, #FF1493, #C01478)" 
                      : "linear-gradient(135deg, #EF4444, #991B1B)",
                  }}
                >
                  Sign In to Dashboard
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
