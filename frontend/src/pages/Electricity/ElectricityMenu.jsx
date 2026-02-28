import { Zap, Home, Wrench, MapPin, History, Activity } from "lucide-react";
import { useTranslation } from "react-i18next";
import GlassCard from "../../components/GlassCard";

export default function ElectricityMenu({ setView, setBillStep }) {
  const { t } = useTranslation("electricityMenu");
  return (
    <div className="max-w-6xl w-full">
          <div className="mb-10 text-center">
          <h2 className="text-3xl font-black text-slate-800">
      {t("electricityMenu.title")}
        </h2>
        <p className="text-slate-500 mt-2">
        {t("electricityMenu.subtitle")}
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
        <GlassCard
          icon={Zap}
          title={t("electricityMenu.billPayment.title")}
          desc={t("electricityMenu.billPayment.desc")}
          color="bg-blue-100"
          onClick={() => {
            setView("bill-payment");
            setBillStep("id-input");
          }}
        />
        <GlassCard
          icon={Home}
          title={t("electricityMenu.newConnection.title")}
          desc={t("electricityMenu.newConnection.desc")}
          color="bg-green-100"
          onClick={() => setView("new-connection")}
        />
        <GlassCard
          icon={Wrench}
          title={t("electricityMenu.complaints.title")}
          desc={t("electricityMenu.complaints.desc")}
          color="bg-red-100"
          onClick={() => setView("complaints")}
        />
        <GlassCard
          icon={MapPin}
          title={t("electricityMenu.outage.title")}
           desc={t("electricityMenu.outage.desc")}
          color="bg-yellow-100"
          onClick={() => setView("tracking")}
        />
        <GlassCard
          icon={History}
          title={t("electricityMenu.history.title")}
          desc={t("electricityMenu.history.desc")}
          color="bg-purple-100"
          onClick={() => alert("History module coming soon")}
        />
        <GlassCard
          icon={Activity}
          title={t("electricityMenu.meter.title")}
          desc={t("electricityMenu.meter.desc")}
          color="bg-slate-100"
          onClick={() => alert("Meter module coming soon")}
        />
      </div>
    </div>
  );
}
