import { useState } from 'react';
import { Check, Smartphone, CreditCard } from 'lucide-react';
import TopBar from '../../components/TopBar';
import WaterMenu from './WaterMenu';
import WaterIdInput from './WaterIdInput';
import WaterBill from './WaterBill';
import WaterNewConnection from './WaterNewConnection';
import { ArrowLeft, Wrench, Activity } from 'lucide-react';

export default function Water() {
  const [view, setView] = useState('home');
  const [connId, setConnId] = useState('');
  const [modal, setModal] = useState(null);
  const [successData, setSuccessData] = useState({ title: '', msg: '' });

  const formatId = (val) => {
    let clean = val.replace(/-/g, '');
    if (clean.length > 4) clean = clean.slice(0, 4) + '-' + clean.slice(4);
    if (clean.length > 9) clean = clean.slice(0, 9) + '-' + clean.slice(9);
    return clean;
  };

  const handleNumpadInput = (num) => {
    if (connId.replace(/-/g, '').length < 11) {
      setConnId(prev => formatId(prev.replace(/-/g, '') + num));
    }
  };

  const handleProcessSimulation = (title, msg) => {
    setModal('loading');
    setTimeout(() => {
      setSuccessData({ title, msg });
      setModal('success');
    }, 2000);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#f8fafc] overflow-hidden select-none text-slate-800">
      <TopBar />

      <main className="flex-1 overflow-y-auto p-10 flex flex-col items-center">
        {view === 'home' ? (
          <>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-800 mb-2">Water Services</h2>
              <p className="text-lg text-slate-500">Kripya apni zarurat ke hisab se option chunein</p>
            </div>
            <WaterMenu setView={setView} />
          </>
        ) : (
          <div className="w-full flex flex-col items-center">
            <div className="w-full max-w-6xl mb-6">
              <button
                onClick={() => {
                  if (view === 'bill') setView('id-input');
                  else { setView('home'); setConnId(''); }
                }}
                className="flex items-center gap-2 text-blue-600 font-bold text-lg hover:-translate-x-1 transition-transform"
              >
                <ArrowLeft size={24} /> Back to Menu
              </button>
            </div>

            {view === 'id-input' && (
              <WaterIdInput
                connId={connId}
                setConnId={setConnId}
                setView={setView}
                handleNumpadInput={handleNumpadInput}
                formatId={formatId}
              />
            )}
            {view === 'bill' && (
              <WaterBill connId={connId} setModal={setModal} />
            )}
            {view === 'new-conn' && (
              <WaterNewConnection handleProcessSimulation={handleProcessSimulation} />
            )}
            {view === 'complaints' && (
              <div className="bg-white p-20 rounded-[40px] shadow-lg text-center">
                <Wrench size={60} className="mx-auto text-slate-800 mb-6" />
                <h2 className="text-3xl font-bold">Under Maintenance</h2>
                <p className="text-gray-500 mt-2">Complaint module is being updated.</p>
              </div>
            )}
            {view === 'status' && (
              <div className="bg-white p-20 rounded-[40px] shadow-lg text-center">
                <Activity size={60} className="mx-auto text-slate-800 mb-6" />
                <h2 className="text-3xl font-bold">Status Tracker</h2>
                <p className="text-gray-500 mt-2">Connect to backend to view live status.</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Payment Modal */}
      {modal === 'payment' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[50px] w-full max-w-xl p-10 shadow-2xl">
            <h3 className="text-3xl font-bold mb-8 text-center">Payment Method</h3>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={() => handleProcessSimulation('Payment Success', 'Transaction ID: TXN99821-OK')}
                className="p-8 bg-blue-50 rounded-3xl flex items-center justify-between font-bold text-xl active:scale-95 transition-all hover:bg-blue-100"
              >
                <span>Scan UPI QR</span>
                <Smartphone size={32} />
              </button>
              <button
                onClick={() => handleProcessSimulation('Payment Success', 'Transaction ID: TXN44321-CC')}
                className="p-8 bg-gray-50 rounded-3xl flex items-center justify-between font-bold text-xl active:scale-95 transition-all hover:bg-gray-100"
              >
                <span>Insert Card</span>
                <CreditCard size={32} />
              </button>
            </div>
            <button onClick={() => setModal(null)} className="w-full mt-6 py-4 text-gray-400 font-bold hover:text-gray-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {modal === 'loading' && (
        <div className="fixed inset-0 bg-blue-600 z-[100] flex flex-col items-center justify-center text-white">
          <div className="w-20 h-20 border-8 border-white/20 border-t-white rounded-full animate-spin mb-8"></div>
          <h2 className="text-3xl font-bold">Processing Request...</h2>
          <p className="opacity-80">Kripya thoda intezar karein</p>
        </div>
      )}

      {/* Success */}
      {modal === 'success' && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
          <div className="bg-white rounded-[50px] w-full max-w-md p-10 text-center shadow-2xl">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
              <Check size={48} />
            </div>
            <h3 className="text-3xl font-bold mb-2">{successData.title}</h3>
            <p className="text-gray-500 text-lg mb-10">{successData.msg}</p>
            <button
              onClick={() => { setModal(null); setView('home'); setConnId(''); }}
              className="w-full py-6 bg-blue-600 text-white rounded-3xl font-bold text-xl shadow-lg hover:bg-blue-700"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}