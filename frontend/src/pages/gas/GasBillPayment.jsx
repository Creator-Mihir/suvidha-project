import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getGasConnections } from '../../services/gasService';
import PaymentModal from '../Payment/PaymentModal';

export default function GasBillPayment({ setView, simulateSuccess }) {
  const [connections, setConnections] = useState([]);
  const [selected, setSelected]       = useState(0);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [payModal, setPayModal]       = useState(false);

  useEffect(() => {
    getGasConnections()
      .then(res => {
        setConnections(res.data?.connections || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load connections.');
        setLoading(false);
      });
  }, []);

  const conn = connections[selected];

  return (
    <div className="max-w-4xl mx-auto w-full">
      <button onClick={() => setView('menu')} className="text-orange-600 font-bold mb-6 flex items-center gap-2">
        <ArrowLeft size={18} /> Back
      </button>
      <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black text-slate-800 mb-8">Pay Your Gas Bill</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-4 text-sm font-semibold text-center">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 className="animate-spin" size={24} />
            <span className="font-semibold">Loading your connections...</span>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Select Consumer Account
              </label>
              <select
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none font-bold border border-gray-200"
                value={selected}
                onChange={(e) => setSelected(Number(e.target.value))}
              >
                {connections.map((c, i) => (
                  <option key={i} value={i}>{c.label} ({c.connectionId})</option>
                ))}
              </select>
            </div>

            {conn && (
              <div className="bg-gradient-to-r from-orange-600 to-orange-400 p-6 rounded-3xl text-white flex justify-between items-center shadow-lg">
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-80">Outstanding Balance</p>
                  <p className="text-4xl font-black mt-1">₹{conn.amount?.toLocaleString()}.00</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold uppercase opacity-80">Due Date</p>
                  <p className="text-lg font-bold">19 Mar, 2026</p>
                </div>
              </div>
            )}

            <button
              onClick={() => setPayModal(true)}
              disabled={!conn}
              className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-orange-700 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              Pay ₹{conn?.amount?.toLocaleString() || '...'}
            </button>
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={payModal}
        onClose={() => setPayModal(false)}
        amount={conn?.amount || 0}
        department="gas"
        connectionId={conn?.connectionId}
        description={`Gas bill payment — ${conn?.label}`}
        onSuccess={(txnId, receiptId) => {
          setPayModal(false);
          simulateSuccess(
            'Payment Successful',
            `Gas bill paid. Transaction ID: ${txnId}`,
            txnId
          );
        }}
      />
    </div>
  );
}