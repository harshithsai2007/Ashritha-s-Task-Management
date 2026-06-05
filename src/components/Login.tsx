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

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: "linear-gradient(135deg, #FDFBFB 0%, #EBEDEE 100%)" }}>
      {/* Animated 3D Glass Orbs Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, -50, 0], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[80px] opacity-60" 
          style={{ background: "linear-gradient(135deg, #FFB3BA, #FFDFD3)" }} 
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, 50, 0], rotate: [0, -90, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[100px] opacity-40" 
          style={{ background: "linear-gradient(135deg, #A1C4FD, #C2E9FB)" }} 
        />
        <div className="absolute inset-0 backdrop-blur-[60px] z-0" />
      </div>

      <AnimatePresence mode="wait">
        {!selectedProfile ? (
          /* Profile Selection Screen */
          <motion.div
            key="profiles"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex flex-col items-center"
          >
            {/* Header with Cute Logo */}
            <div className="mb-12 text-center">
              <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.1, type: "spring" }}
                className="w-24 h-24 mx-auto mb-6 rounded-[2rem] overflow-hidden flex items-center justify-center p-1"
                style={{ 
                  background: "rgba(255, 255, 255, 0.4)",
                  border: "2px solid rgba(255, 255, 255, 0.8)",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.08), inset 0 2px 10px rgba(255,255,255,0.8)"
                }}
              >
                <img 
                  src="https://i.pinimg.com/1200x/9f/1e/c8/9f1ec8fadf609c05da366f9111d2bd70.jpg" 
                  alt="Cute Profile Logo" 
                  className="w-full h-full object-cover rounded-[1.75rem] shadow-sm"
                />
              </motion.div>
              <motion.h1 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-4xl font-black tracking-tight mb-2 text-slate-800"
              >
                Welcome Back
              </motion.h1>
              <motion.p 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-slate-500 font-medium"
              >
                Who's logging in today?
              </motion.p>
            </div>

            {/* Profile Cards */}
            <div className="flex flex-col sm:flex-row gap-6">
              {/* Ashritha Profile Card */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, type: "spring" }}
                whileHover={{ scale: 1.05, y: -5, boxShadow: "0 25px 50px rgba(191,126,129,0.15)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedProfile("ashritha22")}
                className="group relative w-56 p-8 rounded-[2rem] cursor-pointer text-center transition-all duration-500 overflow-hidden"
                style={{ 
                  background: "rgba(255, 255, 255, 0.6)", 
                  border: "1px solid rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.04), inset 0 1px 2px rgba(255,255,255,0.8)"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-pink-100/30 to-rose-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div 
                  className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center relative z-10" 
                  style={{ 
                    background: "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)",
                    boxShadow: "0 15px 30px rgba(255, 154, 158, 0.3), inset 0 2px 4px rgba(255,255,255,0.4)"
                  }}
                >
                  <span className="text-3xl font-black text-white select-none drop-shadow-sm">A</span>
                </motion.div>
                <h3 className="text-xl font-bold mb-1 text-slate-800 relative z-10">ashritha22</h3>
                <p className="text-xs font-semibold text-rose-400 mb-6 relative z-10">AI Engineer</p>
                <div className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors relative z-10" 
                     style={{ background: "rgba(255, 154, 158, 0.15)", color: "#D81B60" }}>
                  Select
                </div>
              </motion.button>

              {/* Harshith Profile Card */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, type: "spring" }}
                whileHover={{ scale: 1.05, y: -5, boxShadow: "0 25px 50px rgba(37,99,235,0.15)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedProfile("harshith22")}
                className="group relative w-56 p-8 rounded-[2rem] cursor-pointer text-center transition-all duration-500 overflow-hidden"
                style={{ 
                  background: "rgba(255, 255, 255, 0.6)", 
                  border: "1px solid rgba(255, 255, 255, 0.9)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.04), inset 0 1px 2px rgba(255,255,255,0.8)"
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-indigo-100/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div 
                  className="w-20 h-20 mx-auto mb-5 rounded-2xl flex items-center justify-center relative z-10" 
                  style={{ 
                    background: "linear-gradient(135deg, #2563EB, #DC2626)",
                    boxShadow: "0 15px 30px rgba(37, 99, 235, 0.3), inset 0 2px 4px rgba(255,255,255,0.4)"
                  }}
                >
                  <span className="text-3xl font-black text-white select-none drop-shadow-sm">H</span>
                </motion.div>
                <h3 className="text-xl font-bold mb-1 text-slate-800 relative z-10">harshith22</h3>
                <p className="text-xs font-semibold text-blue-500 mb-6 relative z-10">System Architect</p>
                <div className="w-full py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors relative z-10" 
                     style={{ background: "rgba(37, 99, 235, 0.1)", color: "#2563EB" }}>
                  Select
                </div>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* Password Entry Screen */
          <motion.div
            key="password"
            initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-sm"
          >
            <div className="p-8 rounded-[2.5rem]" style={{ 
              background: "rgba(255, 255, 255, 0.7)", 
              backdropFilter: "blur(24px)",
              border: "1px solid rgba(255, 255, 255, 0.9)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.08), inset 0 1px 2px rgba(255,255,255,0.8)"
            }}>
              <form onSubmit={handleSubmit} className="text-center relative">
                {/* Back button */}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedProfile(null);
                    setPassword("");
                    setError("");
                  }}
                  className="absolute -top-3 -left-2 flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100 text-slate-400 hover:text-slate-700 hover:scale-110 transition-all cursor-pointer"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                {/* Avatar */}
                <motion.div 
                  initial={{ y: -20 }} animate={{ y: 0 }}
                  className="w-24 h-24 mx-auto mb-6 rounded-2xl flex items-center justify-center"
                  style={{
                    background: selectedProfile === "ashritha22"
                      ? "linear-gradient(135deg, #FF9A9E 0%, #FECFEF 99%, #FECFEF 100%)"
                      : "linear-gradient(135deg, #2563EB, #DC2626)",
                    boxShadow: selectedProfile === "ashritha22"
                      ? "0 20px 40px rgba(255, 154, 158, 0.4), inset 0 2px 4px rgba(255,255,255,0.5)"
                      : "0 20px 40px rgba(37, 99, 235, 0.3), inset 0 2px 4px rgba(255,255,255,0.5)"
                  }}
                >
                  <span className="text-4xl font-black text-white select-none drop-shadow-md">
                    {selectedProfile === "ashritha22" ? "A" : "H"}
                  </span>
                </motion.div>

                <h2 className="text-2xl font-black mb-1 text-slate-800 tracking-tight">{selectedProfile}</h2>
                <p className="text-sm mb-8 text-slate-500 font-medium">Enter your password to unlock</p>

                {/* Password input */}
                <motion.div
                  animate={isShaking ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                >
                  <div className="relative mb-6">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Password"
                      autoFocus
                      className="w-full py-4 pl-14 pr-5 rounded-[1.5rem] text-base outline-none transition-all focus:ring-4 placeholder-slate-400"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.9)",
                        border: "1px solid rgba(226, 232, 240, 0.8)",
                        color: "#1E293B",
                        boxShadow: "inset 0 2px 4px rgba(0,0,0,0.02)"
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
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-4 rounded-[1.5rem] text-white text-base font-bold tracking-wide transition-all shadow-xl"
                  style={{
                    background: selectedProfile === "ashritha22" ? "linear-gradient(135deg, #FF9A9E, #D81B60)" : "linear-gradient(135deg, #2563EB, #DC2626)",
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
