import { useState } from 'react';
import { X, Smartphone, CreditCard, Building2, Check, Loader2, ShieldCheck, AlertCircle } from 'lucide-react';
import { initiatePayment, confirmPayment } from '../../services/paymentService';

// ─── UPI Tab ──────────────────────────────────────────────────────────────────
const UpiTab = ({ onPay, loading }) => {
  const [upiId, setUpiId] = useState('');
  const [error, setError] = useState('');

  const handlePay = () => {
    if (!upiId.includes('@')) { setError('Please enter a valid UPI ID (e.g. name@upi)'); return; }
    setError('');
    onPay('upi', { upiId });
  };

  return (
    <div className="space-y-5">
      {/* Mock QR */}
      <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center gap-3">
        <div className="w-36 h-36 bg-white border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=130x130&data=upi://pay?pa=suvidha@ybl&pn=SUVIDHA&am=100&cu=INR`}
            alt="UPI QR"
            className="rounded-lg w-32 h-32 object-cover"
          />
        </div>
        <p className="text-xs text-slate-500 font-semibold">Scan with any UPI app</p>
        <div className="flex gap-3 items-center justify-center">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/UPI-Logo-vector.svg/1200px-UPI-Logo-vector.svg.png" alt="UPI" className="h-5 object-contain" />
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500">GPay • PhonePe • Paytm</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 font-bold">OR ENTER UPI ID</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      <div>
        <input type="text" value={upiId} onChange={(e) => { setUpiId(e.target.value); setError(''); }}
          placeholder="yourname@upi / @okaxis / @ybl"
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-medium" />
        {error && <p className="text-red-500 text-xs mt-1 font-semibold">{error}</p>}
      </div>

      <button onClick={handlePay} disabled={loading || !upiId}
        className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95">
        {loading ? <><Loader2 className="animate-spin" size={20} /> Verifying...</> : 'Pay via UPI'}
      </button>
    </div>
  );
};

// ─── Card Tab ─────────────────────────────────────────────────────────────────
const CardTab = ({ onPay, loading }) => {
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [error, setError] = useState('');

  const formatCard = (val) => val.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
  const formatExpiry = (val) => {
    const clean = val.replace(/\D/g, '');
    return clean.length >= 2 ? clean.slice(0,2) + '/' + clean.slice(2,4) : clean;
  };

  const handlePay = () => {
    if (card.number.replace(/\s/g,'').length < 16) { setError('Enter valid 16-digit card number'); return; }
    if (card.expiry.length < 5) { setError('Enter valid expiry date'); return; }
    if (card.cvv.length < 3)   { setError('Enter valid CVV'); return; }
    if (!card.name)            { setError('Enter cardholder name'); return; }
    setError('');
    onPay('card', { last4: card.number.slice(-4) });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Card Number</label>
        <input type="text" value={card.number} placeholder="1234 5678 9012 3456"
          onChange={(e) => setCard(p => ({ ...p, number: formatCard(e.target.value) }))}
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-mono text-lg tracking-widest" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Expiry</label>
          <input type="text" value={card.expiry} placeholder="MM/YY" maxLength={5}
            onChange={(e) => setCard(p => ({ ...p, expiry: formatExpiry(e.target.value) }))}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-mono" />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">CVV</label>
          <input type="password" value={card.cvv} placeholder="•••" maxLength={4}
            onChange={(e) => setCard(p => ({ ...p, cvv: e.target.value.replace(/\D/g,'') }))}
            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-mono" />
        </div>
      </div>
      <div>
        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Name on Card</label>
        <input type="text" value={card.name} placeholder="RAHUL SHARMA"
          onChange={(e) => setCard(p => ({ ...p, name: e.target.value.toUpperCase() }))}
          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 font-bold tracking-wider" />
      </div>
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm font-semibold">
          <AlertCircle size={14} /> {error}
        </div>
      )}
      <button onClick={handlePay} disabled={loading}
        className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95">
        {loading ? <><Loader2 className="animate-spin" size={20} /> Processing...</> : 'Pay via Card'}
      </button>
    </div>
  );
};

// ─── Netbanking Tab ───────────────────────────────────────────────────────────
const NetbankingTab = ({ onPay, loading }) => {
  const [bank, setBank] = useState('');
  const banks = ['State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank', 'Bank of Baroda', 'Other'];

  return (
    <div className="space-y-4">
      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Select Your Bank</label>
      <div className="grid grid-cols-2 gap-3">
        {banks.map(b => (
          <button key={b} type="button" onClick={() => setBank(b)}
            className={`p-3 rounded-xl border-2 text-sm font-semibold text-left transition-all ${bank === b ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-100 hover:border-blue-200 bg-white'}`}>
            {b}
          </button>
        ))}
      </div>
      <button onClick={() => bank && onPay('netbanking', { bank })} disabled={loading || !bank}
        className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-95">
        {loading ? <><Loader2 className="animate-spin" size={20} /> Redirecting...</> : 'Proceed to Bank'}
      </button>
    </div>
  );
};

