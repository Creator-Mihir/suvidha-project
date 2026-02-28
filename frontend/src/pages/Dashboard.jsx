import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import TopBar from "../components/TopBar";
import { getUser } from "../services/authService";
import { getProfile } from "../services/citizenService";
import {
  Zap, Droplets, Flame, Building2,
  FileText, MapPin, ArrowRight, User, ChevronLeft
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();
  const { t } = useTranslation("dashboard");

  const [citizenName, setCitizenName] = useState("");
  const [mobile, setMobile]           = useState("");

  useEffect(() => {
    const user = getUser();
    if (user?.full_name) {
      setCitizenName(user.full_name);
      setMobile(user.mobile);
    } else if (user?.mobile) {
      setMobile(user.mobile);
    }

    getProfile()
      .then((res) => {
        if (res.data?.profile?.full_name) {
          setCitizenName(res.data.profile.full_name);
          const u = getUser();
          if (u) {
            u.full_name = res.data.profile.full_name;
            localStorage.setItem('suvidha_user', JSON.stringify(u));
          }
        }
      })
      .catch(() => {});
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t("greeting.morning", { defaultValue: "Good Morning" });
    if (hour < 17) return t("greeting.afternoon", { defaultValue: "Good Afternoon" });
    return t("greeting.evening", { defaultValue: "Good Evening" });
  };

  const services = [
    {
      title: t("services.electricity.title"),
      desc: t("services.electricity.desc"),
      icon: Zap,
      path: "/electricity",
      color: "bg-yellow-100 text-yellow-600",
      border: "hover:border-yellow-400"
    },
    {
      title: t("services.water.title"),
      desc: t("services.water.desc"),
      icon: Droplets,
      path: "/water",
      color: "bg-blue-100 text-blue-600",
      border: "hover:border-blue-400"
    },
    {
      title: t("services.gas.title"),
      desc: t("services.gas.desc"),
      icon: Flame,
      path: "/gas",
      color: "bg-orange-100 text-orange-600",
      border: "hover:border-orange-400"
    },
    {
      title: t("services.municipality.title"),
      desc: t("services.municipality.desc"),
      icon: Building2,
      path: "/municipality",
      color: "bg-purple-100 text-purple-600",
      border: "hover:border-purple-400"
    },
    {
      title: t("services.receipts.title"),
      desc: t("services.receipts.desc"),
      icon: FileText,
      path: "/receipts",
      color: "bg-green-100 text-green-600",
      border: "hover:border-green-400"
    },
    {
      title: t("services.track.title"),
      desc: t("services.track.desc"),
      icon: MapPin,
      path: "/track",
      color: "bg-red-100 text-red-600",
      border: "hover:border-red-400"
    }
  ];

  return (
    <div className="relative min-h-screen bg-slate-50 font-[Inter] overflow-hidden">
      <TopBar />

      <div className="relative z-10 p-6 lg:p-10 max-w-[1600px] mx-auto pb-32">

        {/* ── Welcome Header ── */}
        <div className="mb-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

          {/* Left: Back button + greeting */}
          <div className="flex items-center gap-4">

            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-2xl bg-blue-50 border-2 border-blue-400 shadow-sm   hover:shadow-md active:scale-95 transition-all duration-200 group"
              title="Go back"
            > 
              <ChevronLeft
                size={24}
                className="text-slate-500 group-hover:text-blue-600 transition-colors"
              />Go Back
            </button>

            {/* Greeting text */}
            <div>
              <span className="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-700 text-xs font-bold tracking-widest uppercase mb-3">
                {t("header.badge")}
              </span>
              <h2 className="text-4xl font-black text-slate-800 mb-1 tracking-tight">
                {citizenName
                  ? <>{getGreeting()}, <span className="text-blue-600">{citizenName}!</span></>
                  : t("header.title")
                }
              </h2>
              <p className="text-slate-500 text-lg">
                {t("header.subtitle")}
              </p>
            </div>
          </div>

          {/* Right: User info pill */}
          <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-full px-5 py-3 shadow-sm w-fit">
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center">
              <User size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-sm leading-tight">
                {citizenName || t("common.citizen")}
              </p>
              <p className="text-slate-400 text-xs">
                +91 {mobile?.replace(/(\d{5})(\d{5})/, '$1 $2')}
              </p>
            </div>
          </div>
        </div>

        {/* ── Service Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-20">
          {services.map((service, index) => (
            <div
              key={index}
              onClick={() => navigate(service.path)}
              className={`group bg-white/80 backdrop-blur-xl border border-white/50 p-8 rounded-[2rem] shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer active:scale-[0.98] ${service.border}`}
            >
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${service.color}`}>
                <service.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                {service.title}
              </h3>
              <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                {service.desc}
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-400">
                {t("common.accessNow")}
                <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default Dashboard;