import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { applyGasConnection } from '../../services/gasService';

export default function GasNewConnection({ setView, simulateSuccess }) {
  const { t } = useTranslation(["gas", "common"]);
  const [form, setForm] = useState({
    fullName: '', mobile: '', connectionType: 'Domestic', idProof: '', address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => { setForm(p => ({ ...p, [field]: value })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await applyGasConnection(form);
      simulateSuccess(
        t("common:delivered"),
        res.data?.message || `Application ID: ${res.data?.applicationId}. Verification soon.`,
        res.data?.applicationId
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
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black text-slate-800 mb-8">{t("newConnection.title")}</h2>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-600 font-semibold text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">{t("newConnection.fullName")}</label>
              <input type="text" placeholder={t("newConnection.fullName")} required value={form.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">{t("newConnection.mobile")}</label>
              <input type="tel" placeholder={t("newConnection.mobile")} required value={form.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">{t("newConnection.type")}</label>
              <select value={form.connectionType} onChange={(e) => handleChange('connectionType', e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none">
                <option value="Domestic">{t("newConnection.bottled")}</option>
                <option value="Commercial">{t("newConnection.piped")}</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">{t("newConnection.idProof")}</label>
              <input type="text" placeholder={t("newConnection.idProof")} required value={form.idProof}
                onChange={(e) => handleChange('idProof', e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-orange-500" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">{t("newConnection.address")}</label>
              <textarea placeholder={t("newConnection.address")} required value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-orange-500 h-24" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black mt-10 shadow-xl hover:bg-blue-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="animate-spin" size={20} /> {t("common:processing")}</> : t("newConnection.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}