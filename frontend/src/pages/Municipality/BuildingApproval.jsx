import { useState } from 'react';
import { Building2, Loader2, AlertCircle } from 'lucide-react';
import { applyBuildingApproval } from '../../services/municipalityService';

export default function BuildingApproval({ setView, simulateSuccess }) {
  const [form, setForm] = useState({ applicantName: '', mobile: '', plotNumber: '', plotArea: '', constructionType: 'Residential', floors: '1', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const set = (field, value) => { setForm(p => ({ ...p, [field]: value })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await applyBuildingApproval(form);
      simulateSuccess(
        'Application Submitted!',
        res.data?.message || `Building Approval ID: ${res.data?.applicationId}\nSite inspection in 7 days.`,
        res.data?.applicationId
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-yellow-100 rounded-2xl flex items-center justify-center">
            <Building2 size={28} className="text-yellow-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800">Building Plan Approval</h2>
            <p className="text-slate-500 text-sm">New construction ya renovation ke liye apply karein</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-600 font-semibold text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Applicant Name</label>
              <input type="text" placeholder="Full Name" required value={form.applicantName} onChange={(e) => set('applicantName', e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-yellow-500" /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Mobile Number</label>
              <input type="tel" placeholder="10-digit number" required value={form.mobile} onChange={(e) => set('mobile', e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-yellow-500" /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Plot / Survey Number</label>
              <input type="text" placeholder="Enter plot number" required value={form.plotNumber} onChange={(e) => set('plotNumber', e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-yellow-500" /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Plot Area (sq ft)</label>
              <input type="number" placeholder="e.g. 1200" required value={form.plotArea} onChange={(e) => set('plotArea', e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-yellow-500" /></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Construction Type</label>
              <select value={form.constructionType} onChange={(e) => set('constructionType', e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none">
                {['Residential','Commercial','Industrial','Mixed Use'].map(t => <option key={t}>{t}</option>)}</select></div>
            <div><label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Number of Floors</label>
              <select value={form.floors} onChange={(e) => set('floors', e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none">
                {[1,2,3,4,5,'5+'].map(f => <option key={f} value={f}>{f} Floor{f !== 1 ? 's' : ''}</option>)}</select></div>
            <div className="md:col-span-2"><label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Site Address</label>
              <textarea placeholder="Complete address with ward/zone..." required value={form.address} onChange={(e) => set('address', e.target.value)} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-yellow-500 h-24" /></div>
          </div>

          <div className="bg-yellow-50 p-5 rounded-2xl border border-yellow-100">
            <p className="font-bold text-yellow-800 mb-2">📋 Required Documents:</p>
            <div className="grid grid-cols-2 gap-2 text-sm text-yellow-700">
              <span>✓ Site Plan (AutoCAD/PDF)</span><span>✓ Ownership Proof</span>
              <span>✓ NOC from Neighbours</span><span>✓ Structural Certificate</span>
            </div>
            <p className="text-xs text-yellow-600 mt-3">Fee: ₹2,500 | Processing: 15-30 working days</p>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-yellow-500 text-white py-5 rounded-2xl font-black text-lg shadow-lg hover:bg-yellow-600 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="animate-spin" size={20} /> Submitting...</> : 'Submit for Approval'}
          </button>
        </form>
      </div>
    </div>
  );
}