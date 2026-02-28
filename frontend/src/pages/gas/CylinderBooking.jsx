import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { getGasConnections, bookCylinder } from '../../services/gasService';

export default function CylinderBooking({ setView, simulateSuccess }) {
  const { t } = useTranslation(["gas", "common"]);
  const [connections, setConnections] = useState([]);
  const [selected, setSelected] = useState(0);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookLoading, setBookLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getGasConnections()
      .then(res => {
        const conns = res.data?.connections || [];
        setConnections(conns);
        // Mock recent history (will come from API later)
        setHistory([
          { date: '12 Jan 2026', ref: 'BK88271', loc: conns[0]?.label || 'Home' },
          { date: '08 Dec 2025', ref: 'BK76612', loc: conns[1]?.label || 'Shop' },
        ]);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load connections.');
        setLoading(false);
      });
  }, []);

  const handleConfirm = async () => {
    const conn = connections[selected];
    if (!conn) return;
    setBookLoading(true);
    setError('');
    try {
      const res = await bookCylinder(conn.connectionId);
      simulateSuccess(
        t("common:delivered"),
        res.data?.message || `Refill booked for ${conn.label}. Delivery in 48 hrs.`,
        res.data?.bookingId
      );
    } catch (err) {
      setError(err.response?.data?.message || t("common:processing"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <button onClick={() => setView('menu')} className="text-orange-600 font-bold mb-6 flex items-center gap-2">
        <ArrowLeft size={18} /> {t("common:back")}
      </button>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-4 text-sm font-semibold text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Book Refill */}
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100">
          <h3 className="text-xl font-black mb-6">{t("cylinder.bookRefill")}</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8 gap-2 text-slate-400">
              <Loader2 className="animate-spin" size={20} />
              <span>{t("common:processing")}</span>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  {t("cylinder.selectConnection")}
                </label>
                <select
                  className="w-full p-4 bg-gray-50 rounded-2xl outline-none border border-gray-200 font-bold"
                  value={selected}
                  onChange={(e) => setSelected(Number(e.target.value))}
                >
                  {connections.map((c, i) => (
                    <option key={i} value={i}>{c.label} — {c.connectionId}</option>
                  ))}
                </select>
              </div>
              <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold uppercase text-orange-800">{t("cylinder.price")}</span>
                  <span className="font-black">₹903.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-semibold uppercase text-orange-800">{t("cylinder.subsidy")}</span>
                  <span className="font-black text-green-600">- ₹152.00</span>
                </div>
              </div>
              <button
                onClick={handleConfirm}
                disabled={bookLoading}
                className="w-full bg-orange-600 text-white py-5 rounded-2xl font-black shadow-lg hover:bg-orange-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {bookLoading
                  ? <><Loader2 className="animate-spin" size={20} /> {t("common:processing")}</>
                  : t("cylinder.confirm")
                }
              </button>
            </div>
          )}
        </div>

        {/* Recent History */}
        <div className="bg-white p-8 rounded-[3rem] shadow-xl border border-gray-100">
          <h3 className="text-xl font-black mb-6">{t("cylinder.history")}</h3>
          <div className="space-y-4">
            {history.map((item, i) => (
              <div key={i} className="flex justify-between items-center p-4 border-b border-gray-50">
                <div>
                  <p className="font-bold">{item.date}</p>
                  <p className="text-xs text-slate-400">Ref #{item.ref} • {item.loc}</p>
                </div>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">
                  {t("common:delivered")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}