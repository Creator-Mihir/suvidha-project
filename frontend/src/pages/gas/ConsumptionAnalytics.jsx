import { ArrowLeft } from 'lucide-react';
import { useTranslation } from "react-i18next";

export default function ConsumptionAnalytics({ setView }) {
  const { t } = useTranslation(["gas", "common"]);
  return (
    <div className="max-w-4xl mx-auto w-full">
      <button onClick={() => setView('menu')} className="text-orange-600 font-bold mb-6 flex items-center gap-2">
        <ArrowLeft size={18} /> {t("common:back")}
      </button>
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
        <h2 className="text-2xl font-black mb-8">📊 {t("consumption.title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100">
            <p className="text-xs font-bold text-blue-400 uppercase mb-2">{t("consumption.currentUsage")}</p>
            <p className="text-5xl font-black text-blue-900">28.5</p>
            <div className="w-full bg-blue-200 h-2 rounded-full mt-4 overflow-hidden">
              <div className="w-[75%] h-full bg-blue-600"></div>
            </div>
          </div>
          <div className="p-8 bg-orange-50 rounded-[2.5rem] border border-orange-100">
            <p className="text-xs font-bold text-orange-400 uppercase mb-2">{t("consumption.prevMonth")}</p>
            <p className="text-5xl font-black text-orange-900">24.2</p>
            <div className="w-full bg-orange-200 h-2 rounded-full mt-4 overflow-hidden">
              <div className="w-[60%] h-full bg-orange-600"></div>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 p-6 rounded-3xl">
          <p className="font-bold text-slate-700 mb-2">{t("consumption.efficiency")}: <span className="text-green-600">{t("consumption.efficiencyGood")}</span></p>
          <p className="text-sm text-slate-500">{t("consumption.efficiencyNote")}</p>
        </div>
      </div>
    </div>
  );
}