import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { useNavigate } from 'react-router-dom';

// ── DATA ────────────────────────────────────────────────────────────────────────
const monthlyData = [
  { month: 'Aug', connections: 30, complaints: 15, deliveries: 280 },
  { month: 'Sep', connections: 35, complaints: 12, deliveries: 310 },
  { month: 'Oct', connections: 28, complaints: 18, deliveries: 295 },
  { month: 'Nov', connections: 42, complaints: 10, deliveries: 340 },
  { month: 'Dec', connections: 38, complaints: 14, deliveries: 360 },
  { month: 'Jan', connections: 50, complaints: 8, deliveries: 390 },
  { month: 'Feb', connections: 45, complaints: 11, deliveries: 375 },
];
const connectionTypes = [
  { name: 'PNG Residential', value: 55, color: '#E67E22' },
  { name: 'PNG Commercial', value: 25, color: '#A04000' },
  { name: 'LPG Domestic', value: 15, color: '#F0B27A' },
  { name: 'Industrial', value: 5, color: '#784212' },
];
const trendData = [
  { month: 'Aug', revenue: 185000 }, { month: 'Sep', revenue: 210000 },
  { month: 'Oct', revenue: 195000 }, { month: 'Nov', revenue: 245000 },
  { month: 'Dec', revenue: 268000 }, { month: 'Jan', revenue: 285000 },
  { month: 'Feb', revenue: 280000 },
];
const CONNECTIONS_DATA = [
  { id: 'GAS-001', name: 'Rahul Sharma', fatherName: 'Ram Sharma', mobile: '9999999999', address: '123 Main St, Indore', connectionType: 'PNG Residential', loadRequired: '2 SCMD', purpose: 'New Construction', date: '27 Feb 2026', status: 'pending', documents: { idProof: true, addressProof: true, ownershipProof: false, nocCertificate: true, passportPhoto: true, signature: true } },
  { id: 'GAS-002', name: 'Priya Verma', fatherName: 'Suresh Verma', mobile: '8888888888', address: '456 Gandhi Nagar, Bhopal', connectionType: 'PNG Commercial', loadRequired: '10 SCMD', purpose: 'New Business', date: '26 Feb 2026', status: 'approved', documents: { idProof: true, addressProof: true, ownershipProof: true, nocCertificate: true, passportPhoto: true, signature: true } },
  { id: 'GAS-003', name: 'Amit Kumar', fatherName: 'Vijay Kumar', mobile: '7777777777', address: '789 Industrial Area, Jabalpur', connectionType: 'Industrial', loadRequired: '50 SCMD', purpose: 'Industrial Use', date: '25 Feb 2026', status: 'processing', documents: { idProof: true, addressProof: true, ownershipProof: true, nocCertificate: false, passportPhoto: true, signature: true } },
  { id: 'GAS-004', name: 'Sunita Devi', fatherName: 'Mohan Lal', mobile: '6666666666', address: '321 Village Rd, Ujjain', connectionType: 'LPG Domestic', loadRequired: '1 Cylinder/Month', purpose: 'Household', date: '24 Feb 2026', status: 'rejected', documents: { idProof: true, addressProof: false, ownershipProof: false, nocCertificate: false, passportPhoto: true, signature: false } },
  { id: 'GAS-005', name: 'Vikram Singh', fatherName: 'Baldev Singh', mobile: '5555555555', address: '654 Civil Lines, Gwalior', connectionType: 'PNG Residential', loadRequired: '3 SCMD', purpose: 'Renovation', date: '23 Feb 2026', status: 'pending', documents: { idProof: true, addressProof: true, ownershipProof: true, nocCertificate: true, passportPhoto: true, signature: true } },
];
const COMPLAINTS_DATA = [
  { id: 'GCMP-001', customerId: 'GC12345', name: 'Mohan Lal', mobile: '9999999999', address: '123 Main St, Indore', type: 'gas_leakage', description: 'Rasoi mein gas ki tej smell aa rahi hai, bahut khatarnak lag raha hai', date: '27 Feb 2026', status: 'pending', assignedTo: '', priority: 'high' },
  { id: 'GCMP-002', customerId: 'GC23456', name: 'Geeta Bai', mobile: '8888888888', address: '456 Gandhi Nagar, Bhopal', type: 'low_pressure', description: 'Gas pressure bahut kam hai, khana banana mushkil ho raha hai', date: '26 Feb 2026', status: 'in_progress', assignedTo: 'Technician Ramesh', priority: 'medium' },
  { id: 'GCMP-003', customerId: 'GC34567', name: 'Ramesh Yadav', mobile: '7777777777', address: '789 Civil Lines, Jabalpur', type: 'billing_issue', description: 'Is mahine ka bill bahut zyada aa gaya hai', date: '25 Feb 2026', status: 'resolved', assignedTo: 'Billing Team', priority: 'low' },
  { id: 'GCMP-004', customerId: 'GC45678', name: 'Sita Devi', mobile: '6666666666', address: '321 Village Rd, Ujjain', type: 'pipeline_damage', description: 'Bahar ki pipeline se gas nikal rahi hai, sadak pe smell aa rahi hai', date: '24 Feb 2026', status: 'pending', assignedTo: '', priority: 'high' },
  { id: 'GCMP-005', customerId: 'GC56789', name: 'Vijay Kumar', mobile: '5555555555', address: '654 Nehru Nagar, Gwalior', type: 'meter_fault', description: 'Meter reading sahi nahi aa rahi hai', date: '23 Feb 2026', status: 'in_progress', assignedTo: 'Technician Suresh', priority: 'medium' },
];
const PAYMENTS_DATA = [
  { id: 'GPAY-001', customerId: 'GC12345', name: 'Rahul Sharma', mobile: '9999999999', billMonth: 'January 2026', units: '45 SCMD', amount: 850, paidOn: '27 Feb 2026', transactionId: 'TXN-1740000001', status: 'paid', type: 'Gas Bill' },
  { id: 'GPAY-002', customerId: 'GC23456', name: 'Priya Verma', mobile: '8888888888', billMonth: 'January 2026', units: '120 SCMD', amount: 2400, paidOn: '26 Feb 2026', transactionId: 'TXN-1740000002', status: 'paid', type: 'Gas Bill' },
  { id: 'GPAY-003', customerId: 'GC34567', name: 'Amit Kumar', mobile: '7777777777', billMonth: 'February 2026', units: '35 SCMD', amount: 650, paidOn: '-', transactionId: '-', status: 'unpaid', type: 'Gas Bill' },
  { id: 'GPAY-004', customerId: 'GC45678', name: 'Sunita Devi', mobile: '6666666666', billMonth: 'Connection Fee', units: '-', amount: 1500, paidOn: '24 Feb 2026', transactionId: 'TXN-1740000004', status: 'paid', type: 'Connection Fee' },
  { id: 'GPAY-005', customerId: 'GC56789', name: 'Vikram Singh', mobile: '5555555555', billMonth: 'January 2026', units: '80 SCMD', amount: 1600, paidOn: '23 Feb 2026', transactionId: 'TXN-1740000005', status: 'paid', type: 'Gas Bill' },
  { id: 'GPAY-006', customerId: 'GC67890', name: 'Meena Kumari', mobile: '4444444444', billMonth: 'February 2026', units: '55 SCMD', amount: 1050, paidOn: '-', transactionId: '-', status: 'unpaid', type: 'Gas Bill' },
];
const DELIVERIES_DATA = [
  { id: 'DEL-001', customerId: 'GC12345', name: 'Rahul Sharma', mobile: '9999999999', address: '123 Main St, Indore', deliveryType: 'PNG Supply', quantity: '45 SCMD', scheduledDate: '28 Feb 2026', deliveredDate: '28 Feb 2026', deliveryBoy: 'Ramesh Kumar', status: 'delivered' },
  { id: 'DEL-002', customerId: 'GC23456', name: 'Priya Verma', mobile: '8888888888', address: '456 Gandhi Nagar, Bhopal', deliveryType: 'LPG Cylinder', quantity: '1 Cylinder (14.2 kg)', scheduledDate: '28 Feb 2026', deliveredDate: '-', deliveryBoy: 'Suresh Singh', status: 'in_transit' },
  { id: 'DEL-003', customerId: 'GC34567', name: 'Amit Kumar', mobile: '7777777777', address: '789 Industrial Area, Jabalpur', deliveryType: 'LPG Cylinder', quantity: '2 Cylinders (14.2 kg each)', scheduledDate: '27 Feb 2026', deliveredDate: '-', deliveryBoy: '', status: 'pending' },
  { id: 'DEL-004', customerId: 'GC45678', name: 'Sunita Devi', mobile: '6666666666', address: '321 Village Rd, Ujjain', deliveryType: 'LPG Cylinder', quantity: '1 Cylinder (14.2 kg)', scheduledDate: '26 Feb 2026', deliveredDate: '26 Feb 2026', deliveryBoy: 'Mahesh Yadav', status: 'delivered' },
  { id: 'DEL-005', customerId: 'GC56789', name: 'Vikram Singh', mobile: '5555555555', address: '654 Civil Lines, Gwalior', deliveryType: 'PNG Supply', quantity: '80 SCMD', scheduledDate: '28 Feb 2026', deliveredDate: '-', deliveryBoy: 'Ramesh Kumar', status: 'in_transit' },
  { id: 'DEL-006', customerId: 'GC67890', name: 'Meena Kumari', mobile: '4444444444', address: '987 Shivaji Nagar, Indore', deliveryType: 'LPG Cylinder', quantity: '1 Cylinder (14.2 kg)', scheduledDate: '28 Feb 2026', deliveredDate: '-', deliveryBoy: '', status: 'pending' },
];
const docLabels = { idProof: 'ID Proof', addressProof: 'Address Proof', ownershipProof: 'Ownership Proof', nocCertificate: 'NOC Certificate', passportPhoto: 'Passport Photo', signature: 'Signature' };
const complaintTypes = { gas_leakage: { en: 'Gas Leakage', hi: 'गैस रिसाव', icon: '🚨', color: '#E74C3C' }, low_pressure: { en: 'Low Pressure', hi: 'कम दबाव', icon: '🔋', color: '#F39C12' }, billing_issue: { en: 'Billing Issue', hi: 'बिलिंग समस्या', icon: '📄', color: '#2E86C1' }, pipeline_damage: { en: 'Pipeline Damage', hi: 'पाइपलाइन क्षति', icon: '🔧', color: '#922B21' }, meter_fault: { en: 'Meter Fault', hi: 'मीटर खराब', icon: '📟', color: '#A04000' } };
const priorityStyles = { high: { background: '#FADBD8', color: '#922B21', label: 'High', labelHi: 'उच्च' }, medium: { background: '#FDEBD0', color: '#A04000', label: 'Medium', labelHi: 'मध्यम' }, low: { background: '#D5F5E3', color: '#1E8449', label: 'Low', labelHi: 'कम' } };

