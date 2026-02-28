import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { getGasConnections, submitGasComplaint } from '../../services/gasService';

export default function GasComplaints({ setView, simulateSuccess }) {
  const [connections, setConnections] = useState([]);
  const [selectedConn, setSelectedConn] = useState('');
  const [category, setCategory]         = useState('');
  const [description, setDescription]   = useState('');
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');

  useEffect(() => {
    getGasConnections()
      .then(res => {
        const conns = res.data?.connections || [];
        setConnections(conns);
        if (conns.length > 0) setSelectedConn(conns[0].connectionId);
      })
      .catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedConn || !category || !description) {
      setError('Please fill all fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await submitGasComplaint(selectedConn, category, description);
      simulateSuccess(
        'Complaint Filed',
        res.data?.message || `Ticket: ${res.data?.ticketId}. Resolution in 24 hours.`,
        res.data?.ticketId
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit complaint.');
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
        <h2 className="text-3xl font-black text-slate-800 mb-8">Register Grievance</h2>

        {error && (
          <div className="flex items-center gap-2 p-3 mb-6 bg-red-50 border border-red-200 rounded-xl text-red-600 font-semibold text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Select Connection
              </label>
              <select
                value={selectedConn}
                onChange={(e) => setSelectedConn(e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl outline-none border border-gray-200 font-bold"
              >
                {connections.map((c, i) => (
                  <option key={i} value={c.connectionId}>{c.label} — {c.connectionId}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Issue Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-4 bg-gray-50 rounded-xl outline-none border border-gray-200"
              >
                <option value="">Select category...</option>
                <option value="Gas Leakage">Gas Leakage (Critical)</option>
                <option value="Low Gas Pressure">Low Gas Pressure</option>
                <option value="Incorrect Bill Amount">Incorrect Bill Amount</option>
                <option value="Delay in Delivery">Delay in Delivery</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Description of Issue
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-4 bg-gray-50 rounded-xl outline-none border border-gray-200 h-32"
              placeholder="Describe the problem in detail..."
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading || !selectedConn || !category || !description}
            className="w-full bg-red-600 text-white py-5 rounded-2xl font-black shadow-xl hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading
              ? <><Loader2 className="animate-spin" size={20} /> Submitting...</>
              : 'Submit Complaint'
            }
          </button>
        </form>
      </div>
    </div>
  );
}