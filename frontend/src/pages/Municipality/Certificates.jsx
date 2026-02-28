import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { FileText, Baby, Heart, AlertCircle, Loader2 } from 'lucide-react';
import { applyCertificate } from '../../services/municipalityService';

export default function Certificates({ setView, simulateSuccess }) {
  const { t } = useTranslation(["municipality", "common"]);
  const certTypes = [
    { id: 'birth', label: t("certificates.birth"), icon: Baby, color: 'bg-blue-100 text-blue-600', fields: ['childName', 'dob', 'pob', 'fatherName', 'motherName'] },
    { id: 'death', label: t("certificates.death"), icon: AlertCircle, color: 'bg-slate-100 text-slate-600', fields: ['deceasedName', 'dod', 'pod', 'applicantName', 'relation'] },
    { id: 'marriage', label: t("certificates.marriage"), icon: Heart, color: 'bg-pink-100 text-pink-600', fields: ['groomName', 'brideName', 'dom', 'pom', 'witnessName'] },
  ];

  const [selected, setSelected] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await applyCertificate(selected.id, formValues);
      simulateSuccess(
        t("common:delivered"),
        res.data?.message || `Certificate ID: ${res.data?.applicationId}\nProcessing: 7 working days.`,
        res.data?.applicationId
      );
    } catch (err) {
      setError(err.response?.data?.message || t("common:processing"));
    } finally {
      setLoading(false);
    }
  };

  if (!selected) return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
            <FileText size={28} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">{t("certificates.title")}</h2>
            <p className="text-slate-500 text-sm">{t("certificates.subtitle")}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {certTypes.map(cert => (
            <div key={cert.id} onClick={() => { setSelected(cert); setFormValues({}); }}
              className="p-8 rounded-[1.5rem] border-2 border-gray-100 hover:border-blue-400 cursor-pointer transition-all hover:shadow-md text-center group">
              <div className={`w-16 h-16 ${cert.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <cert.icon size={28} />
              </div>
              <p className="font-black text-slate-800">{cert.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto w-full">
      <button onClick={() => setSelected(null)} className="text-blue-600 font-bold mb-4 flex items-center gap-2 hover:underline">
        ← {t("common:back")}
      </button>
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-14 h-14 ${selected.color} rounded-2xl flex items-center justify-center`}>
            <selected.icon size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">{selected.label}</h2>
            <p className="text-slate-500 text-sm">{t("certificates.subtitle")}</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-semibold text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selected.fields.map((field, i) => (
              <div key={i}>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">{t(`certificates.fields.${field}`)}</label>
                <input
                  type={field.includes('Date') || field === 'dob' || field === 'dod' || field === 'dom' ? 'date' : 'text'}
                  placeholder={field.includes('Date') || field === 'dob' || field === 'dod' || field === 'dom' ? '' : `${t(`certificates.fields.${field}`)}`}
                  value={formValues[field] || ''}
                  onChange={(e) => setFormValues(p => ({ ...p, [field]: e.target.value }))}
                  className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-blue-500" required />
              </div>
            ))}
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <p className="text-xs font-bold text-blue-700">📋 {t("certificates.requiredDocs")}</p>
            <p className="text-xs text-blue-600 mt-1">{t("certificates.feeNote")}</p>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="animate-spin" size={20} /> {t("common:processing")}</> : t("certificates.form.submit")}
          </button>
        </form>
      </div>
    </div>
  );
}