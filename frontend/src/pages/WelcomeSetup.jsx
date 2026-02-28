import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, ArrowRight, Loader2, AlertCircle, MapPin } from "lucide-react";
import { setupProfile } from "../services/citizenService";
import { useTranslation } from "react-i18next";

function WelcomeSetup() {
  const navigate  = useNavigate();
  const { t } = useTranslation("welcome");
  const [step, setStep]         = useState(1); // 1 = name, 2 = location (optional)
  const [fullName, setFullName] = useState("");
  const [city, setCity]         = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSaveName = async () => {
    if (fullName.trim().length < 2) {
      setError(t("errors.nameRequired"));
      return;
    }

    setLoading(true);
    setError("");

    try {
      await setupProfile({ fullName: fullName.trim(), city: city.trim() });
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
        t("errors.saveFailed")
      );    } finally {
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    // Save with mobile as placeholder name
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('suvidha_user') || '{}');
      await setupProfile({ fullName: `User ${user.mobile?.slice(-4) || ''}` });
      navigate("/dashboard");
    } catch {
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-50 overflow-hidden font-[Inter]">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-[80px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-lg px-6">

        {/* Card */}
        <div className="bg-white/90 backdrop-blur-xl border-4 border-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.12)] rounded-[3rem] p-10">

          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={40} className="text-blue-600" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-slate-900 mb-2">
            {t("header.title")}
            </h2>
            <p className="text-slate-500 text-lg">
            {t("header.subtitle")}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 mb-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-600 font-bold text-sm">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {/* Name Input */}
          <div className="relative mb-4">
            <User className="absolute left-5 top-1/2 -translate-y-1/2 text-blue-400" size={22} />
            <input
              type="text"
              value={fullName}
              onChange={(e) => { setFullName(e.target.value); setError(""); }}
              onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
              placeholder={t("form.fullName")}
              className="w-full pl-14 pr-5 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-xl font-bold text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all"
              autoFocus
            />
          </div>

          {/* City Input (optional) */}
          <div className="relative mb-8">
            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Your city (optional)"
              className="w-full pl-14 pr-5 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg font-semibold text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all"
            />
          </div>

          {/* Continue Button */}
          <button
            onClick={handleSaveName}
            disabled={fullName.trim().length < 2 || loading}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl text-xl font-black flex items-center justify-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 active:scale-[0.98] disabled:opacity-50"
          >
            {loading
              ? <><Loader2 className="animate-spin" size={24} />{t("buttons.saving")}</>
              : <>{t("buttons.continue")} <ArrowRight size={24} /></>
            }
          </button>

          {/* Skip */}
          <button
            onClick={handleSkip}
            disabled={loading}
            className="w-full mt-4 text-slate-400 font-semibold text-base hover:text-slate-600 transition-colors"
          >
            {t("buttons.skip")}
          </button>

        </div>
      </div>
    </div>
  );
}

export default WelcomeSetup;