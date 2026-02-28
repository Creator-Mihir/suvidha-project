import { Receipt, FileText, AlertTriangle, Building2, Store, MapPin } from 'lucide-react';
import GlassCard from '../../components/GlassCard';

export default function MunicipalityMenu({ setView }) {
  return (
    <div className="max-w-6xl w-full">
      <div className="mb-10 text-center mt-4">
        <h2 className="text-3xl font-black text-slate-800">Municipality Services</h2>
        <p className="text-slate-500 mt-2">Apni zarurat ke hisab se service chunein</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <GlassCard icon={Receipt}       title="Property Tax"       desc="Apna property tax online bharein"              color="bg-purple-100" onClick={() => setView('property-tax')} />
        <GlassCard icon={FileText}      title="Certificates"       desc="Birth, Death, Marriage certificate apply karein" color="bg-blue-100"   onClick={() => setView('certificates')} />
        <GlassCard icon={AlertTriangle} title="Complaints"         desc="Road, light, garbage complaints darj karein"   color="bg-red-100"    onClick={() => setView('complaints')} />
        <GlassCard icon={Building2}     title="Building Approval"  desc="Building plan submit aur approve karwayein"    color="bg-yellow-100" onClick={() => setView('building')} />
        <GlassCard icon={Store}         title="Trade License"      desc="Naya license apply ya renew karein"            color="bg-green-100"  onClick={() => setView('trade')} />
        <GlassCard icon={MapPin}        title="Track Status"       desc="Apni applications ka status check karein"      color="bg-orange-100" onClick={() => setView('tracking')} />
      </div>
    </div>
  );
}