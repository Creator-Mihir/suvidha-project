import React, { useState, useEffect } from "react";
import { Globe, HelpCircle, Clock, ShieldCheck } from "lucide-react";
import govLogo from "../assets/gov.png";
import suvidaLogo from "../assets/logo.jpg";

function TopBar() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lang, setLang] = useState("EN");

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-8 h-24 flex items-center justify-between gap-4">
        
        {/* --- LEFT: Government Branding --- */}
        <div className="flex items-center gap-4 shrink-0">
          <img 
            src={govLogo} 
            alt="Government of India" 
            className="h-14 w-auto object-contain drop-shadow-sm" 
          />
          
          <div className="hidden md:block border-l-2 border-slate-300 pl-4 h-10">
            <h1 className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">
              Government of India
            </h1>
            <p className="text-[10px] font-semibold text-slate-400">
              Ministry of Electronics & IT
            </p>
          </div>
        </div>

        {/* --- CENTER: SUVIDHA Identity --- */}
        <div className="flex items-center gap-3 flex-1 justify-center">
          <img 
            src={suvidaLogo} 
            alt="Suvidha Logo" 
            className="h-12 w-12 rounded-xl shadow-md border border-slate-100" 
          />
          <div className="flex flex-col">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none">
              SUVIDHA <span className="text-blue-600">KIOSK</span>
            </h2>
            <p className="text-[10px] text-slate-500 font-medium hidden lg:block">
              Smart Urban Virtual Interactive Digital Helpdesk Assistant
            </p>
          </div>
        </div>

        {/* --- RIGHT: Utilities (Clock, Lang, Help) --- */}
        <div className="flex items-center gap-4 shrink-0">
          
          {/* Clock Widget */}
          <div className="hidden xl:flex flex-col items-end mr-2 text-right">
            <div className="text-xl font-bold text-slate-700 font-mono leading-none">
              {formatTime(currentTime)}
            </div>
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1">
              <Clock size={10} /> {formatDate(currentTime)}
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="h-8 w-[1px] bg-slate-200 hidden xl:block"></div>

          {/* Language Selector */}
          <button 
            className="flex items-center gap-2 bg-slate-100 hover:bg-blue-50 text-slate-700 px-4 py-2 rounded-full transition-colors border border-slate-200 group"
            onClick={() => setLang(lang === "EN" ? "HI" : "EN")}
          >
            <Globe size={18} className="text-slate-500 group-hover:text-blue-600" />
            <span className="font-bold text-sm">{lang === "EN" ? "English" : "हिंदी"}</span>
          </button>

          {/* Help / Secure Badge */}
          <div className="flex gap-2">
            <button className="p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors" title="Help">
              <HelpCircle size={20} />
            </button>
            <div className="hidden lg:flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold">
              <ShieldCheck size={14} /> Secure
            </div>
          </div>

        </div>
      </div>
      
      {/* Optional: Bottom Gradient Line for style */}
      <div className="h-[2px] w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-orange-500"></div>
    </header>
  );
}

export default TopBar;