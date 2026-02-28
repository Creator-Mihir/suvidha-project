import { Zap, Home, Wrench, MapPin, History, Activity } from "lucide-react";
import { useTranslation } from "react-i18next";
import GlassCard from "../../components/GlassCard";
import { useNavigate } from "react-router-dom";


export default function ElectricityMenu({ setView, setBillStep }) {
  const { t } = useTranslation("electricity");
  const navigate = useNavigate();
  return (
    <div className="max-w-6xl w-full ">
      <div className="flex ">
      <button
              onClick={() => navigate(-1)}
              className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-2xl bg-blue-50 border-2 border-blue-400 shadow-sm   hover:shadow-md active:scale-95 transition-all duration-200 group"
              title="Go back"
            > 
              Go Back
            </button>
      <div className="mb-10 ml-80 text-center  ">

      
        <h2 className="text-3xl font-black text-slate-800">
          {t("menu.title")}
        </h2>
        <p className="text-slate-500 mt-2">
          {t("menu.subtitle")}
        </p>
      </div>

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
        <GlassCard
          icon={Zap}
          title={t("menu.billPayment.title")}
          desc={t("menu.billPayment.desc")}
          color="bg-blue-100"
          onClick={() => {
            setView("bill-payment");
            setBillStep("id-input");
          }}
        />
        <GlassCard
          icon={Home}
          title={t("menu.newConnection.title")}
          desc={t("menu.newConnection.desc")}
          color="bg-green-100"
          onClick={() => setView("new-connection")}
        />
        <GlassCard
          icon={Wrench}
          title={t("menu.complaints.title")}
          desc={t("menu.complaints.desc")}
          color="bg-red-100"
          onClick={() => setView("complaints")}
        />
        <GlassCard
          icon={MapPin}
          title={t("menu.outage.title")}
          desc={t("menu.outage.desc")}
          color="bg-yellow-100"
          onClick={() => setView("tracking")}
        />
        <GlassCard
          icon={History}
          title={t("menu.history.title")}
          desc={t("menu.history.desc")}
          color="bg-purple-100"
          onClick={() => alert("History module coming soon")}
        />
        <GlassCard
          icon={Activity}
          title={t("menu.meter.title")}
          desc={t("menu.meter.desc")}
          color="bg-slate-100"
          onClick={() => alert("Meter module coming soon")}
        />
      </div>
    </div>
  );
}
