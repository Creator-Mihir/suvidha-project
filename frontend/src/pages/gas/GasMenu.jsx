import { CreditCard, PlusCircle, Package, BarChart2, MessageSquare, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GlassCard from '../../components/GlassCard';
import { useNavigate } from "react-router-dom";

export default function GasMenu({ setView }) {
  const { t } = useTranslation("gas");
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl w-full ">
      <div className="flex  ">
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard icon={CreditCard} title={t("menu.bill.title")} desc={t("menu.bill.desc")} color="bg-orange-100" onClick={() => setView('bill')} />
        <GlassCard icon={PlusCircle} title={t("menu.new.title")} desc={t("menu.new.desc")} color="bg-blue-100" onClick={() => setView('new')} />
        <GlassCard icon={Package} title={t("menu.cylinder.title")} desc={t("menu.cylinder.desc")} color="bg-orange-500" onClick={() => setView('cylinder')} />
        <GlassCard icon={BarChart2} title={t("menu.usage.title")} desc={t("menu.usage.desc")} color="bg-green-100" onClick={() => setView('usage')} />
        <GlassCard icon={MessageSquare} title={t("menu.complaint.title")} desc={t("menu.complaint.desc")} color="bg-purple-100" onClick={() => setView('complaint')} />
        <GlassCard icon={MapPin} title={t("menu.tracking.title")} desc={t("menu.tracking.desc")} color="bg-yellow-100" onClick={() => setView('tracking')} />
      </div>
    </div>
  );
}