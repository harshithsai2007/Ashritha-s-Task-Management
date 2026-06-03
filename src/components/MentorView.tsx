/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { MessageSquare, Send, Sparkles, User, HelpCircle, ArrowUpRight, AlertCircle } from "lucide-react";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export default function MentorView() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      sender: "ai",
      text: "Hello Ashritha! I am your personal AI Career Growth Coach and ML Mentor. " +
            "Whether you need help understanding Backpropagation, formulating a robust pipeline for your document intelligence app, " +
            "drafting a LinkedIn post, or designing a complex DSA graph challenge — I am fully primed to help you. " +
            "What strategic concept should we master together today?"
    }
  ]);
  const [inputText, setInputText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [apiError, setApiError] = React.useState<string | null>(null);

  const quickQuestions = [
    { title: "Explain Backpropagation", text: "Explain multi-layer neural network backpropagation mathematics simply with calculus steps." },
    { title: "S3 Bucket Policies", text: "How do I write a secure JSON AWS IAM policy restricting bucket access to specific VPC roles?" },
    { title: "Sliding Window Pattern", text: "Explain the difference between fixed and variable Sliding Window DSA patterns on LeetCode." },
    { title: "Draft Project Brainstorm", text: "Help me brainstorm more portfolio-worthy milestone steps for the Model Ingestion phase of my document RAG tool." }
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage = { sender: "user" as const, text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setLoading(true);
    setApiError(null);

    try {
      const res = await fetch("/api/gemini/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed AI assistant request.");
      }

      setMessages(prev => [...prev, { sender: "ai", text: data.text }]);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "An unexpected error occurred. Verify your GEMINI_API_KEY.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" id="mentor-module-panel">
      
      {/* Title */}
      <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <MessageSquare className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white mb-0.5">AI Coach & Mentor</h2>
            <p className="text-xs text-slate-400">Interactive guidance. Ask deep machine learning equations, AWS infrastructure designs, or resume advice.</p>
          </div>
        </div>

        <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-900 flex items-center gap-2 text-[10px] font-mono text-cyan-400 font-bold">
          <Sparkles className="h-4.5 w-4.5 text-cyan-400 animate-pulse" />
          POWERED BY GEMINI 3.5 FLASH
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Quick query recommendations */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-[10px] font-mono tracking-wider font-semibold text-slate-400 uppercase">
            Suggested Coaching Queries
          </span>
          <div className="grid grid-cols-1 gap-2.5">
            {quickQuestions.map((q, i) => (
              <div
                key={i}
                onClick={() => handleSend(q.text)}
                className="p-3.5 bg-slate-900/40 border border-slate-900 hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all cursor-pointer rounded-2xl text-left group flex justify-between items-start"
              >
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-indigo-400 transition-colors mb-1">{q.title}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2">{q.text}</p>
                </div>
                <ArrowUpRight className="h-3 w-3 text-slate-600 group-hover:text-indigo-400 shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>

        {/* Messaging Box container */}
        <div className="lg:col-span-8 flex flex-col h-[480px] bg-slate-900 border border-slate-850 rounded-3xl p-5 overflow-hidden justify-between">
          
          {/* Chat history list */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 scrollbar-thin">
            {messages.map((m, i) => {
              const isAi = m.sender === "ai";
              return (
                <div key={i} className={`flex gap-3 text-left ${isAi ? "" : "flex-row-reverse"}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    isAi 
                      ? "bg-indigo-600 text-white" 
                      : "bg-slate-950 border border-indigo-500/30 text-indigo-400"
                  }`}>
                    {isAi ? <Sparkles className="h-4.5 w-4.5 animate-pulse" /> : <User className="h-4 w-4" />}
                  </div>
                  
                  <div className={`p-4 rounded-3xl max-w-[84%] text-xs leading-relaxed ${
                    isAi 
                      ? "bg-slate-950 text-slate-300 font-sans font-medium whitespace-pre-wrap border border-slate-900" 
                      : "bg-indigo-600 text-white font-semibold shadow shadow-indigo-500/10"
                  }`}>
                    {m.text}
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex gap-3 text-left">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 animate-bounce">
                  <Sparkles className="h-4.5 w-4.5 animate-spin" />
                </div>
                <div className="p-4 bg-slate-950 border border-slate-900 rounded-3xl text-xs text-slate-500 font-mono animate-pulse">
                  Gemini Agent Coach is computing detailed advice...
                </div>
              </div>
            )}

            {apiError && (
              <div className="flex gap-3 text-left">
                <div className="w-8 h-8 rounded-xl bg-red-650 text-white flex items-center justify-center shrink-0">
                  <AlertCircle className="h-4 w-4" />
                </div>
                <div className="p-4 bg-red-950/40 border border-red-900/30 rounded-3xl text-xs text-red-400 font-mono">
                  {apiError}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Send Input form bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputText);
            }} 
            className="flex gap-2 bg-slate-950 border border-slate-850 p-1.5 rounded-2xl"
          >
            <input
              type="text"
              placeholder="Ask me technical equation mappings, certified courses, or resume strategies..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 bg-transparent border-none text-xs text-white placeholder-slate-600 focus:outline-none pl-3"
            />
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-900 disabled:text-slate-700 text-white rounded-xl transition-colors shrink-0"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
