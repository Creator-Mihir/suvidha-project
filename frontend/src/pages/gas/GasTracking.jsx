import { useState, useEffect } from 'react';
import { ArrowLeft, Check, RefreshCw, Clock, Loader2 } from 'lucide-react';
import { trackGasStatus } from '../../services/gasService';

export default function GasTracking({ setView, externalId }) {
  const [trackingId, setTrackingId] = useState(externalId || '');
  const [trackData, setTrackData]   = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  useEffect(() => {
    if (externalId) handleTrack(externalId);
  }, [externalId]);

  const handleTrack = async (id) => {
    const idToUse = id || trackingId;
    if (!idToUse) return;
    setLoading(true); setError('');
    try {
      const res = await trackGasStatus(idToUse);
      setTrackData(res.data);
    } catch {
      setError('Could not find this reference ID.');
      setTrackData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <button onClick={() => setView('menu')} className="text-orange-600 font-bold mb-6 flex items-center gap-2">
        <ArrowLeft size={18} /> Back
      </button>
      <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold mb-6">Track Your Request</h2>

        <div className="flex gap-2 mb-8">
          <input type="text" placeholder="Enter Ref ID / Ticket ID / App ID"
            value={trackingId} onChange={(e) => setTrackingId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-orange-400" />
          <button onClick={() => handleTrack()} disabled={loading || !trackingId}
            className="bg-orange-600 text-white px-6 rounded-xl font-bold hover:bg-orange-700 disabled:opacity-50 flex items-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Track'}
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-4 text-center text-sm font-semibold">{error}</div>}

        {trackData && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Ref: {trackData.refId}</p>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${trackData.currentStatus === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {trackData.currentStatus?.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            {trackData.steps.map((step, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className={`w-8 h-8 text-white rounded-full flex items-center justify-center shrink-0 text-xs ${step.status === 'completed' ? 'bg-green-500' : step.status === 'active' ? 'bg-orange-500 animate-pulse' : 'bg-slate-300'}`}>
                  {step.status === 'completed' ? <Check size={14} /> : step.status === 'active' ? <RefreshCw size={14} /> : <Clock size={14} />}
                </div>
                <div>
                  <p className={`font-bold ${step.status === 'active' ? 'text-orange-600' : step.status === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>{step.label}</p>
                  {step.time && <p className="text-xs text-gray-400">{step.time}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}