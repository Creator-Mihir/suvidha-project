import { useState } from 'react';
import { Store, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from "react-i18next";
import { applyTradeLicense } from '../../services/municipalityService';

export default function TradeLicense({ setView }) {
  const { t } = useTranslation(["municipality", "common"]);
  const [isRenew, setIsRenew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    mobile: '',
    businessType: 'Retail',
    employees: '',
    idNumber: '',
    address: '',
    existingLicenseNo: ''
  });

  const handleChange = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

  const simulateSuccess = (title, msg, id) => {
    setView('success', { title, message: msg, referenceId: id });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await applyTradeLicense({ ...form, isRenewal: isRenew });
      simulateSuccess(
        isRenew ? t("trade.renew") : t("trade.new"),
        res.data?.message || t("trade.successMsg", { id: res.data?.applicationId }),
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
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center">
            <Store size={28} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">{t("trade.title")}</h2>
            <p className="text-slate-500 text-sm">{t("trade.subtitle")}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <button onClick={() => setIsRenew(false)} className={`py-4 rounded-2xl font-black border-2 transition-all ${!isRenew ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-600 border-gray-200 hover:border-green-300'}`}>{t("trade.new")}</button>
          <button onClick={() => setIsRenew(true)} className={`py-4 rounded-2xl font-black border-2 transition-all ${isRenew ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-600 border-gray-200 hover:border-green-300'}`}>{t("trade.renew")}</button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-600 font-semibold text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {isRenew && (
              <div className="md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">{t("trade.existingNo")}</label>
                <input type="text" placeholder="TL-2024-XXXX" required value={form.existingLicenseNo} onChange={(e) => handleChange('existingLicenseNo', e.target.value)}
                  className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all" />
              </div>
            )}
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">{t("trade.ownerName")}</label>
              <input type="text" placeholder={t("trade.ownerName")} required value={form.ownerName} onChange={(e) => handleChange('ownerName', e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">{t("trade.businessName")}</label>
              <input type="text" placeholder={t("trade.businessName")} required value={form.businessName} onChange={(e) => handleChange('businessName', e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">{t("trade.mobile")}</label>
              <input type="tel" placeholder="+91 XXXX XXXX" required value={form.mobile} onChange={(e) => handleChange('mobile', e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">{t("trade.businessType")}</label>
              <select value={form.businessType} onChange={(e) => handleChange('businessType', e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all">
                {Object.keys(t("trade.types", { returnObjects: true })).map(key => (
                  <option key={key} value={key}>{t(`trade.types.${key}`)}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-slate-100 italic">
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              {t("trade.docsTitle")} {t("trade.docsList.aadhar")}, {t("trade.docsList.ownership")}, {t("trade.docsList.photo")}.<br />
              <span className="text-green-600">{t("trade.feeNote")}</span>
            </p>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black mt-8 flex items-center justify-center gap-2 hover:bg-slate-800 transition-all disabled:opacity-50">
            {loading ? <Loader2 size={20} className="animate-spin" /> : t("trade.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}