// ── HELPERS ─────────────────────────────────────────────────────────────────────
const C = { primary: '#A04000', accent: '#E67E22', grad: 'linear-gradient(180deg,#A04000 0%,#784212 100%)' };

function badge(status) {
  return { pending: { background: '#FEF9E7', color: '#784212' }, approved: { background: '#D5F5E3', color: '#1E8449' }, rejected: { background: '#FADBD8', color: '#922B21' }, processing: { background: '#FDEBD0', color: '#A04000' }, in_progress: { background: '#FDEBD0', color: '#A04000' }, resolved: { background: '#D5F5E3', color: '#1E8449' }, paid: { background: '#D5F5E3', color: '#1E8449' }, unpaid: { background: '#FADBD8', color: '#922B21' }, delivered: { background: '#D5F5E3', color: '#1E8449' }, in_transit: { background: '#FDEBD0', color: '#A04000' }, failed: { background: '#FADBD8', color: '#922B21' } }[status] || {};
}
function statusLabel(status, lang) {
  const m = { pending: ['Pending','लंबित'], approved: ['Approved','स्वीकृत'], rejected: ['Rejected','अस्वीकृत'], processing: ['Processing','प्रक्रिया में'], in_progress: ['In Progress','जारी है'], resolved: ['Resolved','हल हुआ'], paid: ['Paid','भुगतान हुआ'], unpaid: ['Unpaid','बकाया'], delivered: ['Delivered','डिलीवर हुआ'], in_transit: ['In Transit','रास्ते में'], failed: ['Failed','विफल'] };
  return (m[status] || [status,status])[lang==='hi'?1:0];
}

