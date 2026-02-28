import { useState } from 'react';
import { Check, ArrowLeft } from 'lucide-react';
import TopBar from '../../components/TopBar';

import MunicipalityMenu from './MunicipalityMenu';
import PropertyTax from './PropertyTax';
import Certificates from './Certificates';
import MunicipalityComplaints from './MunicipalityComplaints';
import BuildingApproval from './BuildingApproval';
import TradeLicense from './TradeLicense';
import MunicipalityTracking from './MunicipalityTracking';

export default function Municipality() {
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
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-800">
      <TopBar />

      <main className="flex-1 p-6 w-full flex flex-col items-center">
        {view !== 'menu' && (
          <div className="w-full max-w-5xl mb-6">
            <button
              onClick={() => setView('menu')}
              className="flex items-center gap-2 text-purple-600 font-bold text-lg hover:-translate-x-1 transition-transform"
            >
              <ArrowLeft size={22} /> Back to Menu
            </button>
          </div>
        )}

        {view === 'menu' && <MunicipalityMenu setView={setView} />}
        {view === 'property-tax' && (
          <PropertyTax setView={setView} simulateSuccess={simulateSuccess} />
        )}
        {view === 'certificates' && (
          <Certificates setView={setView} simulateSuccess={simulateSuccess} />
        )}
        {view === 'complaints' && (
          <MunicipalityComplaints setView={setView} simulateSuccess={simulateSuccess} />
        )}
        {view === 'building' && (
          <BuildingApproval setView={setView} simulateSuccess={simulateSuccess} />
        )}
        {view === 'trade' && (
          <TradeLicense setView={setView} simulateSuccess={simulateSuccess} />
        )}
        {view === 'tracking' && (
          <MunicipalityTracking externalId={trackingId} />
        )}
      </main>

      {modal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 text-center shadow-2xl">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check size={48} />
            </div>

            <h3 className="text-3xl font-black text-slate-800">
              {modal.title}
            </h3>

            <p className="text-slate-500 mt-4 leading-relaxed whitespace-pre-line">
              {modal.msg}
            </p>

            <div className="mt-8 space-y-3">
              <button
                onClick={() => {
                  setModal(null);
                  setView('tracking');
                  setTrackingId(refId);
                }}
                className="w-full bg-purple-700 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-purple-800"
              >
                Track Status
              </button>

              <button
                onClick={closeModal}
                className="w-full text-slate-500 font-bold py-2 hover:text-slate-700"
              >
                Back to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}