import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { 
  Globe, ArrowRight, Languages, Check, 
  Smartphone, Lock, ShieldCheck, Home, 
  Delete, Fingerprint, Bot, Sparkles, X, Send, Mic, MicOff, Loader2
} from "lucide-react";

// --- 1. GEMINI API CONFIG & HELPER ---
const apiKey = "AIzaSyB-vT1x6dGekB72JqzoGQOl_ljBliAZPiw"; // Environment provides this key at runtime

const callGemini = async (prompt, systemInstruction) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{ parts: [{ text: prompt }] }],
    systemInstruction: { parts: [{ text: systemInstruction }] }
  };

  let delay = 1000;
  for (let i = 0; i < 5; i++) {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const result = await response.json();
        return result.candidates?.[0]?.content?.parts?.[0]?.text;
      }
    } catch (e) { /* Silent retry */ }
    await new Promise(resolve => setTimeout(resolve, delay));
    delay *= 2;
  }
  throw new Error("Failed to connect to Suvidha AI. Please check your connection.");
};

// --- 2. TRANSLATIONS DATA ---
const translations = {
  en: {
    welcome: "Welcome to SUVIDHA",
    subtitle: "Your Unified Civic Services Portal",
    selectLang: "Select Language",
    loginTitle: "Login Securely",
    loginSubtitle: "Use the touch interface below",
    mobileLabel: "Mobile Number",
    otpLabel: "Verification OTP",
    home: "Home",
    back: "Back",
    sendOtp: "Send OTP",
    verify: "Verify & Login",
    secLabel: "Encrypted Session",
    aiGreet: "Hello! I am Suvidha AI. How can I assist you today?",
    aiPlaceholder: "Write or speak here...",
    smartHelp: "✨ Smart Help"
  },
  hi: {
    welcome: "सुविधा में आपका स्वागत है",
    subtitle: "आपका एकीकृत नागरिक सेवा पोर्टल",
    selectLang: "भाषा चुनें",
    loginTitle: "सुरक्षित लॉगिन",
    loginSubtitle: "नीचे दिए गए टच इंटरफेस का उपयोग करें",
    mobileLabel: "मोबाइल नंबर",
    otpLabel: "सत्यापन ओटीपी",
    home: "होम",
    back: "पीछे",
    sendOtp: "ओटीपी भेजें",
    verify: "सत्यापित करें",
    secLabel: "एन्क्रिप्टेड सत्र",
    aiGreet: "नमस्ते! मैं सुविधा AI हूँ। मैं आपकी कैसे सहायता कर सकता हूँ?",
    aiPlaceholder: "यहाँ लिखें या बोलें...",
    smartHelp: "✨ स्मार्ट सहायता"
  },
  mr: {
    welcome: "सुविधा मध्ये आपले स्वागत आहे",
    subtitle: "तुमचे एकीकृत नागरी सेवा पोर्टल",
    selectLang: "भाषा निवडा",
    loginTitle: "सुरक्षित लॉगिन",
    loginSubtitle: "खालील टच इंटरफेस वापरा",
    mobileLabel: "मोबाईल नंबर",
    otpLabel: "ओटीपी पडताळणी",
    home: "होम",
    back: "मागे",
    sendOtp: "ओटीपी पाठवा",
    verify: "लॉगिन करा",
    secLabel: "एनक्रिप्टेड सत्र",
    aiGreet: "नमस्कार! मी सुविधा AI आहे. मी तुम्हाला कशी मदत करू शकतो?",
    aiPlaceholder: "येथे लिहा किंवा बोला...",
    smartHelp: "✨ स्मार्ट मदत"
  }
};

const LanguageContext = createContext();
const useLanguage = () => useContext(LanguageContext);