// ── LAYOUT ──────────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, lang, setLang }) {
  const navigate = useNavigate();
  const items = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard', labelHi: 'डैशबोर्ड' },
    { id: 'connections', icon: '🔗', label: 'Connections', labelHi: 'कनेक्शन' },
    { id: 'complaints', icon: '📋', label: 'Complaints', labelHi: 'शिकायतें' },
    { id: 'payments', icon: '💰', label: 'Payments', labelHi: 'भुगतान' },
    { id: 'deliveries', icon: '🚛', label: 'Deliveries', labelHi: 'डिलीवरी' },
  ];
  return (
    <div style={{ width: 260, background: C.grad, position: 'fixed', top: 0, left: 0, height: '100vh', display: 'flex', flexDirection: 'column', zIndex: 100, boxShadow: '4px 0 15px rgba(0,0,0,0.15)' }}>
      <div style={{ padding: '25px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>🔥 SUVIDHA</div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>Gas Admin Panel</div>
        <div style={{ marginTop: 12, background: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: 'white' }}>G</div>
          <div><div style={{ fontSize: 13, fontWeight: 600, color: 'white' }}>Admin</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>Gas Department</div></div>
        </div>
      </div>
      <nav style={{ flex: 1, padding: '20px 12px', overflowY: 'auto' }}>
        {items.map(item => (
          <div key={item.id} onClick={() => setPage(item.id)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 15px', borderRadius: 12, marginBottom: 6, cursor: 'pointer', background: page===item.id?'rgba(255,255,255,0.15)':'transparent', borderLeft: page===item.id?'3px solid #F0B27A':'3px solid transparent', transition: 'all 0.3s' }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            <div><div style={{ fontSize: 14, fontWeight: page===item.id?700:500, color: page===item.id?'white':'rgba(255,255,255,0.7)' }}>{item.label}</div><div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{item.labelHi}</div></div>
          </div>
        ))}
      </nav>
      <div style={{ padding: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.1)', borderRadius: 10, padding: 4, marginBottom: 12 }}>
          {['en','hi'].map(l=><button key={l} onClick={()=>setLang(l)} style={{ flex:1, padding:8, border:'none', borderRadius:8, cursor:'pointer', background:lang===l?'white':'transparent', color:lang===l?C.primary:'rgba(255,255,255,0.7)', fontWeight:600, fontSize:13 }}>{l==='en'?'EN':'हि'}</button>)}
        </div>
        <button onClick={()=>{ localStorage.removeItem('admin_token'); localStorage.removeItem('admin_user'); navigate('/adminlogin'); }} style={{ width:'100%', padding:12, background:'rgba(231,76,60,0.2)', border:'1px solid rgba(231,76,60,0.4)', borderRadius:10, color:'#F1948A', fontSize:14, fontWeight:600, cursor:'pointer' }}>
          🚪 {lang==='hi'?'लॉग आउट':'Logout'}
        </button>
      </div>
    </div>
  );
}

function Header({ lang, title, titleHi }) {
  const now = new Date();
  return (
    <div style={{ background:'white', padding:'18px 30px', display:'flex', alignItems:'center', justifyContent:'space-between', boxShadow:'0 2px 10px rgba(0,0,0,0.06)', position:'sticky', top:0, zIndex:99 }}>
      <div>
        <h1 style={{ fontSize:20, fontWeight:700, color:C.primary }}>{lang==='hi'?titleHi:title}</h1>
        <p style={{ fontSize:12, color:'#888', marginTop:2 }}>{lang==='hi'?'गैस विभाग — प्रशासन पैनल':'Gas Department — Admin Panel'}</p>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:20 }}>
        <div style={{ textAlign:'right' }}>
          <div style={{ fontSize:16, fontWeight:700, color:C.primary }}>{now.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit'})}</div>
          <div style={{ fontSize:11, color:'#888' }}>{now.toLocaleDateString('en-IN',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</div>
        </div>
        <div style={{ position:'relative', cursor:'pointer' }}>
          <div style={{ width:40, height:40, background:'#FDEBD0', borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>🔔</div>
          <div style={{ position:'absolute', top:-4, right:-4, width:16, height:16, background:'#E74C3C', borderRadius:'50%', fontSize:10, color:'white', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700 }}>3</div>
        </div>
        <div style={{ background:`linear-gradient(135deg,${C.primary},${C.accent})`, color:'white', padding:'8px 16px', borderRadius:10, fontSize:13, fontWeight:600 }}>🔥 {lang==='hi'?'गैस विभाग':'Gas Dept.'}</div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, labelHi, value, color, lang }) {
  return (
    <div style={{ background:'white', borderRadius:16, padding:22, boxShadow:'0 4px 15px rgba(0,0,0,0.06)', borderLeft:`4px solid ${color}`, transition:'transform 0.3s', cursor:'default' }} onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'} onMouseLeave={e=>e.currentTarget.style.transform='translateY(0)'}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div><div style={{ fontSize:13, color:'#888', marginBottom:8 }}>{lang==='hi'?labelHi:label}</div><div style={{ fontSize:28, fontWeight:800, color:C.primary }}>{value}</div></div>
        <div style={{ width:52, height:52, borderRadius:14, background:`${color}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:24 }}>{icon}</div>
      </div>
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:20 }}>
      <div onClick={e=>e.stopPropagation()} style={{ background:'white', borderRadius:20, padding:30, width:'100%', maxWidth:600, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 25px 60px rgba(0,0,0,0.3)' }}>{children}</div>
    </div>
  );
}
function CloseBtn({ onClick, lang }) {
  return <button onClick={onClick} style={{ width:'100%', marginTop:12, padding:10, background:'#F0F4F8', border:'none', borderRadius:10, cursor:'pointer', fontSize:14, fontWeight:600, color:'#666' }}>{lang==='hi'?'बंद करें':'Close'}</button>;
}

// ── PAGES ────────────────────────────────────────────────────────────────────────
function Dashboard({ lang, setPage }) {
  return (
    <div style={{ padding:30 }}>
      <div style={{ background:`linear-gradient(135deg,${C.primary},${C.accent})`, borderRadius:16, padding:'25px 30px', marginBottom:25, color:'white', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div><h2 style={{ fontSize:22, fontWeight:700, marginBottom:6 }}>{lang==='hi'?'🙏 नमस्ते, एडमिन!':'👋 Welcome, Admin!'}</h2><p style={{ opacity:0.8, fontSize:14 }}>{lang==='hi'?'गैस विभाग — आज का अवलोकन':'Gas Department — Today Overview'}</p></div>
        <div style={{ fontSize:60 }}>🔥</div>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:20, marginBottom:25 }}>
        <StatCard icon="🔗" label="Total Connections" labelHi="कुल कनेक्शन" value="896" color="#E67E22" lang={lang} />
        <StatCard icon="📋" label="Open Complaints" labelHi="खुली शिकायतें" value="28" color="#E74C3C" lang={lang} />
        <StatCard icon="🚛" label="Deliveries Today" labelHi="आज डिलीवरी" value="45" color="#F39C12" lang={lang} />
        <StatCard icon="💰" label="Revenue (Feb)" labelHi="राजस्व (फरवरी)" value="Rs.2.8L" color="#27AE60" lang={lang} />
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:25, marginBottom:25 }}>
        <div style={{ background:'white', borderRadius:16, padding:24, boxShadow:'0 4px 15px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize:16, fontWeight:700, color:C.primary, marginBottom:20 }}>📊 {lang==='hi'?'मासिक अवलोकन':'Monthly Overview'}</h3>
          <ResponsiveContainer width="100%" height={250}><BarChart data={monthlyData}><CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Bar dataKey="connections" fill="#E67E22" radius={[4,4,0,0]} name="Connections" /><Bar dataKey="complaints" fill="#E74C3C" radius={[4,4,0,0]} name="Complaints" /></BarChart></ResponsiveContainer>
        </div>
        <div style={{ background:'white', borderRadius:16, padding:24, boxShadow:'0 4px 15px rgba(0,0,0,0.06)' }}>
          <h3 style={{ fontSize:16, fontWeight:700, color:C.primary, marginBottom:20 }}>🔗 {lang==='hi'?'कनेक्शन प्रकार':'Connection Types'}</h3>
          <ResponsiveContainer width="100%" height={180}><PieChart><Pie data={connectionTypes} cx="50%" cy="50%" outerRadius={70} dataKey="value">{connectionTypes.map((e,i)=><Cell key={i} fill={e.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:10 }}>{connectionTypes.map((item,i)=><div key={i} style={{ display:'flex', alignItems:'center', gap:5, fontSize:12 }}><div style={{ width:10, height:10, borderRadius:'50%', background:item.color }} /><span style={{ color:'#666' }}>{item.name} ({item.value}%)</span></div>)}</div>
        </div>
      </div>
      <div style={{ background:'white', borderRadius:16, padding:24, marginBottom:25, boxShadow:'0 4px 15px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontSize:16, fontWeight:700, color:C.primary, marginBottom:20 }}>💰 {lang==='hi'?'राजस्व रुझान':'Revenue Trend'}</h3>
        <ResponsiveContainer width="100%" height={200}><LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip /><Line type="monotone" dataKey="revenue" stroke="#27AE60" strokeWidth={3} dot={{ fill:'#27AE60', r:5 }} /></LineChart></ResponsiveContainer>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:25 }}>
        <div style={{ background:'white', borderRadius:16, padding:24, boxShadow:'0 4px 15px rgba(0,0,0,0.06)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
            <h3 style={{ fontSize:16, fontWeight:700, color:C.primary }}>🔗 {lang==='hi'?'हाल के आवेदन':'Recent Connections'}</h3>
            <button onClick={()=>setPage('connections')} style={{ background:'#FDEBD0', color:C.accent, border:'none', padding:'6px 14px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}>{lang==='hi'?'सभी देखें':'View All'}</button>
          </div>
          {CONNECTIONS_DATA.slice(0,5).map(c=><div key={c.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #F0F4F8' }}><div><div style={{ fontSize:14, fontWeight:600 }}>{c.name}</div><div style={{ fontSize:12, color:'#888' }}>{c.id} • {c.connectionType}</div></div><span style={{ padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:600, ...badge(c.status) }}>{statusLabel(c.status,lang)}</span></div>)}
        </div>
        <div style={{ background:'white', borderRadius:16, padding:24, boxShadow:'0 4px 15px rgba(0,0,0,0.06)' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:18 }}>
            <h3 style={{ fontSize:16, fontWeight:700, color:C.primary }}>📋 {lang==='hi'?'हाल की शिकायतें':'Recent Complaints'}</h3>
            <button onClick={()=>setPage('complaints')} style={{ background:'#FDEBD0', color:C.accent, border:'none', padding:'6px 14px', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer' }}>{lang==='hi'?'सभी देखें':'View All'}</button>
          </div>
          {COMPLAINTS_DATA.slice(0,3).map(c=><div key={c.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #F0F4F8' }}><div><div style={{ fontSize:14, fontWeight:600 }}>{c.name}</div><div style={{ fontSize:12, color:'#888' }}>{c.id} • {complaintTypes[c.type]?.en}</div></div><span style={{ padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:600, ...badge(c.status) }}>{statusLabel(c.status,lang)}</span></div>)}
        </div>
      </div>
    </div>
  );
}

function Connections({ lang }) {
  const [data, setData] = useState(CONNECTIONS_DATA);
  const [search, setSearch] = useState(''); const [filterStatus, setFilterStatus] = useState('all'); const [selected, setSelected] = useState(null);
  const filtered = data.filter(c=>(c.name.toLowerCase().includes(search.toLowerCase())||c.id.toLowerCase().includes(search.toLowerCase())||c.mobile.includes(search))&&(filterStatus==='all'||c.status===filterStatus));
  const update = (id,s)=>{setData(p=>p.map(c=>c.id===id?{...c,status:s}:c));setSelected(p=>p?{...p,status:s}:null);};
  return (
    <div style={{ padding:30 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:15, marginBottom:25 }}>
        {[{l:'Total',lh:'कुल',v:data.length,c:'#E67E22'},{l:'Pending',lh:'लंबित',v:data.filter(c=>c.status==='pending').length,c:'#F39C12'},{l:'Approved',lh:'स्वीकृत',v:data.filter(c=>c.status==='approved').length,c:'#27AE60'},{l:'Rejected',lh:'अस्वीकृत',v:data.filter(c=>c.status==='rejected').length,c:'#E74C3C'}].map((s,i)=><div key={i} style={{background:'white',borderRadius:12,padding:18,borderLeft:`4px solid ${s.c}`,boxShadow:'0 4px 15px rgba(0,0,0,0.06)'}}><div style={{fontSize:12,color:'#888'}}>{lang==='hi'?s.lh:s.l}</div><div style={{fontSize:26,fontWeight:800,color:s.c}}>{s.v}</div></div>)}
      </div>
      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        <input placeholder={lang==='hi'?'🔍 नाम, ID से खोजें':'🔍 Search by name, ID'} value={search} onChange={e=>setSearch(e.target.value)} style={{ flex:1, padding:'10px 15px', border:'2px solid #E8EDF2', borderRadius:10, fontSize:14, outline:'none' }} />
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ padding:'10px 15px', border:'2px solid #E8EDF2', borderRadius:10, fontSize:14, outline:'none', cursor:'pointer' }}>
          <option value="all">All Status</option><option value="pending">Pending</option><option value="processing">Processing</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
        </select>
      </div>
      <div style={{ background:'white', borderRadius:16, padding:24, boxShadow:'0 4px 15px rgba(0,0,0,0.06)', overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr style={{ borderBottom:'2px solid #F0F4F8' }}>{['App ID','Applicant','Mobile','Type','Load','Documents','Date','Status','Action'].map(h=><th key={h} style={{textAlign:'left',padding:'12px 10px',fontSize:12,fontWeight:700,color:'#888',textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map(app=>{const dc=Object.values(app.documents).filter(Boolean).length,dt=Object.values(app.documents).length;return(<tr key={app.id} style={{borderBottom:'1px solid #F0F4F8'}}><td style={{padding:'14px 10px',fontWeight:600,color:C.accent}}>{app.id}</td><td style={{padding:'14px 10px'}}><div style={{fontWeight:600}}>{app.name}</div><div style={{fontSize:12,color:'#888'}}>{app.fatherName}</div></td><td style={{padding:'14px 10px'}}>{app.mobile}</td><td style={{padding:'14px 10px',fontSize:13}}>{app.connectionType}</td><td style={{padding:'14px 10px',fontSize:13}}>{app.loadRequired}</td><td style={{padding:'14px 10px'}}><span style={{background:dc===dt?'#D5F5E3':'#FEF9E7',color:dc===dt?'#1E8449':'#784212',padding:'4px 10px',borderRadius:20,fontSize:12,fontWeight:600}}>{dc}/{dt} ✓</span></td><td style={{padding:'14px 10px',fontSize:13,color:'#888'}}>{app.date}</td><td style={{padding:'14px 10px'}}><span style={{padding:'5px 12px',borderRadius:20,fontSize:12,fontWeight:600,...badge(app.status)}}>{statusLabel(app.status,lang)}</span></td><td style={{padding:'14px 10px'}}><button onClick={()=>setSelected(app)} style={{background:'#FDEBD0',color:C.accent,border:'none',padding:'7px 14px',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer'}}>{lang==='hi'?'देखें':'View'}</button></td></tr>);})}</tbody>
        </table>
      </div>
      {selected&&<Modal onClose={()=>setSelected(null)}>
        <div style={{fontSize:18,fontWeight:800,color:C.primary,marginBottom:20}}>🔗 {selected.id} — {selected.name}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>{[["Applicant","आवेदक",selected.name],["Father's","पिता",selected.fatherName],["Mobile","मोबाइल",selected.mobile],["Type","प्रकार",selected.connectionType],["Load","लोड",selected.loadRequired],["Purpose","उद्देश्य",selected.purpose],["Date","तारीख",selected.date],["Status","स्थिति",statusLabel(selected.status,lang)]].map(([l,lh,v],i)=><div key={i} style={{background:'#F8FAFC',borderRadius:10,padding:12}}><div style={{fontSize:11,color:'#888',marginBottom:4}}>{lang==='hi'?lh:l}</div><div style={{fontSize:14,fontWeight:600,color:'#333'}}>{v}</div></div>)}</div>
        <div style={{background:'#F8FAFC',borderRadius:10,padding:12,marginBottom:20}}><div style={{fontSize:11,color:'#888',marginBottom:4}}>Address</div><div style={{fontSize:14,fontWeight:600}}>{selected.address}</div></div>
        <div style={{marginBottom:20}}><div style={{fontSize:14,fontWeight:700,color:C.primary,marginBottom:12}}>📄 Documents</div><div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>{Object.entries(selected.documents).map(([k,v])=><div key={k} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 12px',borderRadius:10,background:v?'#D5F5E3':'#FADBD8',border:`1px solid ${v?'#27AE60':'#E74C3C'}`}}><span>{v?'✅':'❌'}</span><span style={{fontSize:12,fontWeight:600,color:v?'#1E8449':'#922B21'}}>{docLabels[k]}</span></div>)}</div></div>
        {(selected.status==='pending'||selected.status==='processing')?<div style={{display:'flex',gap:12}}><button onClick={()=>update(selected.id,'processing')} style={{flex:1,padding:12,background:'#FEF9E7',border:'1px solid #F39C12',borderRadius:10,color:'#784212',fontWeight:700,cursor:'pointer'}}>⚙️ Processing</button><button onClick={()=>update(selected.id,'approved')} style={{flex:1,padding:12,background:'#D5F5E3',border:'1px solid #27AE60',borderRadius:10,color:'#1E8449',fontWeight:700,cursor:'pointer'}}>✅ Approve</button><button onClick={()=>update(selected.id,'rejected')} style={{flex:1,padding:12,background:'#FADBD8',border:'1px solid #E74C3C',borderRadius:10,color:'#922B21',fontWeight:700,cursor:'pointer'}}>❌ Reject</button></div>:<div style={{textAlign:'center',padding:15,background:badge(selected.status).background,borderRadius:12,color:badge(selected.status).color,fontWeight:700}}>{statusLabel(selected.status,lang)}</div>}
        <CloseBtn onClick={()=>setSelected(null)} lang={lang} />
      </Modal>}
    </div>
  );
}

function Complaints({ lang }) {
  const [data, setData] = useState(COMPLAINTS_DATA);
  const [search, setSearch] = useState(''); const [filterStatus, setFilterStatus] = useState('all'); const [selected, setSelected] = useState(null); const [assignTo, setAssignTo] = useState('');
  const filtered = data.filter(c=>(c.name.toLowerCase().includes(search.toLowerCase())||c.id.toLowerCase().includes(search.toLowerCase())||c.customerId.toLowerCase().includes(search.toLowerCase())||c.mobile.includes(search))&&(filterStatus==='all'||c.status===filterStatus));
  const update = (id,s)=>{setData(p=>p.map(c=>c.id===id?{...c,status:s,assignedTo:assignTo||c.assignedTo}:c));setSelected(p=>p?{...p,status:s,assignedTo:assignTo||p.assignedTo}:null);};
  return (
    <div style={{ padding:30 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:15, marginBottom:25 }}>
        {[{l:'Total',v:data.length,c:'#E67E22'},{l:'Pending',v:data.filter(x=>x.status==='pending').length,c:'#F39C12'},{l:'In Progress',v:data.filter(x=>x.status==='in_progress').length,c:'#A04000'},{l:'Resolved',v:data.filter(x=>x.status==='resolved').length,c:'#27AE60'}].map((s,i)=><div key={i} style={{background:'white',borderRadius:12,padding:18,borderLeft:`4px solid ${s.c}`,boxShadow:'0 4px 15px rgba(0,0,0,0.06)'}}><div style={{fontSize:12,color:'#888'}}>{s.l}</div><div style={{fontSize:26,fontWeight:800,color:s.c}}>{s.v}</div></div>)}
      </div>
      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        <input placeholder={lang==='hi'?'🔍 खोजें':'🔍 Search by name, ID'} value={search} onChange={e=>setSearch(e.target.value)} style={{ flex:1, padding:'10px 15px', border:'2px solid #E8EDF2', borderRadius:10, fontSize:14, outline:'none' }} />
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ padding:'10px 15px', border:'2px solid #E8EDF2', borderRadius:10, fontSize:14, outline:'none', cursor:'pointer' }}>
          <option value="all">All</option><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="resolved">Resolved</option>
        </select>
      </div>
      <div style={{ background:'white', borderRadius:16, padding:24, boxShadow:'0 4px 15px rgba(0,0,0,0.06)', overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr style={{ borderBottom:'2px solid #F0F4F8' }}>{['ID','Customer ID','Name','Type','Priority','Assigned','Date','Status','Action'].map(h=><th key={h} style={{textAlign:'left',padding:'12px 10px',fontSize:12,fontWeight:700,color:'#888',textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map(c=><tr key={c.id} style={{borderBottom:'1px solid #F0F4F8'}}><td style={{padding:'14px 10px',fontWeight:600,color:C.accent}}>{c.id}</td><td style={{padding:'14px 10px',fontWeight:600}}>{c.customerId}</td><td style={{padding:'14px 10px'}}><div style={{fontWeight:600}}>{c.name}</div><div style={{fontSize:12,color:'#888'}}>{c.mobile}</div></td><td style={{padding:'14px 10px'}}><span style={{background:'#FDEBD0',color:'#A04000',padding:'4px 10px',borderRadius:20,fontSize:12,fontWeight:600}}>{complaintTypes[c.type]?.icon} {lang==='hi'?complaintTypes[c.type]?.hi:complaintTypes[c.type]?.en}</span></td><td style={{padding:'14px 10px'}}><span style={{padding:'4px 10px',borderRadius:20,fontSize:12,fontWeight:600,...priorityStyles[c.priority]}}>{lang==='hi'?priorityStyles[c.priority]?.labelHi:priorityStyles[c.priority]?.label}</span></td><td style={{padding:'14px 10px',fontSize:13,color:c.assignedTo?'#333':'#bbb'}}>{c.assignedTo||'Not Assigned'}</td><td style={{padding:'14px 10px',fontSize:13,color:'#888'}}>{c.date}</td><td style={{padding:'14px 10px'}}><span style={{padding:'5px 12px',borderRadius:20,fontSize:12,fontWeight:600,...badge(c.status)}}>{statusLabel(c.status,lang)}</span></td><td style={{padding:'14px 10px'}}><button onClick={()=>{setSelected(c);setAssignTo(c.assignedTo);}} style={{background:'#FDEBD0',color:C.accent,border:'none',padding:'7px 14px',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer'}}>View</button></td></tr>)}</tbody>
        </table>
      </div>
      {selected&&<Modal onClose={()=>setSelected(null)}>
        <div style={{fontSize:18,fontWeight:800,color:C.primary,marginBottom:20}}>📋 {selected.id}</div>
        <div style={{background:'#FADBD8',border:'2px solid #E74C3C',borderRadius:12,padding:'12px 16px',marginBottom:20,display:'flex',alignItems:'center',gap:12}}><span style={{fontSize:24}}>🚨</span><div><div style={{fontWeight:700,color:'#922B21'}}>Priority: {priorityStyles[selected.priority]?.label}</div><div style={{fontSize:13,color:'#922B21'}}>{selected.address}</div></div></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>{[['Name','नाम',selected.name],['Customer ID','ID',selected.customerId],['Mobile','मोबाइल',selected.mobile],['Date','तारीख',selected.date]].map(([l,lh,v],i)=><div key={i} style={{background:'#F8FAFC',borderRadius:10,padding:12}}><div style={{fontSize:11,color:'#888',marginBottom:4}}>{lang==='hi'?lh:l}</div><div style={{fontSize:14,fontWeight:600}}>{v}</div></div>)}</div>
        <div style={{background:'#FDEBD0',borderRadius:10,padding:12,marginBottom:15}}><div style={{fontSize:11,color:'#888',marginBottom:4}}>Type</div><div style={{fontSize:15,fontWeight:700,color:'#A04000'}}>{complaintTypes[selected.type]?.icon} {lang==='hi'?complaintTypes[selected.type]?.hi:complaintTypes[selected.type]?.en}</div></div>
        <div style={{background:'#F8FAFC',borderRadius:10,padding:12,marginBottom:20}}><div style={{fontSize:11,color:'#888',marginBottom:4}}>Description</div><div style={{fontSize:14,lineHeight:1.6}}>{selected.description}</div></div>
        <div style={{marginBottom:20}}><label style={{fontSize:13,fontWeight:600,color:'#444',display:'block',marginBottom:8}}>👷 Assign Technician</label><input type="text" value={assignTo} onChange={e=>setAssignTo(e.target.value)} placeholder="Technician name" style={{width:'100%',padding:'10px 14px',border:'2px solid #E8EDF2',borderRadius:10,fontSize:14,outline:'none',boxSizing:'border-box'}} /></div>
        {selected.status!=='resolved'?<div style={{display:'flex',gap:12}}><button onClick={()=>update(selected.id,'in_progress')} style={{flex:1,padding:12,background:'#FDEBD0',border:'1px solid #F39C12',borderRadius:10,color:'#784212',fontWeight:700,cursor:'pointer'}}>⚙️ In Progress</button><button onClick={()=>update(selected.id,'resolved')} style={{flex:1,padding:12,background:'#D5F5E3',border:'1px solid #27AE60',borderRadius:10,color:'#1E8449',fontWeight:700,cursor:'pointer'}}>✅ Resolved</button></div>:<div style={{textAlign:'center',padding:15,background:'#D5F5E3',borderRadius:12,color:'#1E8449',fontWeight:700}}>✅ Resolved</div>}
        <CloseBtn onClick={()=>setSelected(null)} lang={lang} />
      </Modal>}
    </div>
  );
}

function Payments({ lang }) {
  const [payments] = useState(PAYMENTS_DATA);
  const [search, setSearch] = useState(''); const [filterStatus, setFilterStatus] = useState('all'); const [selected, setSelected] = useState(null);
  const filtered = payments.filter(p=>(p.name.toLowerCase().includes(search.toLowerCase())||p.customerId.toLowerCase().includes(search.toLowerCase())||p.id.toLowerCase().includes(search.toLowerCase())||p.mobile.includes(search))&&(filterStatus==='all'||p.status===filterStatus));
  const totalRevenue = payments.filter(p=>p.status==='paid').reduce((s,p)=>s+p.amount,0);
  const totalPending = payments.filter(p=>p.status==='unpaid').reduce((s,p)=>s+p.amount,0);
  return (
    <div style={{ padding:30 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:15, marginBottom:25 }}>
        {[{l:'Total',v:payments.length,c:'#E67E22'},{l:'Paid',v:payments.filter(p=>p.status==='paid').length,c:'#27AE60'},{l:'Unpaid',v:payments.filter(p=>p.status==='unpaid').length,c:'#E74C3C'},{l:'Revenue',v:`Rs.${(totalRevenue/1000).toFixed(1)}K`,c:'#F39C12'}].map((s,i)=><div key={i} style={{background:'white',borderRadius:12,padding:18,borderLeft:`4px solid ${s.c}`,boxShadow:'0 4px 15px rgba(0,0,0,0.06)'}}><div style={{fontSize:12,color:'#888'}}>{s.l}</div><div style={{fontSize:26,fontWeight:800,color:s.c}}>{s.v}</div></div>)}
      </div>
      <div style={{ background:'white', borderRadius:16, padding:24, marginBottom:25, boxShadow:'0 4px 15px rgba(0,0,0,0.06)' }}>
        <h3 style={{ fontSize:16, fontWeight:700, color:C.primary, marginBottom:20 }}>💰 Monthly Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={200}><LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" /><XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} tickFormatter={v=>`Rs.${v/1000}K`} /><Tooltip formatter={v=>[`Rs.${v.toLocaleString()}`,'Revenue']} /><Line type="monotone" dataKey="revenue" stroke="#27AE60" strokeWidth={3} dot={{fill:'#27AE60',r:5}} /></LineChart></ResponsiveContainer>
      </div>
      {totalPending>0&&<div style={{background:'#FEF9E7',border:'1px solid #F39C12',borderRadius:12,padding:'15px 20px',marginBottom:20,display:'flex',alignItems:'center',gap:12}}><span style={{fontSize:24}}>⚠️</span><div><div style={{fontWeight:700,color:'#784212'}}>Pending Amount</div><div style={{fontSize:13,color:'#784212'}}>{payments.filter(p=>p.status==='unpaid').length} customers have Rs.{totalPending.toLocaleString()} pending</div></div></div>}
      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        <input placeholder="🔍 Search by name, ID" value={search} onChange={e=>setSearch(e.target.value)} style={{ flex:1, padding:'10px 15px', border:'2px solid #E8EDF2', borderRadius:10, fontSize:14, outline:'none' }} />
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ padding:'10px 15px', border:'2px solid #E8EDF2', borderRadius:10, fontSize:14, outline:'none', cursor:'pointer' }}>
          <option value="all">All</option><option value="paid">Paid</option><option value="unpaid">Unpaid</option>
        </select>
      </div>
      <div style={{ background:'white', borderRadius:16, padding:24, boxShadow:'0 4px 15px rgba(0,0,0,0.06)', overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr style={{ borderBottom:'2px solid #F0F4F8' }}>{['ID','Customer ID','Name','Month','Units','Amount','Paid On','Status','Action'].map(h=><th key={h} style={{textAlign:'left',padding:'12px 10px',fontSize:12,fontWeight:700,color:'#888',textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map(p=><tr key={p.id} style={{borderBottom:'1px solid #F0F4F8'}}><td style={{padding:'14px 10px',fontWeight:600,color:C.accent}}>{p.id}</td><td style={{padding:'14px 10px',fontWeight:600}}>{p.customerId}</td><td style={{padding:'14px 10px'}}><div style={{fontWeight:600}}>{p.name}</div><div style={{fontSize:12,color:'#888'}}>{p.mobile}</div></td><td style={{padding:'14px 10px',fontSize:13}}>{p.billMonth}</td><td style={{padding:'14px 10px',fontSize:13}}>{p.units}</td><td style={{padding:'14px 10px',fontWeight:700,color:C.primary}}>Rs.{p.amount.toLocaleString()}</td><td style={{padding:'14px 10px',fontSize:13,color:'#888'}}>{p.paidOn}</td><td style={{padding:'14px 10px'}}><span style={{padding:'5px 12px',borderRadius:20,fontSize:12,fontWeight:600,...badge(p.status)}}>{p.status==='paid'?'✅ Paid':'❌ Unpaid'}</span></td><td style={{padding:'14px 10px'}}><button onClick={()=>setSelected(p)} style={{background:'#FDEBD0',color:C.accent,border:'none',padding:'7px 14px',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer'}}>Receipt</button></td></tr>)}</tbody>
        </table>
      </div>
      {selected&&<Modal onClose={()=>setSelected(null)}>
        <div style={{textAlign:'center',marginBottom:20}}><div style={{fontSize:48}}>{selected.status==='paid'?'✅':'⏳'}</div><h2 style={{fontSize:20,fontWeight:800,color:C.primary}}>Payment Receipt</h2></div>
        <div style={{background:'#F8FAFC',borderRadius:14,padding:20,marginBottom:20}}>{[['Payment ID',selected.id],['Customer ID',selected.customerId],['Customer',selected.name],['Bill Month',selected.billMonth],['Units',selected.units],['Amount',`Rs.${selected.amount.toLocaleString()}`],['Paid On',selected.paidOn],['Transaction ID',selected.transactionId]].map(([l,v],i)=><div key={i} style={{display:'flex',justifyContent:'space-between',padding:'10px 0',borderBottom:i<7?'1px solid #E8EDF2':'none'}}><span style={{fontSize:13,color:'#888'}}>{l}</span><span style={{fontSize:13,fontWeight:600,color:'#333'}}>{v}</span></div>)}</div>
        <div style={{textAlign:'center',padding:12,background:badge(selected.status).background,borderRadius:10,marginBottom:15,fontWeight:700,fontSize:15,color:badge(selected.status).color}}>{selected.status==='paid'?'✅ Payment Successful':'❌ Payment Pending'}</div>
        <CloseBtn onClick={()=>setSelected(null)} lang={lang} />
      </Modal>}
    </div>
  );
}

function Deliveries({ lang }) {
  const [data, setData] = useState(DELIVERIES_DATA);
  const [search, setSearch] = useState(''); const [filterStatus, setFilterStatus] = useState('all'); const [filterType, setFilterType] = useState('all'); const [selected, setSelected] = useState(null); const [assignBoy, setAssignBoy] = useState('');
  const filtered = data.filter(d=>(d.name.toLowerCase().includes(search.toLowerCase())||d.id.toLowerCase().includes(search.toLowerCase())||d.customerId.toLowerCase().includes(search.toLowerCase())||d.mobile.includes(search))&&(filterStatus==='all'||d.status===filterStatus)&&(filterType==='all'||d.deliveryType===filterType));
  const update = (id,s)=>{setData(p=>p.map(d=>d.id===id?{...d,status:s,deliveryBoy:assignBoy||d.deliveryBoy,deliveredDate:s==='delivered'?new Date().toLocaleDateString('en-IN'):d.deliveredDate}:d));setSelected(p=>p?{...p,status:s,deliveryBoy:assignBoy||p.deliveryBoy}:null);};
  return (
    <div style={{ padding:30 }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:15, marginBottom:25 }}>
        {[{l:'Total Today',v:data.length,c:'#E67E22'},{l:'Pending',v:data.filter(d=>d.status==='pending').length,c:'#F39C12'},{l:'In Transit',v:data.filter(d=>d.status==='in_transit').length,c:'#A04000'},{l:'Delivered',v:data.filter(d=>d.status==='delivered').length,c:'#27AE60'}].map((s,i)=><div key={i} style={{background:'white',borderRadius:12,padding:18,borderLeft:`4px solid ${s.c}`,boxShadow:'0 4px 15px rgba(0,0,0,0.06)'}}><div style={{fontSize:12,color:'#888'}}>{s.l}</div><div style={{fontSize:26,fontWeight:800,color:s.c}}>{s.v}</div></div>)}
      </div>
      <div style={{ display:'flex', gap:12, marginBottom:20 }}>
        <input placeholder="🔍 Search by name, ID" value={search} onChange={e=>setSearch(e.target.value)} style={{ flex:1, padding:'10px 15px', border:'2px solid #E8EDF2', borderRadius:10, fontSize:14, outline:'none' }} />
        <select value={filterStatus} onChange={e=>setFilterStatus(e.target.value)} style={{ padding:'10px 15px', border:'2px solid #E8EDF2', borderRadius:10, fontSize:14, outline:'none', cursor:'pointer' }}>
          <option value="all">All Status</option><option value="pending">Pending</option><option value="in_transit">In Transit</option><option value="delivered">Delivered</option><option value="failed">Failed</option>
        </select>
        <select value={filterType} onChange={e=>setFilterType(e.target.value)} style={{ padding:'10px 15px', border:'2px solid #E8EDF2', borderRadius:10, fontSize:14, outline:'none', cursor:'pointer' }}>
          <option value="all">All Types</option><option value="PNG Supply">PNG Supply</option><option value="LPG Cylinder">LPG Cylinder</option>
        </select>
      </div>
      <div style={{ background:'white', borderRadius:16, padding:24, boxShadow:'0 4px 15px rgba(0,0,0,0.06)', overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead><tr style={{ borderBottom:'2px solid #F0F4F8' }}>{['Delivery ID','Customer','Type','Quantity','Scheduled','Delivery Boy','Status','Action'].map(h=><th key={h} style={{textAlign:'left',padding:'12px 10px',fontSize:12,fontWeight:700,color:'#888',textTransform:'uppercase'}}>{h}</th>)}</tr></thead>
          <tbody>{filtered.map(d=><tr key={d.id} style={{borderBottom:'1px solid #F0F4F8'}}><td style={{padding:'14px 10px',fontWeight:600,color:C.accent}}>{d.id}</td><td style={{padding:'14px 10px'}}><div style={{fontWeight:600}}>{d.name}</div><div style={{fontSize:12,color:'#888'}}>{d.customerId} • {d.mobile}</div></td><td style={{padding:'14px 10px'}}><span style={{background:d.deliveryType==='LPG Cylinder'?'#FDEBD0':'#EBF5FB',color:d.deliveryType==='LPG Cylinder'?'#A04000':'#1A5276',padding:'4px 10px',borderRadius:20,fontSize:12,fontWeight:600}}>{d.deliveryType==='LPG Cylinder'?'🔴':'🔵'} {d.deliveryType}</span></td><td style={{padding:'14px 10px',fontSize:13}}>{d.quantity}</td><td style={{padding:'14px 10px',fontSize:13,color:'#888'}}>{d.scheduledDate}</td><td style={{padding:'14px 10px',fontSize:13,color:d.deliveryBoy?'#333':'#bbb'}}>{d.deliveryBoy||'Not Assigned'}</td><td style={{padding:'14px 10px'}}><span style={{padding:'5px 12px',borderRadius:20,fontSize:12,fontWeight:600,...badge(d.status)}}>{statusLabel(d.status,lang)}</span></td><td style={{padding:'14px 10px'}}><button onClick={()=>{setSelected(d);setAssignBoy(d.deliveryBoy);}} style={{background:'#FDEBD0',color:C.accent,border:'none',padding:'7px 14px',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer'}}>View</button></td></tr>)}</tbody>
        </table>
      </div>
      {selected&&<Modal onClose={()=>setSelected(null)}>
        <div style={{fontSize:18,fontWeight:800,color:C.primary,marginBottom:20}}>🚛 {selected.id}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}}>{[['Customer',selected.name],['Customer ID',selected.customerId],['Mobile',selected.mobile],['Type',selected.deliveryType],['Quantity',selected.quantity],['Scheduled',selected.scheduledDate],['Delivered',selected.deliveredDate]].map(([l,v],i)=><div key={i} style={{background:'#F8FAFC',borderRadius:10,padding:12}}><div style={{fontSize:11,color:'#888',marginBottom:4}}>{l}</div><div style={{fontSize:14,fontWeight:600,color:'#333'}}>{v}</div></div>)}</div>
        <div style={{background:'#F8FAFC',borderRadius:10,padding:12,marginBottom:20}}><div style={{fontSize:11,color:'#888',marginBottom:4}}>📍 Delivery Address</div><div style={{fontSize:14,fontWeight:600}}>{selected.address}</div></div>
        <div style={{marginBottom:20}}><label style={{fontSize:13,fontWeight:600,color:'#444',display:'block',marginBottom:8}}>🚛 Assign Delivery Boy</label><input type="text" value={assignBoy} onChange={e=>setAssignBoy(e.target.value)} placeholder="Delivery boy name" style={{width:'100%',padding:'10px 14px',border:'2px solid #E8EDF2',borderRadius:10,fontSize:14,outline:'none',boxSizing:'border-box'}} /></div>
        {selected.status!=='delivered'?<div style={{display:'flex',gap:12}}><button onClick={()=>update(selected.id,'in_transit')} style={{flex:1,padding:12,background:'#FDEBD0',border:'1px solid #F39C12',borderRadius:10,color:'#784212',fontWeight:700,cursor:'pointer'}}>🚛 In Transit</button><button onClick={()=>update(selected.id,'delivered')} style={{flex:1,padding:12,background:'#D5F5E3',border:'1px solid #27AE60',borderRadius:10,color:'#1E8449',fontWeight:700,cursor:'pointer'}}>✅ Delivered</button><button onClick={()=>update(selected.id,'failed')} style={{flex:1,padding:12,background:'#FADBD8',border:'1px solid #E74C3C',borderRadius:10,color:'#922B21',fontWeight:700,cursor:'pointer'}}>❌ Failed</button></div>:<div style={{textAlign:'center',padding:15,background:'#D5F5E3',borderRadius:12,color:'#1E8449',fontWeight:700}}>✅ Delivery Completed</div>}
        <CloseBtn onClick={()=>setSelected(null)} lang={lang} />
      </Modal>}
    </div>
  );
}

// ── MAIN ─────────────────────────────────────────────────────────────────────────
export default function GasAdmin() {
  const [page, setPage] = useState('dashboard');
  const [lang, setLang] = useState('en');
  const titles = { dashboard:['Dashboard','डैशबोर्ड'], connections:['Connections','कनेक्शन'], complaints:['Complaints','शिकायतें'], payments:['Payments','भुगतान'], deliveries:['Deliveries','डिलीवरी'] };
  const [t, th] = titles[page]||['Dashboard','डैशबोर्ड'];
  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#F0F4F8', fontFamily:'Segoe UI, sans-serif' }}>
      <Sidebar page={page} setPage={setPage} lang={lang} setLang={setLang} />
      <div style={{ marginLeft:260, flex:1, display:'flex', flexDirection:'column' }}>
        <Header lang={lang} title={t} titleHi={th} />
        {page==='dashboard' && <Dashboard lang={lang} setPage={setPage} />}
        {page==='connections' && <Connections lang={lang} />}
        {page==='complaints' && <Complaints lang={lang} />}
        {page==='payments' && <Payments lang={lang} />}
        {page==='deliveries' && <Deliveries lang={lang} />}
      </div>
    </div>
  );
}