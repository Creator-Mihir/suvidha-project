import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Smartphone,
  ArrowRight,
  ShieldCheck,
  Lock,
  CheckCircle2,
  Loader2,
  Home,
  Delete,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import { requestOTP, verifyOTP } from "../services/authService";
import { getProfile } from "../services/citizenService";

function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation("login");

  const [step, setStep]       = useState(1);
  const [loading, setLoading] = useState(false);
  const [mobile, setMobile]   = useState("");
  const [otp, setOtp]         = useState("");
  const [timer, setTimer]     = useState(0);
  const [error, setError]     = useState("");

  // ─── Countdown Timer ─────────────────────────────────────────────────────────
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // ─── Keyboard Support ─────────────────────────────────────────────────────────
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key;

      if (/^[0-9]$/.test(key)) {
        setError("");
        if (step === 1 && mobile.length < 10) {
          setMobile((prev) => prev + key);
        } else if (step === 2 && otp.length < 6) {
          setOtp((prev) => prev + key);
        }
      }

      if (key === "Backspace") {
        setError("");
        if (step === 1) setMobile((prev) => prev.slice(0, -1));
        else setOtp((prev) => prev.slice(0, -1));
      }

      if (key === "Enter") {
        if (step === 1 && mobile.length === 10) handleSendOTP();
        if (step === 2 && otp.length === 6) handleVerify();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [step, mobile, otp]);

  // ─── Keypad Buttons ───────────────────────────────────────────────────────────
  const handleKeypadPress = (num) => {
    setError("");
    if (step === 1 && mobile.length < 10) {
      setMobile((prev) => prev + num);
    } else if (step === 2 && otp.length < 6) {
      setOtp((prev) => prev + num);
    }
  };

  const handleBackspace = () => {
    setError("");
    if (step === 1) setMobile((prev) => prev.slice(0, -1));
    else setOtp((prev) => prev.slice(0, -1));
  };

  // ─── Step 1: Send OTP ─────────────────────────────────────────────────────────
  const handleSendOTP = async () => {
    if (mobile.length < 10) return;
    setLoading(true);
    setError("");
    try {
      await requestOTP(mobile);
      setStep(2);
      setTimer(30);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Step 2: Verify OTP ───────────────────────────────────────────────────────
  const handleVerify = async () => {
    if (otp.length < 6) return;
    setLoading(true);
    setError("");
    try {
      const response = await verifyOTP(mobile, otp);
      if (response.success) {
        // Check if new user (no profile) or returning user
        try {
          const profileRes = await getProfile();
          if (profileRes.data.hasProfile) {
            navigate("/dashboard");      // returning user — go directly
          } else {
            navigate("/welcome-setup");  // new user — ask for name first
          }
        } catch {
          navigate("/dashboard");        // fallback if citizen-service is down
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  // ─── Resend OTP ───────────────────────────────────────────────────────────────
  const handleResendOTP = async () => {
    if (timer > 0) return;
    setLoading(true);
    setError("");
    try {
      await requestOTP(mobile);
      setTimer(30);
      setOtp("");
    } catch (err) {
      setError("Failed to resend OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-slate-50 font-[Inter]">

      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-200/40 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-orange-100/60 rounded-full blur-[80px]"></div>
      </div>

      {/* Home Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute w-35 top-8 left-8 z-50 flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-200 rounded-full text-slate-700 font-bold hover:bg-slate-50 transition-all shadow-md active:scale-95"
      >
        <ArrowLeft size={30} />
        <Home size={30} />
        {t("home")}
      </button>

      <div className="relative z-10 w-full max-w-[1800px] mx-auto flex flex-col lg:flex-row min-h-screen">

        {/* LEFT SIDE */}
        <div className="w-full lg:w-2/5 flex flex-col justify-center p-12 lg:p-20">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Emblem_of_India.svg/1200px-Emblem_of_India.svg.png"
                alt="Emblem"
                className="h-20 opacity-80"
              />
              <div className="h-8 w-[1px] bg-slate-300"></div>
              <span className="text-xl font-bold text-slate-500 uppercase tracking-widest whitespace-pre-line">
                {t("gov_secure")}
              </span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-800 mb-6 tracking-tight">
              {t("heading_line1")} <br />
              <span className="text-transparent pt-6 bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                {t("heading_line2")}
              </span>
            </h1>
            <p className="text-xl text-slate-500 max-w-lg leading-relaxed">
              {t("description")}
            </p>
          </div>
          <div className="flex items-center gap-3 p-4 bg-white/60 rounded-xl border border-white/50 shadow-sm max-w-xs">
            <div className="p-2 bg-green-100 text-green-700 rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-700">{t("secure_badge")}</p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="w-full lg:w-3/5 flex flex-col items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-3xl bg-white/90 backdrop-blur-2xl border-4 border-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] rounded-[3.5rem] p-10 lg:p-12">

            <div className="text-center mb-10">
              <h2 className="text-4xl font-black text-slate-900 mb-2">{t("welcome_back")}</h2>
              <p className="text-slate-500 text-lg">{t("enter_mobile_instruction")}</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-3 p-4 mb-4 bg-red-50 border-2 border-red-100 rounded-2xl text-red-600 font-bold">
                <AlertCircle size={22} />
                <span>{error}</span>
              </div>
            )}

            <div className="flex flex-col gap-1">

              {/* STEP 1: MOBILE ENTRY */}
              {step === 1 && (
                <div className="space-y-0">
                  <div className="relative group">
                    <Smartphone className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500" size={32} />
                    <input
                      readOnly
                      type="tel"
                      value={mobile}
                      placeholder={t("mobile_placeholder")}
                      className="w-full pl-20 pr-6 py-8 bg-slate-50 border-4 border-slate-100 rounded-[2rem] outline-none text-4xl font-black text-slate-800 tracking-[0.2em] transition-all focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => item === "C" ? handleBackspace() : handleKeypadPress(String(item))}
                        className={`h-20 rounded-3xl text-3xl font-black transition-all active:scale-95 shadow-lg flex items-center justify-center ${
                          item === "C"
                            ? "bg-red-50 text-red-500 border-2 border-red-100 hover:bg-red-500 hover:text-white"
                            : "bg-white text-slate-800 border-2 border-slate-100 hover:border-blue-500 hover:text-blue-600 shadow-slate-200/50"
                        }`}
                      >
                        {item === "C" ? <Delete size={36} /> : item}
                      </button>
                    ))}
                    <button
                      onClick={handleSendOTP}
                      disabled={mobile.length < 10 || loading}
                      className="h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" size={36} /> : <ArrowRight size={40} />}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: OTP ENTRY */}
              {step === 2 && (
                <div className="space-y-2">
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-green-50 text-green-700 rounded-full text-lg font-bold border-2 border-green-100">
                      <CheckCircle2 size={24} />{t("otp_sent", { mobile })}
                    </div>
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-orange-500" size={32} />
                    <input
                      readOnly
                      type="text"
                      value={otp}
                      placeholder={t("otp_placeholder")}
                      className="w-full h-9 pl-20 pr-6 py-8 bg-slate-50 border-4 border-slate-100 rounded-[2rem] outline-none text-4xl font-black text-slate-800 tracking-[0.5em] transition-all focus:border-orange-500 focus:bg-white text-center"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, "C", 0].map((item, i) => (
                      <button
                        key={i}
                        onClick={() => item === "C" ? handleBackspace() : handleKeypadPress(String(item))}
                        className={`h-20 w-30 rounded-3xl text-3xl font-black transition-all active:scale-95 shadow-lg flex items-center justify-center ${
                          item === "C"
                            ? "bg-red-50 text-red-500 border-2 border-red-100"
                            : "bg-white text-slate-800 border-2 border-slate-100 hover:border-orange-500"
                        }`}
                      >
                        {item === "C" ? <Delete size={36} /> : item}
                      </button>
                    ))}
                    <button
                      onClick={handleVerify}
                      disabled={otp.length < 6 || loading}
                      className="h-20 bg-orange-500 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-orange-200 active:scale-95 disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="animate-spin" size={36} /> : <CheckCircle2 size={40} />}
                    </button>
                  </div>

                  {/* Resend OTP */}
                  <div className="text-center">
                    {timer > 0 ? (
                      <p className="text-slate-400 font-bold text-lg">Resend OTP in {timer}s</p>
                    ) : (
                      <button onClick={handleResendOTP} className="text-blue-600 font-bold text-lg hover:underline">
                        Resend OTP
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => { setStep(1); setOtp(""); setError(""); }}
                    className="w-full text-slate-400 font-bold text-xl hover:text-blue-600 transition-colors"
                  >
                    {t("change_mobile")}
                  </button>
                </div>
              )}

            </div>
          </div>

          {/* ── Subtle Staff Login Button ── */}
          <button
            onClick={() => navigate("/admin/login")}
            className="mt-6 flex items-center gap-2 text-slate-400 text-sm font-semibold hover:text-slate-600 transition-colors border border-slate-200 px-5 py-2 rounded-full bg-white/70 hover:bg-white shadow-sm"
          >
            🔒 Staff / Officer Login
          </button>

        </div>
      </div>
    </div>
  );
}

export default Login;