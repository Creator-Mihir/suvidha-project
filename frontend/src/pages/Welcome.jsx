import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, ArrowRight, ShieldCheck, Zap, Droplets, FileText } from "lucide-react";
import i18n from "../i18n";
function Welcome() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  // Trigger animations on mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const languages = [
    { code: "en", name: "English", script: "English" },
    { code: "hi", name: "Hindi", script: "हिंदी" },
    { code: "mr", name: "Marathi", script: "मराठी" },
    { code: "gu", name: "Gujarati", script: "ગુજરાતી" },
    { code: "pa", name: "Punjabi", script: "ਪੰਜਾਬੀ" },
    { code: "ta", name: "Tamil", script: "தமிழ்" },
    { code: "te", name: "Telugu", script: "తెలుగు" },
    { code: "bn", name: "Bengali", script: "বাংলা" }
  ];

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-slate-50 font-[Inter]">
      
      {/* --- Dynamic Background --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-100/60 rounded-full blur-[80px]"></div>
        <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] bg-indigo-100/50 rounded-full blur-[60px] animate-bounce-slow"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1600px] mx-auto flex flex-col lg:flex-row h-screen p-6 lg:p-12 gap-8">
        
        {/* --- LEFT: Hero & Info Section --- */}
        <div className={`w-full lg:w-1/2 flex flex-col justify-center transition-all duration-1000 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
          
          {/* 1. Top Left: Emblem & Ministry Text */}
          <div className="flex items-center gap-5 mb-12">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1200px-Emblem_of_India.svg.png" alt="Emblem" className="h-16 opacity-90" />
            <div className="h-12 w-[2px] bg-slate-300"></div>
            <p className="text-sm text-slate-500 font-bold uppercase tracking-widest leading-relaxed">
              Ministry of Electronics & IT <br /> Government of India
            </p>
          </div>

          {/* 2. Badge */}
          <div className="mb-6">
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase">
              Smart City Mission
            </span>
          </div>

          {/* 3. Main Heading: SUVIDHA */}
          <h1 className="text-6xl lg:text-8xl font-black text-slate-800 leading-none mb-2 tracking-tight">
            SUVIDHA
          </h1>
          <h2 className="text-3xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-8">
            Digital Citizen Kiosk
          </h2>

          {/* 4. Description */}
          <p className="text-slate-500 text-xl mb-10 max-w-lg leading-relaxed">
            Unified Self-Service Portal for Electricity, Water, Gas, and Municipal Services. Access essential civic services quickly and securely without queues.
          </p>

          {/* 5. Feature Grid */}
          <div className="grid grid-cols-2 gap-4">
            <FeatureItem icon={Zap} text="Electricity Bill" color="bg-yellow-100 text-yellow-700" />
            <FeatureItem icon={Droplets} text="Water Services" color="bg-blue-100 text-blue-700" />
            <FeatureItem icon={FileText} text="Certificates" color="bg-green-100 text-green-700" />
            <FeatureItem icon={ShieldCheck} text="Secure Login" color="bg-purple-100 text-purple-700" />
          </div>
        </div>

        {/* --- RIGHT: Language Selection Card (Unchanged) --- */}
        <div className={`w-full lg:w-1/2 flex items-center justify-center transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 shadow-2xl rounded-[3rem] p-10 w-full max-w-xl relative overflow-hidden">
            
            {/* Decorative Circle */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-[60px] opacity-20"></div>

            <div className="text-center mb-10 relative z-10">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-200">
                <Globe size={32} />
              </div>
              <h2 className="text-3xl font-bold text-slate-800">Select Language</h2>
              <p className="text-slate-500 mt-2">कृपया अपनी भाषा चुनें</p>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {languages.map((lang, index) => (
                <button
                  key={index}
                  onClick={() => {
                    i18n.changeLanguage(lang.code);   // 🔥 instantly updates language
                    localStorage.setItem("lang", lang.code);
                    navigate("/login");
                  }}  
                   className="group relative flex flex-col items-center justify-center p-6 bg-white border border-slate-100 rounded-2xl hover:border-blue-500 hover:shadow-lg transition-all duration-300 active:scale-95"
                >
                  <span className="text-2xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                    {lang.script}
                  </span>
                  <span className="text-xs text-slate-400 mt-1 group-hover:text-blue-400">
                    {lang.name}
                  </span>
                  
                  {/* Hover Indicator */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
                  </div>
                </button>
              ))}
            </div>

            <button 
             onClick={() => {
              i18n.changeLanguage(lang.code);  // 🔥 instantly updates language
              localStorage.setItem("lang", lang.code);
              navigate("/login");
            }}
              className="w-full mt-8 bg-slate-900 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-slate-800 hover:shadow-xl transition-all active:scale-[0.98]"
            >
             Select language to continue / आगे बढ़ने के लिए भाषा चुनें <ArrowRight size={20} />
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

// Small Helper Component for Features
const FeatureItem = ({ icon: Icon, text, color }) => (
  <div className="flex items-center gap-3 p-4 bg-white/60 rounded-xl border border-white/40 shadow-sm backdrop-blur-sm hover:bg-white/80 transition-colors">
    <div className={`p-2 rounded-lg ${color}`}>
      <Icon size={20} />
    </div>
    <span className="text-sm font-bold text-slate-700">{text}</span>
  </div>
);

export default Welcome;