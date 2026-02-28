import { useState } from 'react';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { applyNewConnection } from '../../services/electricityService';


export default function NewConnection({ setView, simulateSuccess }) {
  const [form, setForm] = useState({
    fullName: '', fatherName: '', mobile: '',
    dob: '', address: '', connectionType: 'Domestic (Home)', load: '3 kW',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await applyNewConnection(form);
      simulateSuccess(
        'Application Submitted',
        res.data.message,
        res.data.applicationId
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12 w-full animate-in slide-in-from-bottom duration-500">
      <button onClick={() => setView('menu')} className="flex items-center gap-2 text-blue-900 font-bold mb-6 hover:underline">
        <ArrowLeft size={20} /> Back
      </button>
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-800">New Connection Application</h2>
          <p className="text-slate-500 mt-2">Fill in the details to apply for a new electricity connection</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-600 font-semibold text-sm">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Applicant Details */}
          <div>
            <h4 className="text-blue-600 font-bold mb-6 flex items-center gap-2 uppercase text-xs tracking-wider">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">1</span>
              Applicant Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text" placeholder="Full Name" required
                value={form.fullName}
                onChange={(e) => handleChange('fullName', e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
              />
              <input
                type="text" placeholder="Father's Name" required
                value={form.fatherName}
                onChange={(e) => handleChange('fatherName', e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
              />
              <input
                type="tel" placeholder="Mobile Number" required
                value={form.mobile}
                onChange={(e) => handleChange('mobile', e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
              />
              <input
                type="date" required
                value={form.dob}
                onChange={(e) => handleChange('dob', e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Address & Load */}
          <div>
            <h4 className="text-blue-600 font-bold mb-6 flex items-center gap-2 uppercase text-xs tracking-wider">
              <span className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">2</span>
              Address & Load
            </h4>
            <div className="space-y-6">
              <textarea
                placeholder="Service Address" rows="3" required
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <select
                  value={form.connectionType}
                  onChange={(e) => handleChange('connectionType', e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                >
                  <option>Domestic (Home)</option>
                  <option>Commercial</option>
                  <option>Industrial</option>
                </select>
                <select
                  value={form.load}
                  onChange={(e) => handleChange('load', e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                >
                  <option>1 kW</option>
                  <option>3 kW</option>
                  <option>5 kW</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-5 rounded-2xl font-bold shadow-xl hover:bg-green-700 active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {loading
                ? <><Loader2 className="animate-spin" size={22} /> Submitting...</>
                : 'Submit Application'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}