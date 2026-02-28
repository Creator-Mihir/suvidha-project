import React, { useState, useEffect } from "react";
import { Globe, HelpCircle, Clock, ShieldCheck, ChevronDown } from "lucide-react";
import { useTranslation } from "react-i18next";
import govLogo from "../assets/gov.png";
import suvidaLogo from "../assets/logo.jpg";

function TopBar() {
  const { t, i18n } = useTranslation("common");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showLangMenu, setShowLangMenu] = useState(false);

  const languages = [
    { code: "en", name: "English", native: "English" },
    { code: "hi", name: "Hindi", native: "हिंदी" },
    { code: "gu", name: "Gujarati", native: "ગુજરાતી" },
    { code: "mr", name: "Marathi", native: "मराठी" }
  ];

  const currentLang = languages.find(l => l.code === i18n.language) || languages[0];

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString(i18n.language === 'en' ? "en-IN" : i18n.language, {
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

  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("lang", code);
    setShowLangMenu(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all duration-300">
      <div className="max-w-[1920px] mx-auto px-4 lg:px-8 h-24 flex items-center justify-between gap-4">

        {/* --- LEFT: Government Branding --- */}
        <div className="flex items-center gap-4 shrink-0">
          <img
            src={govLogo}
            alt={t("governmentOfIndia")}
            className="h-14 w-auto object-contain drop-shadow-sm"
          />

          <div className="hidden md:block border-l-2 border-slate-300 pl-4 h-10">
            <h1 className="text-xs font-bold text-slate-500 uppercase tracking-widest leading-tight">
              {t("governmentOfIndia")}
            </h1>
            <p className="text-[10px] font-semibold text-slate-400">
              {t("ministryOfIT")}
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
              {t("kioskFullForm")}
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
          <div className="relative">
            <button
              className="flex items-center gap-2 bg-slate-100 hover:bg-blue-50 text-slate-700 px-4 py-2 rounded-full transition-colors border border-slate-200 group"
              onClick={() => setShowLangMenu(!showLangMenu)}
            >
              <Globe size={18} className="text-slate-500 group-hover:text-blue-600" />
              <span className="font-bold text-sm">{currentLang.native}</span>
              <ChevronDown size={14} className={`transition-transform ${showLangMenu ? 'rotate-180' : ''}`} />
            </button>

            {showLangMenu && (
              <div className="absolute top-full mt-2 right-0 bg-white border border-slate-200 shadow-xl rounded-2xl overflow-hidden z-50 w-40 animate-in fade-in slide-in-from-top-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    className={`w-full text-left px-4 py-3 text-sm font-bold hover:bg-blue-50 transition-colors ${i18n.language === lang.code ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700'}`}
                    onClick={() => changeLanguage(lang.code)}
                  >
                    {lang.native}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Help / Secure Badge */}
          <div className="flex gap-2">
            <button className="p-2.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors" title={t("help")}>
              <HelpCircle size={20} />
            </button>
            <div className="hidden lg:flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold">
              <ShieldCheck size={14} /> {t("secure")}
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