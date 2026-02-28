import { useState } from 'react';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { applyGasConnection } from '../../services/gasService';

export default function GasNewConnection({ setView, simulateSuccess }) {
  const [form, setForm] = useState({
    fullName: '', mobile: '', connectionType: 'Domestic', idProof: '', address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (field, value) => { setForm(p => ({ ...p, [field]: value })); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await applyGasConnection(form);
      simulateSuccess(
        'Application Sent',
        res.data?.message || `Application ID: ${res.data?.applicationId}. Verification soon.`,
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
      <button onClick={() => setView('menu')} className="text-orange-600 font-bold mb-6 flex items-center gap-2">
        <ArrowLeft size={18} /> Back
      </button>
      <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-100">
        <h2 className="text-3xl font-black text-slate-800 mb-8">New Connection Application</h2>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-600 font-semibold text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Full Name</label>
              <input type="text" placeholder="Enter name" required value={form.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Mobile Number</label>
              <input type="tel" placeholder="10-digit mobile" required value={form.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-orange-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Connection Type</label>
              <select value={form.connectionType} onChange={(e) => handleChange('connectionType', e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none">
                <option>Domestic</option>
                <option>Commercial</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">ID Proof (Aadhaar/PAN)</label>
              <input type="text" placeholder="Enter ID number" required value={form.idProof}
                onChange={(e) => handleChange('idProof', e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-orange-500" />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">Installation Address</label>
              <textarea placeholder="Flat No, Street, Landmark, Pincode" required value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:border-orange-500 h-24" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-900 text-white py-5 rounded-2xl font-black mt-10 shadow-xl hover:bg-blue-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="animate-spin" size={20} /> Submitting...</> : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
}