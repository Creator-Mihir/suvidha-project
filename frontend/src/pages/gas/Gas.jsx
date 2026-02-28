import { useState } from 'react';
import { Check } from 'lucide-react';
import TopBar from '../../components/TopBar';
import GasMenu from './GasMenu';
import GasBillPayment from './GasBillPayment';
import GasNewConnection from './GasNewConnection';
import CylinderBooking from './CylinderBooking';
import ConsumptionAnalytics from './ConsumptionAnalytics';
import GasComplaints from './GasComplaints';
import GasTracking from './GasTracking';
import GasEmergency from './GasEmergency';

export default function Gas() {
  const [view, setView] = useState('menu');
  const [modal, setModal] = useState(null);
  const [refId, setRefId] = useState('');
  const [trackingId, setTrackingId] = useState('');

  const simulateSuccess = (title, msg, id) => {
    setRefId(id);
    setModal({ title, msg });
  };

  const closeModal = () => {
    setModal(null);
    setView('menu');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] font-sans text-slate-800">
      <TopBar
        emergency
        onEmergency={() => setView('emergency')}
        onHome={() => setView('menu')}
      />

      <main className="flex-1 p-6 w-full flex flex-col items-center">
        {view === 'menu' && <GasMenu setView={setView} />}
        {view === 'bill' && <GasBillPayment setView={setView} simulateSuccess={simulateSuccess} />}
        {view === 'new' && <GasNewConnection setView={setView} simulateSuccess={simulateSuccess} />}
        {view === 'cylinder' && <CylinderBooking setView={setView} simulateSuccess={simulateSuccess} />}
        {view === 'usage' && <ConsumptionAnalytics setView={setView} />}
        {view === 'complaint' && <GasComplaints setView={setView} simulateSuccess={simulateSuccess} />}
        {view === 'tracking' && <GasTracking setView={setView} externalId={trackingId} />}
        {view === 'emergency' && <GasEmergency setView={setView} />}
      </main>

      

      {/* Success Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={48} />
            </div>
            <h3 className="text-3xl font-black text-slate-800">{modal.title}</h3>
            <p className="text-slate-500 mt-4 leading-relaxed">{modal.msg}</p>
            <div className="mt-8 space-y-3">
              <button
                onClick={() => { setModal(null); setView('tracking'); setTrackingId(refId); }}
                className="w-full bg-blue-900 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-800"
              >
                Track Status
              </button>
              <button onClick={closeModal} className="w-full text-slate-500 font-bold py-2 hover:text-slate-700">
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}