// --- 3. ✨ REFINED SUVIDHA AI COMPONENT (KIOSK STYLE) ---
const SuvidhaAI = () => {
  const { lang, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: t.aiGreet }
  ]);
  const scrollRef = useRef(null);

  // Sync greeting when language changes
  useEffect(() => {
    setChatHistory([{ role: 'ai', text: t.aiGreet }]);
  }, [lang, t.aiGreet]);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatHistory, isTyping]);

  // Web Speech API Logic
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  if (recognition) {
    recognition.continuous = false;
    recognition.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';
    recognition.onresult = (event) => {
      setUserInput(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
  }

  const handleSend = async () => {
    if (!userInput.trim() || isTyping) return;
    
    const userText = userInput;
    setChatHistory(prev => [...prev, { role: 'user', text: userText }]);
    setUserInput("");
    setIsTyping(true);

    try {
      const systemPrompt = `You are Suvidha AI, a helpful Smart City Kiosk assistant. 
      The current language is ${lang}. Help the citizen with Electricity, Water, or Gas queries. 
      Keep answers short and clear for a kiosk screen.`;
      
      const aiResponse = await callGemini(userText, systemPrompt);
      setChatHistory(prev => [...prev, { role: 'ai', text: aiResponse }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'ai', text: "Service busy. Please try again." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-5 z-[100] flex flex-col items-start mb-10 pointer-events-none">      
      {isOpen && (
        <div className="mb-8 w-[450px] h-[600px] bg-slate-900/95 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] border-4 border-blue-500/20 overflow-hidden flex flex-col animate-in slide-in-from-bottom-20 pointer-events-auto">
          
          <div className="p-8 flex justify-between items-center bg-blue-600">
            <div className="flex items-center gap-4">
              <Bot size={40} className="text-white" />
              <h2 className="text-white text-2xl font-bold uppercase tracking-tight">Suvidha AI</h2>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="bg-white/20 p-3 rounded-full text-white active:scale-90 transition-transform"
            >
              <X size={32} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 p-8 overflow-y-auto space-y-6 bg-slate-50 custom-scrollbar">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-5 rounded-3xl text-xl shadow-sm ${
                  msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none border border-slate-200'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm">
                  <Loader2 className="animate-spin text-blue-600" size={28} />
                </div>
              </div>
            )}
          </div>

          <div className="p-6 bg-white border-t-2 border-slate-200">
            <div className="flex flex-col gap-4">
              <textarea 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder={t.aiPlaceholder}
                className="w-full h-24 bg-slate-100 rounded-2xl p-4 text-xl outline-none focus:ring-4 focus:ring-blue-500/20 resize-none"
              />
              <div className="flex gap-4">
                <button 
                  onClick={() => {
                    if (isListening) recognition?.stop();
                    else recognition?.start();
                    setIsListening(!isListening);
                  }}
                  className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl text-white font-bold text-xl active:scale-95 transition-all ${
                    isListening ? 'bg-red-500 animate-pulse' : 'bg-slate-700'
                  }`}
                >
                  {isListening ? <MicOff size={28} /> : <Mic size={28} />}
                  <span>{isListening ? "Listening..." : "Voice"}</span>
                </button>
                <button 
                  onClick={handleSend}
                  className="flex-1 bg-blue-600 flex items-center justify-center gap-3 py-5 rounded-2xl text-white font-bold text-xl active:scale-95 transition-all shadow-lg shadow-blue-200"
                >
                  <Send size={28} />
                  <span>Send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto relative group flex items-center justify-center transition-all duration-500 active:scale-90"
      >
        <div className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-40 animate-pulse"></div>
        <div className="relative bg-gradient-to-tr from-blue-600 to-indigo-700 p-8 rounded-full border-4 border-white/30 shadow-2xl flex flex-col items-center gap-1">
          <Sparkles className="text-white absolute -top-2 -right-2 animate-bounce" size={24} />
          <Bot size={56} className="text-white" />
          <span className="text-white font-black text-xs uppercase tracking-tighter">AI Help</span>
        </div>
      </button>
    </div>
  );
};

// --- 4. SHARED COMPONENTS ---
const KioskKeypad = ({ onPress, onBackspace, onAction, actionIcon, variant = "blue", loading = false }) => {
  const keys = [1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0];
  const accent = variant === "blue" ? "bg-blue-600 shadow-blue-500/20" : "bg-orange-500 shadow-orange-500/20";

  return (
    <div className="grid grid-cols-3 gap-3">
      {keys.map((k, i) => (
        <button
          key={i}
          onClick={() => k === "C" ? onBackspace() : onPress(k)}
          className="h-20 rounded-2xl text-2xl font-bold transition-all active:scale-90 flex items-center justify-center border bg-white/5 border-white/5 text-white hover:bg-white/10"
        >
          {k === "C" ? <Delete size={28} className="text-red-400" /> : k}
        </button>
      ))}
      <button onClick={onAction} disabled={loading} className={`h-20 rounded-2xl flex items-center justify-center text-white shadow-xl transition-all active:scale-95 ${accent}`}>
        {loading ? <Loader2 className="animate-spin" size={32} /> : actionIcon}
      </button>
    </div>
  );
};

// --- 5. PAGES ---
const LandingPage = () => {
  const { setLang } = useLanguage();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-10 overflow-hidden relative">
      <div className="absolute top-0 left-0 p-12 flex items-center gap-4">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1200px-Emblem_of_India.svg.png" className="h-16 invert brightness-0 opacity-80" />
        <div className="h-10 w-[1px] bg-white/20"></div>
        <span className="text-blue-400 font-bold tracking-[0.3em] text-[10px] uppercase">Smart Governance</span>
      </div>
      <div className="w-full max-w-5xl text-center space-y-12">
        <h1 className="text-7xl font-black text-white tracking-tighter">SUVIDHA</h1>
        <div className="grid grid-cols-3 gap-6">
          {['hi', 'en', 'mr'].map((id) => (
            <button key={id} onClick={() => { setLang(id); navigate("/login"); }} className="group bg-white/5 border border-white/10 p-10 rounded-[2.5rem] hover:bg-blue-600 transition-all active:scale-95 shadow-2xl">
              <Languages className="text-blue-500 group-hover:text-white mb-6 mx-auto" size={48} />
              <h2 className="text-3xl font-bold text-white mb-1">{id === 'hi' ? 'हिन्दी' : id === 'mr' ? 'मराठी' : 'English'}</h2>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const LoginPage = () => {
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [explaining, setExplaining] = useState(false);

  const smartExplain = async () => {
    setExplaining(true);
    try {
      const prompt = `Explain the ${step === 1 ? 'Mobile login' : 'OTP verification'} step for a kiosk.`;
      const msg = await callGemini(prompt, `Reply in ${lang}. Be brief.`);
      alert(msg);
    } catch (e) {} finally { setExplaining(false); }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex p-8 gap-8 font-[Inter]">
      <div className="w-[40%] bg-white/5 backdrop-blur-md rounded-[3rem] p-12 flex flex-col justify-between border border-white/10">
        <div>
          <h1 className="text-5xl font-black text-white mb-6 leading-tight">{t.welcome}</h1>
          <p className="text-slate-400 text-lg">{t.subtitle}</p>
        </div>
        <div className="space-y-4">
          <button onClick={smartExplain} className="w-full flex items-center justify-center gap-3 p-5 bg-indigo-600/20 border border-indigo-500/30 rounded-2xl text-indigo-300 font-bold active:scale-95">
            {explaining ? <Loader2 className="animate-spin" /> : <Sparkles size={24} />} {t.smartHelp}
          </button>
          <button onClick={() => navigate("/")} className="text-slate-500 flex items-center gap-2 px-2 uppercase font-black text-xs"><Home size={18} /> {t.home}</button>
        </div>
      </div>
      <div className="w-[60%] bg-white/10 backdrop-blur-2xl rounded-[3rem] border border-white/20 p-12 flex flex-col shadow-2xl">
        <div className="mb-10 text-center text-white">
          <h2 className="text-4xl font-bold">{t.loginTitle}</h2>
          <p className="text-slate-400">{t.loginSubtitle}</p>
        </div>
        <div className="space-y-8 flex-1 flex flex-col justify-center max-w-lg mx-auto w-full">
          <div className="relative bg-slate-900/60 p-8 rounded-3xl border border-white/10 flex items-center gap-8">
            <div className={`p-5 rounded-2xl ${step === 1 ? 'bg-blue-600' : 'bg-orange-500'}`}>
              {step === 1 ? <Smartphone className="text-white" size={36} /> : <Lock className="text-white" size={36} />}
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.4em] block mb-2">{step === 1 ? t.mobileLabel : t.otpLabel}</label>
              <div className="text-5xl font-mono font-bold text-white tracking-[0.2em]">
                {step === 1 ? (mobile || "··········") : (otp || "······")}
              </div>
            </div>
          </div>
          <KioskKeypad 
            onPress={(n) => step === 1 ? setMobile(p => (p + n).slice(0, 10)) : setOtp(p => (p + n).slice(0, 6))}
            onBackspace={() => step === 1 ? setMobile(p => p.slice(0, -1)) : setOtp(p => p.slice(0, -1))}
            onAction={() => step === 1 ? (mobile.length === 10 && setStep(2)) : (otp.length === 6 && navigate("/dashboard"))}
            actionIcon={step === 1 ? <ArrowRight size={36} /> : <Check size={36} />}
            variant={step === 1 ? "blue" : "orange"}
          />
        </div>
      </div>
    </div>
  );
};

// --- 6. MAIN APP ---
export default function App() {
  const [currentLang, setCurrentLang] = useState('en');
  const value = { lang: currentLang, setLang: setCurrentLang, t: translations[currentLang] };

  return (
    <LanguageContext.Provider value={value}>
      <Router>
        <div className="min-h-screen relative overflow-hidden bg-[#0f172a]">
          <SuvidhaAI />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<div className="p-20 text-center text-white">Verified! <button onClick={() => window.location.href='/'}>Exit</button></div>} />
          </Routes>
        </div>
      </Router>
    </LanguageContext.Provider>
  );
}