import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { AlertTriangle, Loader2, AlertCircle } from 'lucide-react';
import { submitMuniComplaint } from '../../services/municipalityService';

export default function MunicipalityComplaints({ setView, simulateSuccess }) {
  const { t } = useTranslation(["municipality", "common"]);
  const categoriesList = [
    { label: t("complaints.road"), value: 'road' },
    { label: t("complaints.light"), value: 'light' },
    { label: t("complaints.garbage"), value: 'garbage' },
    { label: t("complaints.water"), value: 'water' },
  ];

  const [selectedCat, setSelectedCat] = useState('');
  const [location, setLocation] = useState('');
  const [mobile, setMobile] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCat) { setError(t("complaints.selectCategory")); return; }
    if (!location) { setError(t("complaints.enterLocation")); return; }
    setLoading(true); setError('');
    try {
      const res = await submitMuniComplaint({ category: selectedCat, location, mobile, description });
      simulateSuccess(
        t("complaints.successTitle"),
        res.data?.message || t("complaints.successMsg", { id: res.data?.ticketId }),
        res.data?.ticketId
      );
    } catch (err) {
      setError(err.response?.data?.message || t("common:processing"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center">
            <AlertTriangle size={28} className="text-red-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">{t("complaints.title")}</h2>
            <p className="text-slate-500 text-sm">{t("complaints.subtitle")}</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-semibold text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">{t("complaints.catLabel")}</label>
            <div className="grid grid-cols-2 md:grid-cols-2 gap-3">
              {categoriesList.map(cat => (
                <button type="button" key={cat.value} onClick={() => setSelectedCat(cat.value)}
                  className={`p-4 rounded-2xl border-2 font-semibold text-sm transition-all text-left ${selectedCat === cat.value ? 'border-red-500 bg-red-50 text-red-700' : 'border-gray-100 hover:border-red-200 bg-white'}`}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">{t("complaints.location")}</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
              placeholder={t("complaints.location")}
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-red-400" required />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">{t("complaints.mobile")}</label>
            <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)}
              placeholder={t("complaints.smsNote")}
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-red-400" />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">{t("complaints.description")}</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder={t("complaints.description")}
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-red-400 h-28" />
          </div>

          <button type="submit" disabled={loading || !selectedCat || !location}
            className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-red-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="animate-spin" size={20} /> {t("common:processing")}</> : t("complaints.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}