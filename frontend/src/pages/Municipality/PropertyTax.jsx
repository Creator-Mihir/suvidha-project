import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Receipt, Loader2, AlertCircle } from 'lucide-react';
import { getProperties } from '../../services/municipalityService';
import PaymentModal from '../Payment/PaymentModal';

export default function PropertyTax({ setView, simulateSuccess }) {
  const { t } = useTranslation(["municipality", "common"]);
  const [properties, setProperties] = useState([]);
  const [selected, setSelected] = useState(0);
  const [halfYear, setHalfYear] = useState(false);
  const [loading, setLoading] = useState(true);
  const [payModal, setPayModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getProperties()
      .then(res => setProperties(res.data?.properties || []))
      .catch(() => setError('Failed to load properties.'))
      .finally(() => setLoading(false));
  }, []);

  const amount = properties[selected]
    ? (halfYear ? Math.floor(properties[selected].tax / 2) : properties[selected].tax)
    : 0;

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center">
            <Receipt size={28} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">{t("propertyTax.title")}</h2>
            <p className="text-slate-500 text-sm">{t("propertyTax.subtitle")}</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-semibold text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-400">
            <Loader2 className="animate-spin" size={24} /><span>{t("common:processing")}</span>
          </div>
        ) : (
          <>
            {/* Property Select */}
            <div className="mb-6">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">{t("propertyTax.selectProperty")}</label>
              <div className="space-y-3">
                {properties.map((p, i) => (
                  <div key={i} onClick={() => setSelected(i)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selected === i ? 'border-purple-500 bg-purple-50' : 'border-gray-100 hover:border-purple-200'}`}>
                    <p className="font-bold text-slate-800">{p.id}</p>
                    <p className="text-sm text-slate-500">{p.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Period Toggle */}
            <div className="mb-6">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">{t("propertyTax.period")}</label>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setHalfYear(false)}
                  className={`py-4 rounded-2xl font-bold border-2 transition-all ${!halfYear ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 border-gray-200 hover:border-purple-300'}`}>
                  {t("propertyTax.fullYear")}
                </button>
                <button onClick={() => setHalfYear(true)}
                  className={`py-4 rounded-2xl font-bold border-2 transition-all ${halfYear ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-600 border-gray-200 hover:border-purple-300'}`}>
                  {t("propertyTax.halfYear")}
                </button>
              </div>
            </div>

            {/* Amount Card */}
            <div className="bg-gradient-to-r from-purple-700 to-purple-500 p-6 rounded-[1.5rem] text-white mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xs font-bold uppercase opacity-80">{t("propertyTax.taxAmount")}</p>
                  <p className="text-4xl font-black mt-1">₹{amount.toLocaleString()}.00</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase opacity-80">{t("propertyTax.finYear")}</p>
                  <p className="text-lg font-bold">2025-26</p>
                </div>
              </div>
            </div>

            {/* Breakdown */}
            <div className="bg-slate-50 p-5 rounded-2xl space-y-3 mb-6 border border-slate-100">
              <div className="flex justify-between text-sm"><span className="text-slate-500">{t("propertyTax.baseTax")}</span><span className="font-bold">₹{Math.floor(amount * 0.8).toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">{t("propertyTax.eduCess")}</span><span className="font-bold">₹{Math.floor(amount * 0.1).toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-slate-500">{t("propertyTax.swachhBharat")}</span><span className="font-bold">₹{Math.floor(amount * 0.1).toLocaleString()}</span></div>
              <div className="flex justify-between font-black text-base border-t border-slate-200 pt-3"><span>{t("propertyTax.total")}</span><span>₹{amount.toLocaleString()}</span></div>
            </div>

            <button
              onClick={() => setPayModal(true)}
              className="w-full bg-purple-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-purple-700 active:scale-95 transition-all">
              {t("propertyTax.pay")} ₹{amount.toLocaleString()}
            </button>

            <PaymentModal
              isOpen={payModal}
              onClose={() => setPayModal(false)}
              amount={amount}
              department="municipality"
              connectionId={properties[selected]?.id}
              description={`Property Tax — ${properties[selected]?.id} (${halfYear ? 'Half Year' : 'Full Year'})`}
              onSuccess={(txnId) => {
                setPayModal(false);
                simulateSuccess(
                  'Tax Payment Successful!',
                  `Receipt ID: RCP-${txnId}\nProperty: ${properties[selected]?.id}\nAmount: ₹${amount.toLocaleString()}`,
                  txnId
                );
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}