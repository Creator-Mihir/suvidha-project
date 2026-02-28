import { Droplets, Home, Wrench, MapPin, History, Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";

const KioskCard = ({ title, desc, icon: Icon, color, onClick }) => (
  <div
    onClick={onClick}
    className="group bg-white p-8 rounded-[40px] shadow-sm border-2 border-transparent hover:border-blue-500 active:scale-95 active:bg-blue-50 transition-all cursor-pointer flex flex-col items-center text-center"
  >
    <div className={`w-20 h-20 mb-6 rounded-2xl flex items-center justify-center ${color}`}>
      <Icon size={40} className="text-slate-700" />
    </div>
    <h3 className="text-2xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 text-xl">{desc}</p>
  </div>
);

export default function WaterMenu({ setView }) {
  const { t } = useTranslation("water");
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-6xl">

      {/* Back Button */}
      <div className="mb-0">
        <button
          onClick={() => navigate(-1)}
          className="flex-shrink-0 flex items-center justify-center w-24 h-24 rounded-2xl bg-blue-50 border-2 border-blue-400 shadow-sm hover:shadow-md active:scale-95 transition-all duration-200 group"
          title="Go back"
        >
          Go Back
        </button>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <KioskCard title={t("menu.billPayment.title")} desc={t("menu.billPayment.desc")} icon={Droplets} color="bg-blue-100" onClick={() => setView('id-input')} />
        <KioskCard title={t("menu.newConnection.title")} desc={t("menu.newConnection.desc")} icon={Home} color="bg-green-100" onClick={() => setView('new-conn')} />
        <KioskCard title={t("menu.complaints.title")} desc={t("menu.complaints.desc")} icon={Wrench} color="bg-red-50" onClick={() => setView('complaints')} />
        <KioskCard title={t("menu.tracking.title")} desc={t("menu.tracking.desc")} icon={MapPin} color="bg-yellow-100" onClick={() => setView('status')} />
        <KioskCard title="History" desc="Purane bills aur receipts" icon={History} color="bg-purple-100" onClick={() => alert('Module coming soon')} />
        <KioskCard title="Meter Info" desc="Smart meter details aur reading check karein" icon={Activity} color="bg-indigo-50" onClick={() => alert('Module coming soon')} />
      </div>

    </div>
  );
}