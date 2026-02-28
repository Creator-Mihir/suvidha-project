import { useState } from 'react';
import { Check, ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation(["gas", "common"]);
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
    <div className="min-h-screen flex flex-col bg-[#fff8f2] text-slate-800 font-sans">
      <TopBar />

      <main className="flex-1 p-6 w-full flex flex-col items-center">
        {view !== 'menu' && (
          <div className="w-full max-w-5xl mb-6">
            <button
              onClick={() => setView('menu')}
              className="flex items-center gap-2 text-orange-600 font-bold text-lg hover:-translate-x-1 transition-transform"
            >
              <ArrowLeft size={22} /> {t("common:backToMenu")}
            </button>
          </div>
        )}

        {view === 'menu' && <GasMenu setView={setView} />}
        {view === 'bill' && <GasBillPayment setView={setView} simulateSuccess={simulateSuccess} />}
        {view === 'new' && <GasNewConnection setView={setView} simulateSuccess={simulateSuccess} />}
        {view === 'cylinder' && <CylinderBooking setView={setView} simulateSuccess={simulateSuccess} />}
        {view === 'usage' && <ConsumptionAnalytics />}
        {view === 'complaint' && <GasComplaints setView={setView} simulateSuccess={simulateSuccess} />}
        {view === 'tracking' && <GasTracking setView={setView} externalId={trackingId} />}
        {view === 'emergency' && <GasEmergency />}
      </main>

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
                onClick={() => {
                  setModal(null);
                  setView('tracking');
                  setTrackingId(refId);
                }}
                className="w-full bg-orange-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-orange-700"
              >
                {t("common:trackStatus")}
              </button>
              <button
                onClick={closeModal}
                className="w-full text-slate-500 font-bold py-2 hover:text-slate-700"
              >
                {t("common:backToMenu")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}