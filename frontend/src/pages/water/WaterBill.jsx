import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { Loader2 } from 'lucide-react';
import { getWaterBill } from '../../services/waterService';
import PaymentModal from '../Payment/PaymentModal';

export default function WaterBill({ connId, setModal }) {
  const { t } = useTranslation(["water", "common"]);
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [payModal, setPayModal] = useState(false);

  useEffect(() => {
    if (!connId) return;
    getWaterBill(connId)
      .then(res => setBillData(res.data))
      .catch(() => setError('Failed to fetch bill. Please check your connection ID.'))
      .finally(() => setLoading(false));
  }, [connId]);

  if (loading) return (
    <div className="flex items-center justify-center py-24 gap-3 text-slate-400">
      <Loader2 className="animate-spin" size={28} />
      <span className="text-xl font-semibold">{t("common:processing")}</span>
    </div>
  );

  if (error) return (
    <div className="bg-white p-16 rounded-[40px] shadow-lg text-center">
      <p className="text-xl font-bold text-red-500 mb-2">Error</p>
      <p className="text-slate-500">{error}</p>
    </div>
  );

  return (
    <div className="bg-white p-10 rounded-[40px] shadow-lg w-full max-w-6xl">
      <div className="flex justify-between items-start mb-10">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{t("bill.title")}</h2>
          <p className="text-slate-500">{t("bill.period")}: <span className="font-semibold text-slate-700">{billData?.billingPeriod}</span></p>
        </div>
        <div className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold">{t("bill.due")}: {billData?.dueDate}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Consumer Details */}
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <h4 className="text-xs uppercase font-bold text-slate-400 mb-4 tracking-widest">{t("bill.details")}</h4>
            <div className="grid grid-cols-2 gap-y-6">
              <div><p className="text-sm text-slate-500">{t("bill.name")}</p><p className="text-xl font-bold">{billData?.consumerName}</p></div>
              <div><p className="text-sm text-slate-500">ID</p><p className="text-xl font-bold">{connId}</p></div>
              <div className="col-span-2"><p className="text-sm text-slate-500">{t("bill.address")}</p><p className="text-lg">{billData?.address}</p></div>
            </div>
          </div>

          {/* Meter Reading */}
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white p-4 rounded-2xl shadow-sm">
                <p className="text-xs text-slate-500">{t("bill.prevReading")}</p>
                <p className="text-2xl font-bold">{billData?.prevReading?.toLocaleString()} KL</p>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-blue-100">
                <p className="text-xs text-slate-500">{t("bill.currReading")}</p>
                <p className="text-2xl font-bold text-blue-700">{billData?.currReading?.toLocaleString()} KL</p>
              </div>
              <div className="bg-blue-600 p-4 rounded-2xl shadow-sm text-white">
                <p className="text-xs opacity-80">{t("bill.units")}</p>
                <p className="text-2xl font-bold">{billData?.unitsConsumed} KL</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Panel */}
        <div className="bg-blue-50 p-8 rounded-[40px] flex flex-col border border-blue-100">
          <div className="space-y-4 flex-1">
            <div className="flex justify-between items-center">
              <span className="text-slate-600">{t("bill.fixed")}</span>
              <span className="font-bold">₹ {billData?.breakdown?.fixed?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">{t("bill.variable")}</span>
              <span className="font-bold">₹ {billData?.breakdown?.variable?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600">{t("bill.taxes")}</span>
              <span className="font-bold text-red-500">₹ {billData?.breakdown?.taxes?.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t-2 border-dashed border-blue-200 text-center">
            <p className="text-5xl font-black text-blue-900 mb-8">₹ {billData?.amount?.toLocaleString()}</p>
            <button
              onClick={() => setPayModal(true)}
              className="w-full py-6 bg-blue-600 text-white rounded-3xl font-bold text-2xl shadow-xl hover:bg-blue-700 active:scale-95 transition-all">
              {t("bill.pay")} ₹{billData?.amount?.toLocaleString()}
            </button>

            <PaymentModal
              isOpen={payModal}
              onClose={() => setPayModal(false)}
              amount={billData?.amount || 0}
              department="water"
              connectionId={connId}
              description={`Water bill — ${billData?.billingPeriod || ''}`}
              onSuccess={(txnId) => {
                setPayModal(false);
                setModal('success');
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}