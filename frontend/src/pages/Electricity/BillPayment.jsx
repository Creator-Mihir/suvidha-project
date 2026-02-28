import { useState, useEffect } from 'react';
import { useTranslation } from "react-i18next";
import { ArrowLeft, Zap, FileText, Download, AlertTriangle, RefreshCw, Check, Loader2 } from 'lucide-react';
import { getBill, getSavedConnections } from '../../services/electricityService';
import PaymentModal from '../Payment/PaymentModal';

export default function BillPayment({ billStep, setBillStep, connId, setConnId, setView, simulateSuccess }) {
  const [showGraph, setShowGraph] = useState(false);
  const { t } = useTranslation(["electricity", "common"]);
  const [billData, setBillData] = useState(null);
  const [savedConns, setSavedConns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payModal, setPayModal] = useState(false);
  const [error, setError] = useState('');

  // Load saved connections on mount
  useEffect(() => {
    getSavedConnections()
      .then(res => setSavedConns(res.data?.connections || []))
      .catch(() => { });
  }, []);

  const handleKeypad = (val) => {
    if (val === 'C') setConnId('');
    else if (val === 'DEL') setConnId(prev => prev.slice(0, -1));
    else if (connId.length < 12) setConnId(prev => prev + val);
  };

  const handleProceed = async () => {
    if (connId.length < 4) {
      setError(t("billPayment.invalidConnection"));
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await getBill(connId);
      setBillData(res.data);
      setBillStep('dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch bill. Please check your connection ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleSavedConnection = async (id) => {
    setConnId(id);
    setLoading(true);
    setError('');
    try {
      const res = await getBill(id);
      setBillData(res.data);
      setBillStep('dashboard');
    } catch (err) {
      setError('Failed to fetch bill.');
    } finally {
      setLoading(false);
    }
  };

  // ── Step 1: Connection ID Input ──
  if (billStep === 'id-input') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in zoom-in-95 duration-300">
        <div className="bg-white rounded-[3rem] shadow-2xl p-8 md:p-12 max-w-4xl w-full relative border border-slate-100">
          <button onClick={() => setView('menu')} className="absolute top-8 left-8 text-slate-400 hover:text-slate-600">
            <ArrowLeft size={24} />
          </button>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-800 mb-2">{t("billPayment.enterConnection")}</h2>
            <p className="text-slate-500">{t("billPayment.enterSubtitle")}</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-4 text-center font-semibold text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <div className="bg-slate-50 rounded-2xl p-6 mb-6 border border-slate-100 flex items-center justify-center h-24">
                <span className="text-3xl font-bold text-slate-700 tracking-widest">
                  {connId || <span className="text-slate-300">____-____-___</span>}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                  <button key={n} onClick={() => handleKeypad(n.toString())}
                    className="p-4 bg-white border border-slate-100 rounded-xl font-bold text-xl shadow-sm hover:bg-slate-50 active:scale-95 transition-all">
                    {n}
                  </button>
                ))}
                <button onClick={() => handleKeypad('C')} className="p-4 text-red-500 font-bold text-xl rounded-xl hover:bg-red-50">C</button>
                <button onClick={() => handleKeypad('0')} className="p-4 bg-white border border-slate-100 rounded-xl font-bold text-xl shadow-sm hover:bg-slate-50">0</button>
                <button onClick={() => handleKeypad('DEL')} className="p-4 text-orange-500 font-bold text-xl rounded-xl hover:bg-orange-50">DEL</button>
              </div>
              <button
                onClick={handleProceed}
                disabled={connId.length < 4 || loading}
                className="w-full bg-blue-600 text-white mt-8 py-4 rounded-2xl font-bold text-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="animate-spin" size={22} /> {t("billPayment.fetching")}</> : t("billPayment.proceed")}
              </button>
            </div>

            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">{t("billPayment.savedConnections")}</h3>
              {savedConns.map((conn, i) => (
                <div
                  key={i}
                  onClick={() => handleSavedConnection(conn.connectionId)}
                  className={`cursor-pointer p-6 rounded-2xl flex flex-col gap-1 transition-all hover:bg-blue-100 ${i === 0 ? 'bg-blue-50 border-2 border-blue-500' : 'bg-slate-50 border border-slate-200 hover:border-blue-300'}`}
                >
                  <span className={`font-bold text-lg ${i === 0 ? 'text-blue-900' : 'text-slate-800'}`}>{conn.label}</span>
                  <span className={`font-medium text-sm ${i === 0 ? 'text-blue-500' : 'text-slate-500'}`}>ID: {conn.connectionId}</span>
                  <span className="text-xs text-slate-400">{conn.address}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 2: Bill Dashboard ──
  return (
    <div className="max-w-6xl mx-auto w-full animate-in slide-in-from-right duration-500">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button onClick={() => setBillStep('id-input')} className="text-slate-400 hover:text-slate-600 p-2 flex items-center gap-2">
          <ArrowLeft size={20} /> {t("billPayment.back")}
        </button>
        <div className="flex-grow">
          <h1 className="text-3xl font-bold text-slate-800">{t("billPayment.serviceTitle")}</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            <p className="text-slate-500 text-sm">Consumer ID: {connId} • {billData?.connectionType || 'Domestic'} Connection</p>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 mb-4 text-center font-semibold text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t("billPayment.consumerDetails")}</h2>
              <div>
                <p className="text-xl font-bold text-slate-800">{billData?.consumerName || 'Loading...'}</p>
                <p className="text-slate-500">{billData?.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div><p className="text-xs text-slate-400">Billing Month</p><p className="font-semibold">{billData?.billingMonth}</p></div>
                <div><p className="text-xs text-slate-400">Consumption</p><p className="font-semibold text-blue-600">{billData?.unitsConsumed} kWh</p></div>
              </div>
            </div>
            <div className="bg-slate-900 p-6 rounded-2xl text-white flex flex-col justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase mb-1">{t("billPayment.payableAmount")}</p>
                <p className="text-4xl font-bold">₹{billData?.amount?.toLocaleString()}</p>
              </div>
              <div className="pt-4 border-t border-slate-700 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Due Date</span>
                  <span className="text-yellow-400 font-medium">{billData?.dueDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Late Fee</span>
                  <span className="text-red-400 font-medium">+₹{billData?.lateFee}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileText size={18} className="text-blue-500" /> {t("billPayment.breakdown")}
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                <span className="text-slate-600">Fixed Charges</span>
                <span className="font-medium">₹{billData?.breakdown?.fixedCharges}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                <span className="text-slate-600">Energy Charges ({billData?.unitsConsumed} units)</span>
                <span className="font-medium">₹{billData?.breakdown?.energyCharges}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-b border-slate-50">
                <span className="text-slate-600">State Duty (9%)</span>
                <span className="font-medium">₹{billData?.breakdown?.stateDuty}</span>
              </div>
              <div className="flex justify-between text-lg pt-2 font-bold text-slate-800">
                <span>Total</span>
                <span>₹{billData?.breakdown?.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">{t("billPayment.usageAnalytics")}</h2>
                <p className="text-slate-500 text-sm">kWh trends</p>
              </div>
              <button onClick={() => setShowGraph(true)} className="text-blue-600 font-semibold flex items-center gap-1 text-sm">
                <RefreshCw size={14} /> Refresh
              </button>
            </div>
            <div className="w-full aspect-video rounded-xl bg-slate-50 flex items-center justify-center overflow-hidden border-2 border-dashed border-slate-200">
              {showGraph ? (
                <img
                  src="https://quickchart.io/chart?c={type:'bar',data:{labels:['Sep','Oct','Nov','Dec','Jan','Feb'],datasets:[{label:'Usage (kWh)',data:[120,150,180,220,200,342],backgroundColor:'rgba(59,130,246,0.8)'}]}}"
                  alt="Graph"
                  className="w-full h-full object-cover"
                />
              ) : (
                <p className="text-slate-400 text-sm">Click refresh to load graph</p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-600 rounded-[2rem] p-6 text-white shadow-lg">
            <div className="bg-blue-500/50 w-10 h-10 rounded-lg flex items-center justify-center mb-4"><Zap size={20} /></div>
            <h3 className="font-bold text-lg mb-2">Smart Saving Tip</h3>
            <p className="text-blue-100 text-sm leading-relaxed">Your usage peaked between 7 PM - 10 PM. Shift heavy appliance use to morning hours to save up to 20%.</p>
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <h3 className="font-bold text-slate-800 mb-4">{t("billPayment.paymentHistory")}</h3>
            <div className="space-y-4">
              {(billData?.paymentHistory || []).map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                      <Check size={14} />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{item.month}</p>
                      <p className="text-[10px] text-slate-500">Paid {item.paidOn}</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm">₹{item.amount.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-2xl hover:shadow-md transition-shadow">
              <Download size={20} className="text-slate-600 mb-2" />
              <span className="text-[10px] font-bold text-slate-600">{t("billPayment.downloadBill")}</span>
            </button>
            <button onClick={() => setView('complaints')} className="flex flex-col items-center justify-center p-4 bg-white border border-slate-200 rounded-2xl hover:shadow-md transition-shadow">
              <AlertTriangle size={20} className="text-slate-600 mb-2" />
              <span className="text-[10px] font-bold text-slate-600">{t("billPayment.raiseDispute")}</span>
            </button>
          </div>

          <button
            onClick={() => setPayModal(true)}
            disabled={!billData}
            className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50">
            {t("billPayment.pay")} ₹{billData?.amount?.toLocaleString() || '...'}
          </button>

          <PaymentModal
            isOpen={payModal}
            onClose={() => setPayModal(false)}
            amount={billData?.amount || 0}
            department="electricity"
            connectionId={connId}
            description={`Electricity bill — ${billData?.billingMonth || ''}`}
            onSuccess={(txnId, receiptId) => {
              setPayModal(false);
              simulateSuccess(
                'Payment Successful',
                `Electricity bill paid. Transaction ID: ${txnId}`,
                txnId
              );
            }}
          />
        </div>
      </div>
    </div>
  );
}