import { CreditCard, PlusCircle, Package, BarChart2, MessageSquare, MapPin } from 'lucide-react';
import GlassCard from '../../components/GlassCard';

export default function GasMenu({ setView }) {
  return (
    <div className="max-w-6xl w-full">
      <div className="mb-10 text-center mt-6">
        <h2 className="text-3xl font-black text-slate-800">Gas Service Center</h2>
        <p className="text-slate-500 mt-2">Please select a service to proceed</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard icon={CreditCard} title="Pay Gas Bill" desc="Online payments & digital receipts" color="bg-orange-100" onClick={() => setView('bill')} />
        <GlassCard icon={PlusCircle} title="New Connection" desc="Apply for Domestic or Commercial lines" color="bg-blue-100" onClick={() => setView('new')} />
        <GlassCard icon={Package} title="Book Cylinder" desc="Instant booking & delivery tracking" color="bg-orange-500" onClick={() => setView('cylinder')} />
        <GlassCard icon={BarChart2} title="Consumption" desc="Check monthly gas usage history" color="bg-green-100" onClick={() => setView('usage')} />
        <GlassCard icon={MessageSquare} title="Register Complaint" desc="Leakage, pressure, or billing issues" color="bg-purple-100" onClick={() => setView('complaint')} />
        <GlassCard icon={MapPin} title="Track Status" desc="Check request or complaint progress" color="bg-yellow-100" onClick={() => setView('tracking')} />
      </div>
    </div>
  );
}