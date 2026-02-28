import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { ArrowLeft, Check, RefreshCw, Loader2, Clock } from 'lucide-react';
import { trackStatus } from '../../services/electricityService';

export default function Tracking({ setView, externalTrackingId }) {
  const { t } = useTranslation(["electricity", "common"]);
  const [trackingId, setTrackingId] = useState(externalTrackingId || '');
  const [trackData, setTrackData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-track if coming from success modal
  useEffect(() => {
    if (externalTrackingId) {
      handleTrack(externalTrackingId);
    }
  }, [externalTrackingId]);

  const handleTrack = async (id) => {
    const idToTrack = id || trackingId;
    if (!idToTrack) return;

    setLoading(true);
    setError('');
    try {
      const res = await trackStatus(idToTrack);
      setTrackData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not find this reference ID.');
      setTrackData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = (status) => {
    if (status === 'completed') return <Check size={16} />;
    if (status === 'active') return <RefreshCw size={16} className="animate-spin" />;
    return <Clock size={16} />;
  };

  const getStepColor = (status) => {
    if (status === 'completed') return 'bg-green-500';
    if (status === 'active') return 'bg-blue-500 animate-pulse';
    return 'bg-slate-300';
  };

  return (
    <div className="max-w-2xl mx-auto w-full animate-in fade-in duration-500">
      <button onClick={() => setView('menu')} className="flex items-center gap-2 text-blue-900 font-bold mb-6 hover:underline">
        <ArrowLeft size={20} /> {t("common:back")}
      </button>
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold mb-6">{t("tracking.title")}</h2>

        {/* Search input */}
        <div className="flex gap-2 mb-8">
          <input
            type="text"
            placeholder={t("tracking.enterId")}
            value={trackingId}
            onChange={(e) => setTrackingId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            className="flex-1 p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400"
          />
          <button
            onClick={() => handleTrack()}
            disabled={loading || !trackingId}
            className="bg-blue-900 text-white px-6 rounded-xl font-bold hover:bg-blue-800 disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : t("tracking.track")}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-4 text-center font-semibold text-sm">
            {error}
          </div>
        )}

        {/* Tracking Steps */}
        {trackData && (
          <div className="space-y-6 animate-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Ref: {trackData.refId}</p>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${trackData.currentStatus === 'resolved' ? 'bg-green-100 text-green-700' :
                  trackData.currentStatus === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                    'bg-yellow-100 text-yellow-700'
                }`}>
                {trackData.currentStatus?.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            {trackData.steps.map((step, i) => (
              <div key={i} className="flex gap-4">
                <div className={`w-8 h-8 text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 ${getStepColor(step.status)}`}>
                  {getStepIcon(step.status)}
                </div>
                <div>
                  <p className={`font-bold ${step.status === 'active' ? 'text-blue-600' : step.status === 'pending' ? 'text-slate-400' : 'text-slate-800'}`}>
                    {step.label}
                  </p>
                  {step.time && <p className="text-xs text-slate-400">{step.time}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}