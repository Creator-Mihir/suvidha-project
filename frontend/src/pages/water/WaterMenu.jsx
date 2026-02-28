import { Droplets, Home, Wrench, MapPin, History, Activity } from 'lucide-react';

const KioskCard = ({ title, desc, icon: Icon, color, onClick }) => (
  <div
    onClick={onClick}
    className="group bg-white p-8 rounded-[40px] shadow-sm border-2 border-transparent hover:border-blue-500 active:scale-95 active:bg-blue-50 transition-all cursor-pointer flex flex-col items-center text-center"
  >
    <div className={`w-20 h-20 mb-6 rounded-2xl flex items-center justify-center ${color}`}>
      <Icon size={40} className="text-slate-700" />
    </div>
    <h3 className="text-2xl font-bold text-slate-800 mb-2">{title}</h3>
    <p className="text-slate-500 text-sm">{desc}</p>
  </div>
);

export default function WaterMenu({ setView }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
      <KioskCard title="Bill Payment" desc="Current bill dekhein aur turant pay karein" icon={Droplets} color="bg-blue-100" onClick={() => setView('id-input')} />
      <KioskCard title="New Connection" desc="Naye paani connection ke liye apply karein" icon={Home} color="bg-green-100" onClick={() => setView('new-conn')} />
      <KioskCard title="Complaints" desc="Leakage ya meter fault ki shikayat karein" icon={Wrench} color="bg-red-50" onClick={() => setView('complaints')} />
      <KioskCard title="Service Status" desc="Apni applications & complaints track karein" icon={MapPin} color="bg-yellow-100" onClick={() => setView('status')} />
      <KioskCard title="History" desc="Purane bills aur receipts" icon={History} color="bg-purple-100" onClick={() => alert('Module coming soon')} />
      <KioskCard title="Meter Info" desc="Smart meter details aur reading check karein" icon={Activity} color="bg-indigo-50" onClick={() => alert('Module coming soon')} />
    </div>
  );
}