import { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, Clock, Download, Zap, Flame, Droplets, Building2, CreditCard } from 'lucide-react';
import { getPaymentHistory } from '../../services/paymentService';

const deptIcon = (dept) => {
  if (!dept) return <CreditCard size={18} />;
  const d = dept.toLowerCase();
  if (d.includes('electricity')) return <Zap size={18} />;
  if (d.includes('gas'))         return <Flame size={18} />;
  if (d.includes('water'))       return <Droplets size={18} />;
  if (d.includes('municipality'))return <Building2 size={18} />;
  return <CreditCard size={18} />;
};

const deptColor = (dept) => {
  if (!dept) return 'bg-slate-100 text-slate-600';
  const d = dept.toLowerCase();
  if (d.includes('electricity')) return 'bg-blue-100 text-blue-600';
  if (d.includes('gas'))         return 'bg-orange-100 text-orange-600';
  if (d.includes('water'))       return 'bg-cyan-100 text-cyan-600';
  if (d.includes('municipality'))return 'bg-purple-100 text-purple-600';
  return 'bg-slate-100 text-slate-600';
};

const statusBadge = (status) => {
  if (status === 'success') return <span className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold"><Check size={10} /> Paid</span>;
  if (status === 'failed')  return <span className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold"><X size={10} /> Failed</span>;
  return <span className="flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold"><Clock size={10} /> Pending</span>;
};

// Mock history for demo when DB is empty
const MOCK_HISTORY = [
  { txn_id: 'TXN-A1B2C3', department: 'electricity', connection_id: 'EL-2024-00123', amount: 4250, payment_method: 'upi', status: 'success', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
  { txn_id: 'TXN-D4E5F6', department: 'gas',         connection_id: 'GAS-1092837',   amount: 1250, payment_method: 'card', status: 'success', created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
  { txn_id: 'TXN-G7H8I9', department: 'water',       connection_id: '9921-0012-334', amount: 1450, payment_method: 'netbanking', status: 'success', created_at: new Date(Date.now() - 86400000 * 10).toISOString() },
  { txn_id: 'TXN-J1K2L3', department: 'municipality', connection_id: 'PROP-4421-A', amount: 4800, payment_method: 'upi', status: 'success', created_at: new Date(Date.now() - 86400000 * 15).toISOString() },
];

export default function PaymentHistory({ onBack }) {
  const [payments, setPayments]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('all');
  const [search, setSearch]       = useState('');

  useEffect(() => {
    getPaymentHistory()
      .then(res => {
        const data = res.data?.payments || [];
        // Use mock data if DB is empty (for demo)
        setPayments(data.length > 0 ? data : MOCK_HISTORY);
      })
      .catch(() => setPayments(MOCK_HISTORY))
      .finally(() => setLoading(false));
  }, []);

  const depts = ['all', 'electricity', 'gas', 'water', 'municipality'];

  const filtered = payments.filter(p => {
    const matchesDept   = filter === 'all' || p.department === filter;
    const matchesSearch = !search || p.txn_id?.toLowerCase().includes(search.toLowerCase()) || p.connection_id?.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const totalPaid = filtered
    .filter(p => p.status === 'success')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const formatTime = (iso) => new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          {onBack && (
            <button onClick={onBack} className="text-slate-400 hover:text-slate-600 p-2">
              <ArrowLeft size={24} />
            </button>
          )}
          <div>
            <h1 className="text-3xl font-black text-slate-800">Payment History</h1>
            <p className="text-slate-500 text-sm">Your all department payment records</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Paid', value: `₹${totalPaid.toLocaleString()}`, color: 'bg-green-50 border-green-100', text: 'text-green-700' },
            { label: 'Transactions', value: filtered.filter(p => p.status === 'success').length, color: 'bg-blue-50 border-blue-100', text: 'text-blue-700' },
            { label: 'This Month', value: `₹${filtered.filter(p => new Date(p.created_at).getMonth() === new Date().getMonth() && p.status === 'success').reduce((s, p) => s + Number(p.amount), 0).toLocaleString()}`, color: 'bg-purple-50 border-purple-100', text: 'text-purple-700' },
            { label: 'Departments', value: [...new Set(payments.map(p => p.department))].length, color: 'bg-orange-50 border-orange-100', text: 'text-orange-700' },
          ].map((card, i) => (
            <div key={i} className={`p-5 rounded-2xl border ${card.color}`}>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{card.label}</p>
              <p className={`text-2xl font-black ${card.text}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input type="text" placeholder="Search by TXN ID or Connection ID..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:border-blue-400 font-medium" />
          <div className="flex gap-2 overflow-x-auto">
            {depts.map(d => (
              <button key={d} onClick={() => setFilter(d)}
                className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${filter === d ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-400'}`}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-400">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-slate-600 rounded-full animate-spin mr-3" />
              Loading transactions...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <CreditCard size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-bold">No transactions found</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {filtered.map((payment, i) => (
                <div key={i} className="flex items-center gap-4 p-5 hover:bg-slate-50 transition-colors">
                  {/* Dept icon */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${deptColor(payment.department)}`}>
                    {deptIcon(payment.department)}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-slate-800 capitalize">{payment.department || 'Payment'}</p>
                      {statusBadge(payment.status)}
                    </div>
                    <p className="text-xs text-slate-500 font-mono truncate">{payment.txn_id}</p>
                    <p className="text-xs text-slate-400">{payment.connection_id} • {payment.payment_method?.toUpperCase()}</p>
                  </div>

                  {/* Amount + Date */}
                  <div className="text-right flex-shrink-0">
                    <p className={`text-lg font-black ${payment.status === 'success' ? 'text-slate-800' : 'text-red-500'}`}>
                      ₹{Number(payment.amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-slate-400">{formatDate(payment.created_at)}</p>
                    <p className="text-xs text-slate-300">{formatTime(payment.created_at)}</p>
                  </div>

                  {/* Download */}
                  {payment.status === 'success' && (
                    <button className="text-slate-300 hover:text-blue-500 transition-colors p-2 flex-shrink-0">
                      <Download size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}