import { useState } from 'react';
import { Check, FileText, Home, Loader2, AlertCircle } from 'lucide-react';
import { applyWaterConnection } from '../../services/waterService';

export default function WaterNewConnection({ handleProcessSimulation }) {
  const [form, setForm] = useState({ applicantName: '', mobile: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (field, value) => { setForm(p => ({ ...p, [field]: value })); setError(''); };

  const handleSubmit = async () => {
    if (!form.applicantName || !form.address) {
      setError('Please fill all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await applyWaterConnection(form);
      handleProcessSimulation(
        'Application Submitted',
        res.data?.message || `Ticket: ${res.data?.ticketId}`
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-[40px] shadow-lg w-full max-w-5xl">
      <div className="flex items-center gap-6 mb-10">
        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
          <Home size={32} />
        </div>
        <div>
          <h2 className="text-3xl font-bold">New Connection Application</h2>
          <p className="text-slate-500">Naye connection ke liye apply karein</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-600 font-semibold text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-400 ml-2">Applicant Name *</label>
              <input type="text" value={form.applicantName}
                onChange={(e) => handleChange('applicantName', e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500"
                placeholder="Full Name" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 ml-2">Mobile Number</label>
              <input type="text" value={form.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500"
                placeholder="98XXXXXXXX" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 ml-2">Full Address *</label>
            <textarea value={form.address}
              onChange={(e) => handleChange('address', e.target.value)}
              className="w-full p-4 h-24 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-blue-500"
              placeholder="Plot No, Street, Landmark..." />
          </div>

          <div className="flex gap-4">
            <button className="flex-1 p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl text-center hover:bg-slate-100">
              <FileText className="mx-auto mb-2 text-slate-400" size={32} />
              <p className="text-xs font-bold">Aadhar Card</p>
              <p className="text-[10px] text-blue-600 underline mt-1">Scan Here</p>
            </button>
            <button className="flex-1 p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-3xl text-center hover:bg-slate-100">
              <Home className="mx-auto mb-2 text-slate-400" size={32} />
              <p className="text-xs font-bold">Property Tax</p>
              <p className="text-[10px] text-blue-600 underline mt-1">Scan Here</p>
            </button>
          </div>

          <button onClick={handleSubmit} disabled={loading}
            className="w-full py-6 bg-green-600 text-white rounded-3xl font-bold text-2xl shadow-xl hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="animate-spin" size={24} /> Submitting...</> : 'Submit Application'}
          </button>
        </div>

        <div className="bg-green-50 p-8 rounded-[40px] h-fit">
          <h4 className="font-bold text-green-800 mb-4">Required Documents:</h4>
          <ul className="space-y-4 text-sm text-green-700">
            <li className="flex gap-2"><Check size={16} /> Aadhar Card Copy</li>
            <li className="flex gap-2"><Check size={16} /> Ownership Proof</li>
            <li className="flex gap-2"><Check size={16} /> Photograph</li>
            <li className="flex gap-2"><Check size={16} /> Application Fee: ₹500</li>
          </ul>
        </div>
      </div>
    </div>
  );
}