// ─── Processing Overlay ───────────────────────────────────────────────────────
const ProcessingOverlay = ({ method }) => (
  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-[3rem] flex flex-col items-center justify-center z-10">
    <div className="w-20 h-20 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-6" />
    <p className="text-xl font-black text-slate-800">Processing Payment</p>
    <p className="text-slate-500 text-sm mt-2">
      {method === 'upi' ? 'Waiting for UPI confirmation...' :
       method === 'card' ? 'Verifying card details...' :
       'Connecting to your bank...'}
    </p>
    <p className="text-xs text-slate-400 mt-4">Please do not close this window</p>
  </div>
);

// ─── Success Overlay ──────────────────────────────────────────────────────────
const SuccessOverlay = ({ txnId, amount, onClose, onTrack }) => (
  <div className="absolute inset-0 bg-white rounded-[3rem] flex flex-col items-center justify-center z-10 p-8 text-center">
    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-in zoom-in-50">
      <Check size={48} />
    </div>
    <h3 className="text-3xl font-black text-slate-800 mb-2">Payment Successful!</h3>
    <p className="text-slate-500 mb-1">Transaction ID</p>
    <p className="font-mono font-bold text-blue-600 text-sm bg-blue-50 px-4 py-2 rounded-xl mb-6">{txnId}</p>
    <p className="text-4xl font-black text-slate-800 mb-8">₹{Number(amount).toLocaleString()}</p>
    <div className="w-full space-y-3">
      <button onClick={onTrack}
        className="w-full bg-blue-900 text-white py-4 rounded-2xl font-bold shadow-lg hover:bg-blue-800">
        Track Status
      </button>
      <button onClick={onClose}
        className="w-full text-slate-500 font-bold py-2 hover:text-slate-700">
        Back to Menu
      </button>
    </div>
  </div>
);

// ─── Main PaymentModal ────────────────────────────────────────────────────────
export default function PaymentModal({
  isOpen, onClose,
  amount, department, connectionId, description,
  onSuccess,   // called with (txnId, receiptId) after success
}) {
  const [tab, setTab]           = useState('upi');
  const [step, setStep]         = useState('form');  // form | processing | success | failed
  const [txnData, setTxnData]   = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');

  if (!isOpen) return null;

  const tabs = [
    { id: 'upi',        label: 'UPI',         icon: Smartphone  },
    { id: 'card',       label: 'Card',         icon: CreditCard  },
    { id: 'netbanking', label: 'Net Banking',  icon: Building2   },
  ];

  const handlePay = async (method, methodData) => {
    setLoading(true);
    setError('');
    setStep('processing');

    try {
      // Step 1: Initiate
      const initRes = await initiatePayment({ department, connectionId, amount, description });
      const { txnId, orderId } = initRes.data;

      // Simulate processing delay (realistic feel)
      await new Promise(r => setTimeout(r, 2000));

      // Step 2: Confirm
      const confirmRes = await confirmPayment({ txnId, orderId, method, department, connectionId, amount });

      setTxnData(confirmRes.data);
      setStep('success');
      if (onSuccess) onSuccess(confirmRes.data.txnId, confirmRes.data.receiptId);

    } catch (err) {
      setStep('failed');
      setError(err.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('form');
    setTab('upi');
    setError('');
    setTxnData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl relative overflow-hidden">

        {/* Processing overlay */}
        {step === 'processing' && <ProcessingOverlay method={tab} />}

        {/* Success overlay */}
        {step === 'success' && txnData && (
          <SuccessOverlay
            txnId={txnData.txnId}
            amount={amount}
            onClose={handleClose}
            onTrack={() => { handleClose(); }}
          />
        )}

        <div className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Secure Payment</p>
              <p className="text-3xl font-black text-slate-800">₹{Number(amount).toLocaleString()}</p>
              <p className="text-sm text-slate-500 mt-1">{description || `${department} bill payment`}</p>
            </div>
            <button onClick={handleClose} className="text-slate-400 hover:text-slate-600 p-2">
              <X size={22} />
            </button>
          </div>

          {/* Failed error */}
          {step === 'failed' && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-semibold text-sm">
              <AlertCircle size={16} /> {error}
              <button onClick={() => setStep('form')} className="ml-auto underline text-xs">Retry</button>
            </div>
          )}

          {/* Payment Tabs */}
          {(step === 'form' || step === 'failed') && (
            <>
              <div className="flex bg-slate-100 rounded-2xl p-1 mb-6">
                {tabs.map(t => (
                  <button key={t.id} onClick={() => { setTab(t.id); setError(''); }}
                    className={`flex-1 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${tab === t.id ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500 hover:text-slate-700'}`}>
                    <t.icon size={14} /> {t.label}
                  </button>
                ))}
              </div>

              {tab === 'upi'        && <UpiTab        onPay={handlePay} loading={loading} />}
              {tab === 'card'       && <CardTab       onPay={handlePay} loading={loading} />}
              {tab === 'netbanking' && <NetbankingTab onPay={handlePay} loading={loading} />}
            </>
          )}

          {/* Security badge */}
          <div className="flex items-center justify-center gap-2 mt-5 text-slate-400">
            <ShieldCheck size={14} />
            <span className="text-xs font-semibold">256-bit SSL Encrypted • Safe & Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}