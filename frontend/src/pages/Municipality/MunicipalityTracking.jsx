import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Check, RefreshCw, Clock, Loader2 } from 'lucide-react';
import { trackMuniStatus } from '../../services/municipalityService';

export default function MunicipalityTracking({ externalId }) {
  const { t } = useTranslation(["municipality", "common"]);
  const [trackingId, setTrackingId] = useState(externalId || '');
  const [trackData, setTrackData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (externalId) handleTrack(externalId);
  }, [externalId]);

  const handleTrack = async (id) => {
    const idToUse = id || trackingId;
    if (!idToUse) return;
    setLoading(true); setError('');
    try {
      const res = await trackMuniStatus(idToUse);
      setTrackData(res.data);
    } catch {
      setError(t("tracking.notFound"));
      setTrackData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <h2 className="text-2xl font-black text-slate-800 mb-6">{t("tracking.title")}</h2>

        <div className="flex gap-2 mb-8">
          <input type="text" placeholder={t("tracking.enterId")}
            value={trackingId} onChange={(e) => { setTrackingId(e.target.value); setTrackData(null); }}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-purple-400" />
          <button onClick={() => handleTrack()} disabled={loading || !trackingId}
            className="bg-purple-700 text-white px-6 rounded-xl font-bold hover:bg-purple-800 disabled:opacity-50 flex items-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={18} /> : t("tracking.track")}
          </button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-4 text-center text-sm font-semibold">{error}</div>}

        {trackData && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2">
            <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-purple-600 uppercase">{t("tracking.appId")}</p>
                <p className="text-lg font-black text-purple-900">{trackData.refId}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${trackData.currentStatus === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'}`}>
                {trackData.currentStatus?.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="space-y-5">
              {trackData.steps.map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${step.status === 'completed' ? 'bg-green-500 text-white' : step.status === 'active' ? 'bg-purple-500 text-white animate-pulse' : 'bg-slate-200 text-slate-400'}`}>
                    {step.status === 'completed' ? <Check size={16} /> : step.status === 'active' ? <RefreshCw size={16} /> : <Clock size={16} />}
                  </div>
                  <div className="pt-1">
                    <p className={`font-bold ${step.status === 'active' ? 'text-purple-600' : step.status === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>{step.label}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <Clock size={10} /> {step.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center">
              <p className="text-sm text-slate-500">{t("tracking.smsNote")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}