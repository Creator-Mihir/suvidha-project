import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { submitComplaint } from '../../services/electricityService';

export default function Complaints({ setView, simulateSuccess }) {
  const { t } = useTranslation(["electricity", "common"]);
  const [connectionId, setConnectionId] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const issueTypes = [
    { key: 'outage', label: t("complaints.categories.outage") },
    { key: 'billing', label: t("complaints.categories.billing") },
    { key: 'meter', label: t("complaints.categories.meter") },
    { key: 'voltage', label: t("complaints.categories.voltage") }
  ];

  const handleSubmit = async () => {
    if (!connectionId || !category || !description) {
      setError('Please fill all fields before submitting.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await submitComplaint(connectionId, category, description);
      simulateSuccess(
        'Complaint Registered',
        res.data.message,
        res.data.ticketId
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full animate-in slide-in-from-right duration-500">
      <button onClick={() => setView('menu')} className="flex items-center gap-2 text-blue-900 font-bold mb-6 hover:underline">
        <ArrowLeft size={20} /> {t("common:back")}
      </button>
      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black text-slate-800 mb-2">{t("complaints.title")}</h2>
        <p className="text-slate-500 mb-8">{t("complaints.subtitle")}</p>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-600 font-semibold text-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <div className="space-y-8">
          {/* Step 1 */}
          <div className="pl-8 border-l-2 border-slate-200 relative">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
            <h4 className="font-bold text-slate-800 mb-2">Step 1: {t("billPayment.enterConnection")}</h4>
            <input
              type="text"
              value={connectionId}
              onChange={(e) => setConnectionId(e.target.value)}
              placeholder={t("billPayment.enterConnection")}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400"
            />
          </div>

          {/* Step 2 */}
          <div className="pl-8 border-l-2 border-slate-200 relative">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
            <h4 className="font-bold text-slate-800 mb-2">Step 2: {t("complaints.category")}</h4>
            <div className="grid grid-cols-2 gap-3">
              {issueTypes.map(issue => (
                <button
                  key={issue.key}
                  onClick={() => setCategory(issue.key)}
                  className={`p-3 text-left border rounded-xl text-sm font-semibold transition-all ${category === issue.key
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'hover:border-blue-500 hover:bg-blue-50'
                    }`}
                >
                  {issue.label}
                </button>
              ))}
            </div>
          </div>

          {/* Step 3 */}
          <div className="pl-8 border-l-2 border-slate-200 relative">
            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500"></div>
            <h4 className="font-bold text-slate-800 mb-2">Step 3: {t("complaints.description")}</h4>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("complaints.description")}
              rows={4}
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-400"
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading || !connectionId || !category || !description}
          className="w-full bg-red-500 text-white py-5 rounded-2xl font-bold mt-10 shadow-xl hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          {loading
            ? <><Loader2 className="animate-spin" size={22} /> {t("common:processing")}</>
            : t("complaints.submit")
          }
        </button>
      </div>
    </div>
  );
}