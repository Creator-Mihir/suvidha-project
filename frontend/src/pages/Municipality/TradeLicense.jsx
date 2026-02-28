import { useState } from 'react';
import { Store, Loader2, AlertCircle } from 'lucide-react';
import { applyTradeLicense } from '../../services/municipalityService';

const businessTypes = ['Retail Shop','Restaurant/Dhaba','Medical Store','Salon/Parlour','Repair Workshop','Wholesale','Manufacturing','Other'];

export default function TradeLicense({ setView, simulateSuccess }) {
  const [isRenew, setIsRenew] = useState(false);
  const [form, setForm] = useState({ existingLicense: '', ownerName: '', businessName: '', mobile: '', businessType: 'Retail Shop', employees: '1-5', idNumber: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (field, value) => { setForm(p => ({ ...p, [field]: value })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await applyTradeLicense({ ...form, isRenewal: isRenew });
      simulateSuccess(
        `License ${isRenew ? 'Renewal' : 'Application'} Submitted!`,
        res.data?.message || `Trade License ID: ${res.data?.applicationId}\nInspection in 5 working days.`,
        res.data?.applicationId
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit. Please try again.');
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
            <h2 className="text-2xl font-black text-slate-800">Trade License</h2>
            <p className="text-slate-500 text-sm">New license apply ya existing renew karein</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <button onClick={() => setIsRenew(false)} className={`py-4 rounded-2xl font-black border-2 transition-all ${!isRenew ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-600 border-gray-200 hover:border-green-300'}`}>New License</button>
          <button onClick={() => setIsRenew(true)}  className={`py-4 rounded-2xl font-black border-2 transition-all ${isRenew  ? 'bg-green-600 text-white border-green-600' : 'bg-white text-slate-600 border-gray-200 hover:border-green-300'}`}>Renew License</button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-semibold text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRenew && (
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Existing License Number</label>
              <input type="text" placeholder="e.g. TRD-123456" required value={form.existingLicense} onChange={(e) => set('existingLicense', e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-green-500" /></div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Owner Name</label>
              <input type="text" placeholder="Full Name" required value={form.ownerName} onChange={(e) => set('ownerName', e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-green-500" /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Business Name</label>
              <input type="text" placeholder="Shop / Firm Name" required value={form.businessName} onChange={(e) => set('businessName', e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-green-500" /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Mobile Number</label>
              <input type="tel" placeholder="10-digit number" required value={form.mobile} onChange={(e) => set('mobile', e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-green-500" /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Business Type</label>
              <select value={form.businessType} onChange={(e) => set('businessType', e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none">
                {businessTypes.map(t => <option key={t}>{t}</option>)}</select></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Number of Employees</label>
              <select value={form.employees} onChange={(e) => set('employees', e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none">
                <option>1-5</option><option>6-10</option><option>11-25</option><option>25+</option></select></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Aadhaar / PAN Number</label>
              <input type="text" placeholder="ID Number" required value={form.idNumber} onChange={(e) => set('idNumber', e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-green-500" /></div>
            <div className="md:col-span-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Business Address</label>
              <textarea placeholder="Shop no., Street, Ward, City..." required value={form.address} onChange={(e) => set('address', e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-green-500 h-24" /></div>
          </div>

          <div className="bg-green-50 p-5 rounded-2xl border border-green-100">
            <p className="font-bold text-green-800 mb-2">📋 Required Documents:</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
              <span>✓ Aadhaar Card</span><span>✓ Shop Ownership/Rent Proof</span>
              <span>✓ Passport Size Photo</span><span>✓ NOC (if rented)</span>
            </div>
            <p className="text-xs text-green-600 mt-3">Fee: ₹500–₹2,000 | Valid: 1 Year</p>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-green-600 text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="animate-spin" size={20} /> Submitting...</> : isRenew ? 'Submit Renewal Request' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}