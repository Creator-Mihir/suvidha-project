import { useState } from "react";
import { useNavigate } from 'react-router-dom';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell
} from "recharts";

// ─── DATA ────────────────────────────────────────────────────────────────────

const monthlyData = [
  { month: "Aug", connections: 45, complaints: 30, payments: 120 },
  { month: "Sep", connections: 52, complaints: 25, payments: 135 },
  { month: "Oct", connections: 38, complaints: 40, payments: 110 },
  { month: "Nov", connections: 60, complaints: 20, payments: 150 },
  { month: "Dec", connections: 55, complaints: 28, payments: 140 },
  { month: "Jan", connections: 70, complaints: 15, payments: 180 },
  { month: "Feb", connections: 65, complaints: 22, payments: 165 },
];

const connectionTypes = [
  { name: "Domestic", value: 65, color: "#2E86C1" },
  { name: "Commercial", value: 20, color: "#27AE60" },
  { name: "Industrial", value: 10, color: "#F39C12" },
  { name: "Agricultural", value: 5, color: "#E74C3C" },
];

const dummyConnections = [
  { id: "ELEC-001", name: "Rahul Sharma", fatherName: "Ram Sharma", mobile: "9999999999", address: "123 Main St, Indore", type: "Domestic", load: "5 kW", phase: "Single Phase", meter: "Smart Meter", date: "27 Feb 2026", status: "pending", documents: { idProof: true, addressProof: true, ownershipProof: false, wiringCertificate: true, passportPhoto: true, signature: true } },
  { id: "ELEC-002", name: "Priya Verma", fatherName: "Suresh Verma", mobile: "8888888888", address: "456 Gandhi Nagar, Bhopal", type: "Commercial", load: "15 kW", phase: "Three Phase", meter: "Postpaid", date: "26 Feb 2026", status: "approved", documents: { idProof: true, addressProof: true, ownershipProof: true, wiringCertificate: true, passportPhoto: true, signature: true } },
  { id: "ELEC-003", name: "Amit Kumar", fatherName: "Vijay Kumar", mobile: "7777777777", address: "789 Industrial Area, Jabalpur", type: "Industrial", load: "50 kW", phase: "Three Phase", meter: "Smart Meter", date: "25 Feb 2026", status: "processing", documents: { idProof: true, addressProof: true, ownershipProof: true, wiringCertificate: false, passportPhoto: true, signature: true } },
  { id: "ELEC-004", name: "Sunita Devi", fatherName: "Mohan Lal", mobile: "6666666666", address: "321 Village Rd, Ujjain", type: "Agricultural", load: "10 HP", phase: "Three Phase", meter: "Prepaid", date: "24 Feb 2026", status: "rejected", documents: { idProof: true, addressProof: false, ownershipProof: false, wiringCertificate: false, passportPhoto: true, signature: false } },
  { id: "ELEC-005", name: "Vikram Singh", fatherName: "Baldev Singh", mobile: "5555555555", address: "654 Civil Lines, Gwalior", type: "Domestic", load: "3 kW", phase: "Single Phase", meter: "Smart Meter", date: "23 Feb 2026", status: "pending", documents: { idProof: true, addressProof: true, ownershipProof: true, wiringCertificate: true, passportPhoto: true, signature: true } },
];

const dummyComplaints = [
  { id: "CMP-001", kNumber: "K12345", name: "Mohan Lal", mobile: "9999999999", address: "123 Main St, Indore", type: "no_power", description: "Subah se bijli nahi hai, poora mohalla affected hai", date: "27 Feb 2026", status: "pending", assignedTo: "" },
  { id: "CMP-002", kNumber: "K23456", name: "Geeta Bai", mobile: "8888888888", address: "456 Gandhi Nagar, Bhopal", type: "low_voltage", description: "Voltage bahut kam aa rahi hai, fan aur AC nahi chal rahe", date: "26 Feb 2026", status: "in_progress", assignedTo: "Lineman Ramesh" },
  { id: "CMP-003", kNumber: "K34567", name: "Ramesh Yadav", mobile: "7777777777", address: "789 Civil Lines, Jabalpur", type: "billing_issue", description: "Is mahine ka bill bahut zyada aa gaya hai", date: "25 Feb 2026", status: "resolved", assignedTo: "Billing Team" },
  { id: "CMP-004", kNumber: "K45678", name: "Sita Devi", mobile: "6666666666", address: "321 Village Rd, Ujjain", type: "meter_fault", description: "Meter display kaam nahi kar raha", date: "24 Feb 2026", status: "pending", assignedTo: "" },
  { id: "CMP-005", kNumber: "K56789", name: "Vijay Kumar", mobile: "5555555555", address: "654 Nehru Nagar, Gwalior", type: "other", description: "Bijli ka pole jhuka hua hai", date: "23 Feb 2026", status: "in_progress", assignedTo: "Lineman Suresh" },
];

const dummyPayments = [
  { id: "PAY-001", kNumber: "K12345", name: "Rahul Sharma", mobile: "9999999999", billMonth: "January 2026", units: 150, amount: 750, paidOn: "27 Feb 2026", transactionId: "TXN-1740000001", status: "paid", type: "Bill Payment" },
  { id: "PAY-002", kNumber: "K23456", name: "Priya Verma", mobile: "8888888888", billMonth: "January 2026", units: 320, amount: 1600, paidOn: "26 Feb 2026", transactionId: "TXN-1740000002", status: "paid", type: "Bill Payment" },
  { id: "PAY-003", kNumber: "K34567", name: "Amit Kumar", mobile: "7777777777", billMonth: "February 2026", units: 85, amount: 425, paidOn: "-", transactionId: "-", status: "unpaid", type: "Bill Payment" },
  { id: "PAY-004", kNumber: "K45678", name: "Sunita Devi", mobile: "6666666666", billMonth: "Connection Fee", units: "-", amount: 500, paidOn: "24 Feb 2026", transactionId: "TXN-1740000004", status: "paid", type: "Connection Fee" },
  { id: "PAY-005", kNumber: "K56789", name: "Vikram Singh", mobile: "5555555555", billMonth: "January 2026", units: 210, amount: 1050, paidOn: "23 Feb 2026", transactionId: "TXN-1740000005", status: "paid", type: "Bill Payment" },
  { id: "PAY-006", kNumber: "K67890", name: "Meena Kumari", mobile: "4444444444", billMonth: "February 2026", units: 175, amount: 875, paidOn: "-", transactionId: "-", status: "unpaid", type: "Bill Payment" },
];

const dummyCustomers = [
  { kNumber: "K12345", name: "Rahul Sharma", fatherName: "Ram Sharma", mobile: "9999999999", email: "rahul@email.com", address: "123 Main St, Indore", meterNumber: "MTR001", connectionType: "Domestic", phase: "Single Phase", connectionStatus: "active", joinDate: "15 Jan 2024", currentBill: 750, lastPaid: "27 Feb 2026" },
  { kNumber: "K23456", name: "Priya Verma", fatherName: "Suresh Verma", mobile: "8888888888", email: "priya@email.com", address: "456 Gandhi Nagar, Bhopal", meterNumber: "MTR002", connectionType: "Commercial", phase: "Three Phase", connectionStatus: "active", joinDate: "20 Mar 2024", currentBill: 1600, lastPaid: "26 Feb 2026" },
  { kNumber: "K34567", name: "Amit Kumar", fatherName: "Vijay Kumar", mobile: "7777777777", email: "amit@email.com", address: "789 Industrial Area, Jabalpur", meterNumber: "MTR003", connectionType: "Industrial", phase: "Three Phase", connectionStatus: "suspended", joinDate: "05 Apr 2024", currentBill: 425, lastPaid: "10 Jan 2026" },
  { kNumber: "K45678", name: "Sunita Devi", fatherName: "Mohan Lal", mobile: "6666666666", email: "", address: "321 Village Rd, Ujjain", meterNumber: "MTR004", connectionType: "Agricultural", phase: "Three Phase", connectionStatus: "active", joinDate: "12 May 2024", currentBill: 0, lastPaid: "24 Feb 2026" },
  { kNumber: "K56789", name: "Vikram Singh", fatherName: "Baldev Singh", mobile: "5555555555", email: "vikram@email.com", address: "654 Civil Lines, Gwalior", meterNumber: "MTR005", connectionType: "Domestic", phase: "Single Phase", connectionStatus: "inactive", joinDate: "08 Jun 2024", currentBill: 875, lastPaid: "23 Feb 2026" },
];

const trendData = [
  { month: "Aug", revenue: 285000 }, { month: "Sep", revenue: 312000 },
  { month: "Oct", revenue: 298000 }, { month: "Nov", revenue: 345000 },
  { month: "Dec", revenue: 378000 }, { month: "Jan", revenue: 392000 },
  { month: "Feb", revenue: 420000 },
];

const docLabels = { idProof: "ID Proof", addressProof: "Address Proof", ownershipProof: "Ownership Proof", wiringCertificate: "Wiring Certificate", passportPhoto: "Passport Photo", signature: "Signature" };
const complaintTypeLabels = { no_power: { en: "No Power", hi: "बिजली नहीं", icon: "⚡" }, low_voltage: { en: "Low Voltage", hi: "कम वोल्टेज", icon: "🔋" }, billing_issue: { en: "Billing Issue", hi: "बिलिंग समस्या", icon: "📄" }, meter_fault: { en: "Meter Fault", hi: "मीटर खराब", icon: "📟" }, other: { en: "Other", hi: "अन्य", icon: "🔧" } };

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getBadge(status) {
    const navigate = useNavigate();

  const map = {
    pending: { bg: "#FEF9E7", color: "#784212" },
    approved: { bg: "#D5F5E3", color: "#1E8449" },
    rejected: { bg: "#FADBD8", color: "#922B21" },
    processing: { bg: "#EBF5FB", color: "#1A5276" },
    in_progress: { bg: "#EBF5FB", color: "#1A5276" },
    resolved: { bg: "#D5F5E3", color: "#1E8449" },
    paid: { bg: "#D5F5E3", color: "#1E8449" },
    unpaid: { bg: "#FADBD8", color: "#922B21" },
    active: { bg: "#D5F5E3", color: "#1E8449" },
    inactive: { bg: "#F0F4F8", color: "#666" },
    suspended: { bg: "#FADBD8", color: "#922B21" },
  };
  return map[status] || { bg: "#eee", color: "#333" };
}

function statusLabel(status, lang) {
  const en = { pending: "Pending", approved: "Approved", rejected: "Rejected", processing: "Processing", in_progress: "In Progress", resolved: "Resolved", paid: "Paid", unpaid: "Unpaid", active: "Active", inactive: "Inactive", suspended: "Suspended" };
  const hi = { pending: "लंबित", approved: "स्वीकृत", rejected: "अस्वीकृत", processing: "प्रक्रिया में", in_progress: "जारी है", resolved: "हल हुआ", paid: "भुगतान हुआ", unpaid: "बकाया", active: "सक्रिय", inactive: "निष्क्रिय", suspended: "निलंबित" };
  return (lang === "hi" ? hi : en)[status] || status;
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const S = {
  layout: { display: "flex", minHeight: "100vh", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", background: "#F0F4F8", color: "#2D3748" },
  sidebar: { width: 260, background: "linear-gradient(180deg,#1A5276 0%,#154360 100%)", position: "fixed", top: 0, left: 0, height: "100vh", display: "flex", flexDirection: "column", zIndex: 100, boxShadow: "4px 0 15px rgba(0,0,0,0.15)" },
  mainContent: { flex: 1, marginLeft: 260, display: "flex", flexDirection: "column", minHeight: "100vh" },
  pageContent: { padding: 30, flex: 1 },
  card: { background: "white", borderRadius: 16, padding: 25, boxShadow: "0 4px 15px rgba(0,0,0,0.06)", marginBottom: 25 },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "14px 16px", textAlign: "left", fontSize: 13, fontWeight: 600, background: "linear-gradient(135deg,#1A5276,#2E86C1)", color: "white" },
  td: { padding: "14px 16px", fontSize: 14, color: "#444", borderBottom: "1px solid #F0F4F8" },
  input: { padding: "10px 15px", border: "2px solid #E8EDF2", borderRadius: 10, fontSize: 14, outline: "none", minWidth: 250 },
  select: { padding: "10px 15px", border: "2px solid #E8EDF2", borderRadius: 10, fontSize: 14, outline: "none", cursor: "pointer" },
  btn: (bg) => ({ padding: "10px 20px", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer", background: bg, color: "white", transition: "all 0.2s" }),
  badge: (status) => ({ padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600, background: getBadge(status).bg, color: getBadge(status).color }),
  modalOverlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" },
  modal: { background: "white", borderRadius: 20, padding: 30, width: "90%", maxWidth: 620, maxHeight: "85vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" },
  infoBox: { background: "#F8FAFC", borderRadius: 10, padding: 12 },
};

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function StatCard({ icon, label, labelHi, value, color, lang }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ background: "white", borderRadius: 16, padding: 22, boxShadow: "0 4px 15px rgba(0,0,0,0.06)", borderLeft: `4px solid ${color}`, transform: hov ? "translateY(-3px)" : "none", transition: "transform 0.3s", cursor: "default" }} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 13, color: "#888", marginBottom: 8 }}>{lang === "hi" ? labelHi : label}</div>
          <div style={{ fontSize: 28, fontWeight: 800, color: "#1A5276" }}>{value}</div>
        </div>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}20`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>{icon}</div>
      </div>
    </div>
  );
}

function Sidebar({ lang, setLang, page, setPage }) {
  const menu = [
    { id: "dashboard", icon: "📊", label: "Dashboard", labelHi: "डैशबोर्ड" },
    { id: "connections", icon: "🔌", label: "Connections", labelHi: "कनेक्शन" },
    { id: "complaints", icon: "📋", label: "Complaints", labelHi: "शिकायतें" },
    { id: "payments", icon: "💰", label: "Payments", labelHi: "भुगतान" },
    { id: "customers", icon: "👤", label: "Customers", labelHi: "ग्राहक" },
  ];

  return (
    <div style={S.sidebar}>
      <div style={{ padding: "25px 20px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: "white" }}>⚡ SUVIDHA</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>Electricity Admin Panel</div>
        <div style={{ marginTop: 12, background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#2E86C1", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "white" }}>A</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "white" }}>Admin</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>Electricity Dept.</div>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "20px 12px", overflowY: "auto" }}>
        {menu.map(item => {
          const active = page === item.id;
          return (
            <div key={item.id} onClick={() => setPage(item.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "13px 15px", borderRadius: 12, marginBottom: 6, cursor: "pointer", background: active ? "rgba(255,255,255,0.15)" : "transparent", borderLeft: active ? "3px solid #5DADE2" : "3px solid transparent", transition: "all 0.3s" }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: active ? 700 : 500, color: active ? "white" : "rgba(255,255,255,0.7)" }}>{item.label}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>{item.labelHi}</div>
              </div>
            </div>
          );
        })}
      </nav>

      <div style={{ padding: 20, borderTop: "1px solid rgba(255,255,255,0.1)" }}>
      <button onClick={()=>{ localStorage.removeItem('admin_token');  navigate('/adminlogin'); }} style={{ width:'100%', padding:12, background:'rgba(231,76,60,0.2)', border:'1px solid rgba(231,76,60,0.4)', borderRadius:10, color:'#F1948A', fontSize:14, fontWeight:600, cursor:'pointer' }}>
          🚪 {lang==='hi'?'लॉग आउट':'Logout'}
        </button>
        <div style={{ display: "flex", background: "rgba(255,255,255,0.1)", borderRadius: 10, padding: 4, marginBottom: 12 }}>
          {["en", "hi"].map(l => (
            <button key={l} onClick={() => setLang(l)} style={{ flex: 1, padding: 8, border: "none", borderRadius: 8, cursor: "pointer", background: lang === l ? "white" : "transparent", color: lang === l ? "#1A5276" : "rgba(255,255,255,0.7)", fontWeight: 600, fontSize: 13, transition: "all 0.3s" }}>{l === "en" ? "EN" : "हि"}</button>
          ))}
          
        </div>

      </div>
    </div>
  );
}

function Header({ lang, title, titleHi }) {
  const now = new Date();
  return (
    <div style={{ background: "white", padding: "18px 30px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", position: "sticky", top: 0, zIndex: 99 }}>
      <div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#1A5276" }}>{lang === "hi" ? titleHi : title}</h1>
        <p style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{lang === "hi" ? "विद्युत विभाग — प्रशासन पैनल" : "Electricity Department — Admin Panel"}</p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#1A5276" }}>{now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</div>
          <div style={{ fontSize: 11, color: "#888" }}>{now.toLocaleDateString("en-IN", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}</div>
        </div>
        <div style={{ position: "relative", cursor: "pointer" }}>
          <div style={{ width: 40, height: 40, background: "#EBF5FB", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🔔</div>
          <div style={{ position: "absolute", top: -4, right: -4, width: 16, height: 16, background: "#E74C3C", borderRadius: "50%", fontSize: 10, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>3</div>
        </div>
        <div style={{ background: "linear-gradient(135deg,#1A5276,#2E86C1)", color: "white", padding: "8px 16px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
          ⚡ {lang === "hi" ? "विद्युत विभाग" : "Electricity Dept."}
        </div>
      </div>
    </div>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────

function Dashboard({ lang, setPage }) {
  return (
    <div style={S.pageContent}>
      <div style={{ background: "linear-gradient(135deg,#1A5276,#2E86C1)", borderRadius: 16, padding: "25px 30px", marginBottom: 25, color: "white", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>{lang === "hi" ? "🙏 नमस्ते, एडमिन!" : "👋 Welcome, Admin!"}</h2>
          <p style={{ opacity: 0.8, fontSize: 14 }}>{lang === "hi" ? "विद्युत विभाग — आज का अवलोकन" : "Electricity Department — Today's Overview"}</p>
        </div>
        <div style={{ fontSize: 60 }}>⚡</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, marginBottom: 25 }}>
        <StatCard icon="🔌" label="Total Connections" labelHi="कुल कनेक्शन" value="1,284" color="#2E86C1" lang={lang} />
        <StatCard icon="📋" label="Open Complaints" labelHi="खुली शिकायतें" value="47" color="#E74C3C" lang={lang} />
        <StatCard icon="⏳" label="Pending Requests" labelHi="लंबित अनुरोध" value="23" color="#F39C12" lang={lang} />
        <StatCard icon="💰" label="Revenue (Feb)" labelHi="राजस्व (फरवरी)" value="₹4.2L" color="#27AE60" lang={lang} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 25, marginBottom: 25 }}>
        <div style={S.card}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A5276", marginBottom: 20 }}>📊 {lang === "hi" ? "मासिक अवलोकन" : "Monthly Overview"}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" />
              <XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} /><Tooltip />
              <Bar dataKey="connections" fill="#2E86C1" radius={[4,4,0,0]} name="Connections" />
              <Bar dataKey="complaints" fill="#E74C3C" radius={[4,4,0,0]} name="Complaints" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={S.card}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A5276", marginBottom: 20 }}>🔌 {lang === "hi" ? "कनेक्शन प्रकार" : "Connection Types"}</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart><Pie data={connectionTypes} cx="50%" cy="50%" outerRadius={70} dataKey="value">{connectionTypes.map((e, i) => <Cell key={i} fill={e.color} />)}</Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            {connectionTypes.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.color }} />
                <span style={{ color: "#666" }}>{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={S.card}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A5276", marginBottom: 20 }}>💰 {lang === "hi" ? "भुगतान रुझान" : "Payment Trend"}</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" />
            <XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} tickFormatter={v => `₹${v/1000}K`} /><Tooltip formatter={v => [`₹${v.toLocaleString()}`, "Revenue"]} />
            <Line type="monotone" dataKey="revenue" stroke="#27AE60" strokeWidth={3} dot={{ fill: "#27AE60", r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 25 }}>
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A5276" }}>🔌 {lang === "hi" ? "हाल के आवेदन" : "Recent Applications"}</h3>
            <button onClick={() => setPage("connections")} style={{ background: "#EBF5FB", color: "#2E86C1", border: "none", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{lang === "hi" ? "सभी देखें" : "View All"}</button>
          </div>
          {dummyConnections.slice(0, 4).map(app => (
            <div key={app.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F0F4F8" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{app.name}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{app.id} • {app.type}</div>
              </div>
              <span style={S.badge(app.status)}>{statusLabel(app.status, lang)}</span>
            </div>
          ))}
        </div>
        <div style={S.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A5276" }}>📋 {lang === "hi" ? "हाल की शिकायतें" : "Recent Complaints"}</h3>
            <button onClick={() => setPage("complaints")} style={{ background: "#EBF5FB", color: "#2E86C1", border: "none", padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{lang === "hi" ? "सभी देखें" : "View All"}</button>
          </div>
          {dummyComplaints.slice(0, 4).map(cmp => (
            <div key={cmp.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F0F4F8" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#333" }}>{cmp.name}</div>
                <div style={{ fontSize: 12, color: "#888" }}>{cmp.id} • {complaintTypeLabels[cmp.type]?.en}</div>
              </div>
              <span style={S.badge(cmp.status)}>{statusLabel(cmp.status, lang)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Connections({ lang }) {
  const [connections, setConnections] = useState(dummyConnections);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [remark, setRemark] = useState("");

  const filtered = connections.filter(c => {
    const s = (c.name + c.id + c.mobile).toLowerCase().includes(search.toLowerCase());
    const f = filterStatus === "all" || c.status === filterStatus;
    return s && f;
  });

  function updateStatus(id, st) {
    setConnections(prev => prev.map(c => c.id === id ? { ...c, status: st } : c));
    setSelected(prev => prev ? { ...prev, status: st } : null);
  }

  return (
    <div style={S.pageContent}>
      <p style={{ fontSize: 14, color: "#888", marginBottom: 20 }}>{lang === "hi" ? "नए कनेक्शन आवेदन देखें, दस्तावेज़ सत्यापित करें" : "View new connection applications, verify documents and approve/reject"}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 15, marginBottom: 25 }}>
        {[{ l: "Total", lh: "कुल", v: connections.length, c: "#2E86C1" }, { l: "Pending", lh: "लंबित", v: connections.filter(c => c.status === "pending").length, c: "#F39C12" }, { l: "Approved", lh: "स्वीकृत", v: connections.filter(c => c.status === "approved").length, c: "#27AE60" }, { l: "Rejected", lh: "अस्वीकृत", v: connections.filter(c => c.status === "rejected").length, c: "#E74C3C" }].map((s, i) => (
          <div key={i} style={{ background: "white", borderRadius: 12, padding: 18, borderLeft: `4px solid ${s.c}`, boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 12, color: "#888" }}>{lang === "hi" ? s.lh : s.l}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input style={S.input} placeholder={lang === "hi" ? "🔍 नाम, ID या मोबाइल" : "🔍 Search name, ID or mobile"} value={search} onChange={e => setSearch(e.target.value)} />
        <select style={S.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">{lang === "hi" ? "सभी स्थिति" : "All Status"}</option>
          <option value="pending">{lang === "hi" ? "लंबित" : "Pending"}</option>
          <option value="processing">{lang === "hi" ? "प्रक्रिया में" : "Processing"}</option>
          <option value="approved">{lang === "hi" ? "स्वीकृत" : "Approved"}</option>
          <option value="rejected">{lang === "hi" ? "अस्वीकृत" : "Rejected"}</option>
        </select>
      </div>
      <div style={S.card}>
        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead><tr>{["App ID", "Applicant", "Mobile", "Type", "Docs", "Date", "Status", "Action"].map((h, i) => <th key={i} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(app => {
                const du = Object.values(app.documents).filter(Boolean).length;
                const dt = Object.values(app.documents).length;
                return (
                  <tr key={app.id} style={{ borderBottom: "1px solid #F0F4F8" }}>
                    <td style={{ ...S.td, fontWeight: 600, color: "#2E86C1" }}>{app.id}</td>
                    <td style={S.td}><div style={{ fontWeight: 600 }}>{app.name}</div><div style={{ fontSize: 12, color: "#888" }}>{app.address.split(",")[1]}</div></td>
                    <td style={S.td}>{app.mobile}</td>
                    <td style={S.td}>{app.type}</td>
                    <td style={S.td}><span style={{ background: du === dt ? "#D5F5E3" : "#FEF9E7", color: du === dt ? "#1E8449" : "#784212", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{du}/{dt} ✓</span></td>
                    <td style={{ ...S.td, fontSize: 13, color: "#888" }}>{app.date}</td>
                    <td style={S.td}><span style={S.badge(app.status)}>{statusLabel(app.status, lang)}</span></td>
                    <td style={S.td}><button onClick={() => { setSelected(app); setRemark(""); }} style={{ background: "#EBF5FB", color: "#2E86C1", border: "none", padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{lang === "hi" ? "देखें" : "View"}</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div style={S.modalOverlay} onClick={() => setSelected(null)}>
          <div style={S.modal} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1A5276", marginBottom: 20, paddingBottom: 12, borderBottom: "2px solid #EBF5FB" }}>
              🔌 {lang === "hi" ? "आवेदन विवरण" : "Application Details"} — {selected.id}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              {[["Applicant", "आवेदक नाम", selected.name], ["Father's Name", "पिता का नाम", selected.fatherName], ["Mobile", "मोबाइल", selected.mobile], ["Type", "प्रकार", selected.type], ["Load", "लोड", selected.load], ["Phase", "फेज", selected.phase], ["Meter", "मीटर", selected.meter], ["Date", "तिथि", selected.date]].map(([l, lh, v], i) => (
                <div key={i} style={S.infoBox}><div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{lang === "hi" ? lh : l}</div><div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div></div>
              ))}
            </div>
            <div style={{ ...S.infoBox, marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{lang === "hi" ? "पता" : "Address"}</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{selected.address}</div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1A5276", marginBottom: 12 }}>📄 {lang === "hi" ? "दस्तावेज़" : "Documents"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {Object.entries(selected.documents).map(([k, v]) => (
                  <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px", borderRadius: 10, background: v ? "#D5F5E3" : "#FADBD8", border: `1px solid ${v ? "#27AE60" : "#E74C3C"}` }}>
                    <span>{v ? "✅" : "❌"}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: v ? "#1E8449" : "#922B21" }}>{docLabels[k]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 8 }}>{lang === "hi" ? "टिप्पणी" : "Remark"}</label>
              <textarea rows={3} value={remark} onChange={e => setRemark(e.target.value)} placeholder={lang === "hi" ? "कोई टिप्पणी..." : "Any remark..."} style={{ width: "100%", padding: "10px 14px", border: "2px solid #E8EDF2", borderRadius: 10, fontSize: 14, outline: "none", resize: "none", fontFamily: "Segoe UI, sans-serif", boxSizing: "border-box" }} />
            </div>
            {selected.status === "pending" || selected.status === "processing" ? (
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => updateStatus(selected.id, "processing")} style={S.btn("linear-gradient(135deg,#784212,#F39C12)")} >⚙️ {lang === "hi" ? "प्रक्रिया में" : "Processing"}</button>
                <button onClick={() => updateStatus(selected.id, "approved")} style={S.btn("linear-gradient(135deg,#1E8449,#27AE60)")}>✅ {lang === "hi" ? "स्वीकृत" : "Approve"}</button>
                <button onClick={() => updateStatus(selected.id, "rejected")} style={S.btn("linear-gradient(135deg,#922B21,#E74C3C)")}>❌ {lang === "hi" ? "अस्वीकृत" : "Reject"}</button>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 15, background: getBadge(selected.status).bg, borderRadius: 12, color: getBadge(selected.status).color, fontWeight: 700 }}>
                {selected.status === "approved" ? "✅" : "❌"} {lang === "hi" ? "यह आवेदन" : "This application is"} {statusLabel(selected.status, lang)}
              </div>
            )}
            <button onClick={() => setSelected(null)} style={{ width: "100%", marginTop: 12, padding: 10, background: "#F0F4F8", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#666" }}>{lang === "hi" ? "बंद करें" : "Close"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Complaints({ lang }) {
  const [complaints, setComplaints] = useState(dummyComplaints);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);
  const [assignTo, setAssignTo] = useState("");
  const [remark, setRemark] = useState("");

  const filtered = complaints.filter(c => {
    const s = (c.name + c.id + c.kNumber + c.mobile).toLowerCase().includes(search.toLowerCase());
    return s && (filterStatus === "all" || c.status === filterStatus);
  });

  function updateStatus(id, st) {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: st, assignedTo: assignTo || c.assignedTo } : c));
    setSelected(prev => prev ? { ...prev, status: st, assignedTo: assignTo || prev.assignedTo } : null);
  }

  return (
    <div style={S.pageContent}>
      <p style={{ fontSize: 14, color: "#888", marginBottom: 20 }}>{lang === "hi" ? "शिकायतें देखें, लाइनमैन को सौंपें" : "View complaints, assign to lineman and update status"}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 15, marginBottom: 25 }}>
        {[{ l: "Total", lh: "कुल", v: complaints.length, c: "#2E86C1" }, { l: "Pending", lh: "लंबित", v: complaints.filter(c => c.status === "pending").length, c: "#F39C12" }, { l: "In Progress", lh: "जारी है", v: complaints.filter(c => c.status === "in_progress").length, c: "#2E86C1" }, { l: "Resolved", lh: "हल हुआ", v: complaints.filter(c => c.status === "resolved").length, c: "#27AE60" }].map((s, i) => (
          <div key={i} style={{ background: "white", borderRadius: 12, padding: 18, borderLeft: `4px solid ${s.c}`, boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 12, color: "#888" }}>{lang === "hi" ? s.lh : s.l}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input style={S.input} placeholder={lang === "hi" ? "🔍 नाम, K नंबर, ID" : "🔍 Search name, K Number, ID"} value={search} onChange={e => setSearch(e.target.value)} />
        <select style={S.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">{lang === "hi" ? "सभी" : "All"}</option>
          <option value="pending">{lang === "hi" ? "लंबित" : "Pending"}</option>
          <option value="in_progress">{lang === "hi" ? "जारी है" : "In Progress"}</option>
          <option value="resolved">{lang === "hi" ? "हल हुआ" : "Resolved"}</option>
        </select>
      </div>
      <div style={S.card}>
        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead><tr>{["Complaint ID", "K Number", "Name", "Type", "Assigned To", "Date", "Status", "Action"].map((h, i) => <th key={i} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(cmp => (
                <tr key={cmp.id} style={{ borderBottom: "1px solid #F0F4F8" }}>
                  <td style={{ ...S.td, fontWeight: 600, color: "#2E86C1" }}>{cmp.id}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>{cmp.kNumber}</td>
                  <td style={S.td}><div style={{ fontWeight: 600 }}>{cmp.name}</div><div style={{ fontSize: 12, color: "#888" }}>{cmp.mobile}</div></td>
                  <td style={S.td}><span style={{ background: "#EBF5FB", color: "#1A5276", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{complaintTypeLabels[cmp.type]?.icon} {lang === "hi" ? complaintTypeLabels[cmp.type]?.hi : complaintTypeLabels[cmp.type]?.en}</span></td>
                  <td style={{ ...S.td, fontSize: 13, color: cmp.assignedTo ? "#333" : "#bbb" }}>{cmp.assignedTo || (lang === "hi" ? "नहीं सौंपा" : "Not Assigned")}</td>
                  <td style={{ ...S.td, fontSize: 13, color: "#888" }}>{cmp.date}</td>
                  <td style={S.td}><span style={S.badge(cmp.status)}>{statusLabel(cmp.status, lang)}</span></td>
                  <td style={S.td}><button onClick={() => { setSelected(cmp); setAssignTo(cmp.assignedTo); setRemark(""); }} style={{ background: "#EBF5FB", color: "#2E86C1", border: "none", padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{lang === "hi" ? "देखें" : "View"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div style={S.modalOverlay} onClick={() => setSelected(null)}>
          <div style={{ ...S.modal, maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1A5276", marginBottom: 20, paddingBottom: 12, borderBottom: "2px solid #EBF5FB" }}>
              📋 {lang === "hi" ? "शिकायत विवरण" : "Complaint Details"} — {selected.id}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 15 }}>
              {[["Name", "नाम", selected.name], ["K Number", "K नंबर", selected.kNumber], ["Mobile", "मोबाइल", selected.mobile], ["Date", "तिथि", selected.date]].map(([l, lh, v], i) => (
                <div key={i} style={S.infoBox}><div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{lang === "hi" ? lh : l}</div><div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div></div>
              ))}
            </div>
            <div style={{ background: "#EBF5FB", borderRadius: 10, padding: 12, marginBottom: 15 }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{lang === "hi" ? "प्रकार" : "Type"}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#1A5276" }}>{complaintTypeLabels[selected.type]?.icon} {lang === "hi" ? complaintTypeLabels[selected.type]?.hi : complaintTypeLabels[selected.type]?.en}</div>
            </div>
            <div style={{ ...S.infoBox, marginBottom: 15 }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{lang === "hi" ? "विवरण" : "Description"}</div>
              <div style={{ fontSize: 14, lineHeight: 1.6 }}>{selected.description}</div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>👷 {lang === "hi" ? "लाइनमैन" : "Assign Lineman"}</label>
              <input type="text" value={assignTo} onChange={e => setAssignTo(e.target.value)} placeholder={lang === "hi" ? "लाइनमैन का नाम" : "Lineman name"} style={{ width: "100%", padding: "10px 14px", border: "2px solid #E8EDF2", borderRadius: 10, fontSize: 14, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#444", display: "block", marginBottom: 6 }}>{lang === "hi" ? "टिप्पणी" : "Remark"}</label>
              <textarea rows={2} value={remark} onChange={e => setRemark(e.target.value)} placeholder="..." style={{ width: "100%", padding: "10px 14px", border: "2px solid #E8EDF2", borderRadius: 10, fontSize: 14, outline: "none", resize: "none", fontFamily: "Segoe UI, sans-serif", boxSizing: "border-box" }} />
            </div>
            {selected.status !== "resolved" ? (
              <div style={{ display: "flex", gap: 12 }}>
                <button onClick={() => updateStatus(selected.id, "in_progress")} style={S.btn("linear-gradient(135deg,#784212,#F39C12)")}>⚙️ {lang === "hi" ? "जारी करें" : "In Progress"}</button>
                <button onClick={() => updateStatus(selected.id, "resolved")} style={S.btn("linear-gradient(135deg,#1E8449,#27AE60)")}>✅ {lang === "hi" ? "हल हुआ" : "Resolved"}</button>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: 15, background: "#D5F5E3", borderRadius: 12, color: "#1E8449", fontWeight: 700 }}>✅ {lang === "hi" ? "शिकायत हल हो गई" : "Complaint Resolved"}</div>
            )}
            <button onClick={() => setSelected(null)} style={{ width: "100%", marginTop: 12, padding: 10, background: "#F0F4F8", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#666" }}>{lang === "hi" ? "बंद करें" : "Close"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Payments({ lang }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = dummyPayments.filter(p => {
    const s = (p.name + p.kNumber + p.id + p.mobile).toLowerCase().includes(search.toLowerCase());
    return s && (filterStatus === "all" || p.status === filterStatus);
  });

  const totalRev = dummyPayments.filter(p => p.status === "paid").reduce((s, p) => s + p.amount, 0);
  const totalPend = dummyPayments.filter(p => p.status === "unpaid").reduce((s, p) => s + p.amount, 0);

  return (
    <div style={S.pageContent}>
      <p style={{ fontSize: 14, color: "#888", marginBottom: 20 }}>{lang === "hi" ? "भुगतान इतिहास और लंबित राशि" : "Payment history and pending amounts"}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 15, marginBottom: 25 }}>
        {[{ l: "Total", lh: "कुल", v: dummyPayments.length, c: "#2E86C1" }, { l: "Paid", lh: "भुगतान", v: dummyPayments.filter(p => p.status === "paid").length, c: "#27AE60" }, { l: "Unpaid", lh: "बकाया", v: dummyPayments.filter(p => p.status === "unpaid").length, c: "#E74C3C" }, { l: "Revenue", lh: "राजस्व", v: `₹${(totalRev/1000).toFixed(1)}K`, c: "#F39C12" }].map((s, i) => (
          <div key={i} style={{ background: "white", borderRadius: 12, padding: 18, borderLeft: `4px solid ${s.c}`, boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 12, color: "#888" }}>{lang === "hi" ? s.lh : s.l}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={S.card}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#1A5276", marginBottom: 20 }}>💰 {lang === "hi" ? "राजस्व रुझान" : "Revenue Trend"}</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F4F8" />
            <XAxis dataKey="month" fontSize={12} /><YAxis fontSize={12} tickFormatter={v => `₹${v/1000}K`} /><Tooltip formatter={v => [`₹${v.toLocaleString()}`, "Revenue"]} />
            <Line type="monotone" dataKey="revenue" stroke="#27AE60" strokeWidth={3} dot={{ fill: "#27AE60", r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {totalPend > 0 && (
        <div style={{ background: "#FEF9E7", border: "1px solid #F39C12", borderRadius: 12, padding: "15px 20px", marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>⚠️</span>
          <div><div style={{ fontWeight: 700, color: "#784212" }}>{lang === "hi" ? "बकाया राशि" : "Pending Amount"}</div><div style={{ fontSize: 13, color: "#784212" }}>{dummyPayments.filter(p => p.status === "unpaid").length} {lang === "hi" ? "ग्राहकों का" : "customers have"} ₹{totalPend.toLocaleString()} {lang === "hi" ? "बकाया" : "pending"}</div></div>
        </div>
      )}
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input style={S.input} placeholder={lang === "hi" ? "🔍 नाम, K नंबर" : "🔍 Search name, K Number"} value={search} onChange={e => setSearch(e.target.value)} />
        <select style={S.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">{lang === "hi" ? "सभी" : "All"}</option>
          <option value="paid">{lang === "hi" ? "भुगतान हुए" : "Paid"}</option>
          <option value="unpaid">{lang === "hi" ? "बकाया" : "Unpaid"}</option>
        </select>
      </div>
      <div style={S.card}>
        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead><tr>{["Payment ID", "K Number", "Customer", "Month", "Units", "Amount", "Paid On", "Status", "Receipt"].map((h, i) => <th key={i} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #F0F4F8" }}>
                  <td style={{ ...S.td, fontWeight: 600, color: "#2E86C1" }}>{p.id}</td>
                  <td style={{ ...S.td, fontWeight: 600 }}>{p.kNumber}</td>
                  <td style={S.td}><div style={{ fontWeight: 600 }}>{p.name}</div><div style={{ fontSize: 12, color: "#888" }}>{p.mobile}</div></td>
                  <td style={{ ...S.td, fontSize: 13 }}>{p.billMonth}</td>
                  <td style={{ ...S.td, fontSize: 13 }}>{p.units}</td>
                  <td style={{ ...S.td, fontWeight: 700, color: "#1A5276" }}>₹{p.amount.toLocaleString()}</td>
                  <td style={{ ...S.td, fontSize: 13, color: "#888" }}>{p.paidOn}</td>
                  <td style={S.td}><span style={S.badge(p.status)}>{p.status === "paid" ? (lang === "hi" ? "✅ भुगतान" : "✅ Paid") : (lang === "hi" ? "❌ बकाया" : "❌ Unpaid")}</span></td>
                  <td style={S.td}><button onClick={() => setSelected(p)} style={{ background: "#EBF5FB", color: "#2E86C1", border: "none", padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{lang === "hi" ? "रसीद" : "Receipt"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div style={S.modalOverlay} onClick={() => setSelected(null)}>
          <div style={{ ...S.modal, maxWidth: 420 }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: 20 }}>
              <div style={{ fontSize: 48 }}>{selected.status === "paid" ? "✅" : "⏳"}</div>
              <h2 style={{ fontSize: 20, fontWeight: 800, color: "#1A5276" }}>{lang === "hi" ? "भुगतान रसीद" : "Payment Receipt"}</h2>
            </div>
            <div style={{ background: "#F8FAFC", borderRadius: 14, padding: 20, marginBottom: 20 }}>
              {[["Payment ID", "भुगतान ID", selected.id], ["K Number", "K नंबर", selected.kNumber], ["Customer", "ग्राहक", selected.name], ["Bill Month", "बिल महीना", selected.billMonth], ["Units", "यूनिट", selected.units], ["Amount", "राशि", `₹${selected.amount.toLocaleString()}`], ["Paid On", "भुगतान तिथि", selected.paidOn], ["Transaction ID", "लेनदेन ID", selected.transactionId]].map(([l, lh, v], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 7 ? "1px solid #E8EDF2" : "none" }}>
                  <span style={{ fontSize: 13, color: "#888" }}>{lang === "hi" ? lh : l}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", padding: 12, background: getBadge(selected.status).bg, borderRadius: 10, marginBottom: 15, fontWeight: 700, color: getBadge(selected.status).color }}>
              {selected.status === "paid" ? (lang === "hi" ? "✅ भुगतान सफल" : "✅ Payment Successful") : (lang === "hi" ? "❌ भुगतान बकाया" : "❌ Payment Pending")}
            </div>
            <button onClick={() => setSelected(null)} style={{ width: "100%", padding: 12, background: "#F0F4F8", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#666" }}>{lang === "hi" ? "बंद करें" : "Close"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

function Customers({ lang }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = dummyCustomers.filter(c => {
    const s = (c.name + c.kNumber + c.mobile + c.meterNumber).toLowerCase().includes(search.toLowerCase());
    return s && (filterStatus === "all" || c.connectionStatus === filterStatus);
  });

  return (
    <div style={S.pageContent}>
      <p style={{ fontSize: 14, color: "#888", marginBottom: 20 }}>{lang === "hi" ? "सभी ग्राहकों की जानकारी" : "View and manage all customer information"}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 15, marginBottom: 25 }}>
        {[{ l: "Total", lh: "कुल", v: dummyCustomers.length, c: "#2E86C1" }, { l: "Active", lh: "सक्रिय", v: dummyCustomers.filter(c => c.connectionStatus === "active").length, c: "#27AE60" }, { l: "Suspended", lh: "निलंबित", v: dummyCustomers.filter(c => c.connectionStatus === "suspended").length, c: "#E74C3C" }, { l: "Inactive", lh: "निष्क्रिय", v: dummyCustomers.filter(c => c.connectionStatus === "inactive").length, c: "#888" }].map((s, i) => (
          <div key={i} style={{ background: "white", borderRadius: 12, padding: 18, borderLeft: `4px solid ${s.c}`, boxShadow: "0 4px 15px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 12, color: "#888" }}>{lang === "hi" ? s.lh : s.l}</div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.c }}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <input style={S.input} placeholder={lang === "hi" ? "🔍 नाम, K नंबर, मीटर" : "🔍 Search name, K Number, meter"} value={search} onChange={e => setSearch(e.target.value)} />
        <select style={S.select} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option value="all">{lang === "hi" ? "सभी" : "All"}</option>
          <option value="active">{lang === "hi" ? "सक्रिय" : "Active"}</option>
          <option value="inactive">{lang === "hi" ? "निष्क्रिय" : "Inactive"}</option>
          <option value="suspended">{lang === "hi" ? "निलंबित" : "Suspended"}</option>
        </select>
      </div>
      <div style={S.card}>
        <div style={{ overflowX: "auto" }}>
          <table style={S.table}>
            <thead><tr>{["K Number", "Name", "Mobile", "Meter No.", "Type", "Current Bill", "Status", "Action"].map((h, i) => <th key={i} style={S.th}>{h}</th>)}</tr></thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.kNumber} style={{ borderBottom: "1px solid #F0F4F8" }}>
                  <td style={{ ...S.td, fontWeight: 700, color: "#2E86C1" }}>{c.kNumber}</td>
                  <td style={S.td}><div style={{ fontWeight: 600 }}>{c.name}</div><div style={{ fontSize: 12, color: "#888" }}>{c.fatherName}</div></td>
                  <td style={S.td}>{c.mobile}</td>
                  <td style={{ ...S.td, fontSize: 13 }}>{c.meterNumber}</td>
                  <td style={S.td}><span style={{ background: "#EBF5FB", color: "#1A5276", padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{c.connectionType}</span></td>
                  <td style={{ ...S.td, fontWeight: 700, color: c.currentBill > 0 ? "#E74C3C" : "#27AE60" }}>{c.currentBill > 0 ? `₹${c.currentBill.toLocaleString()}` : "Nil"}</td>
                  <td style={S.td}><span style={S.badge(c.connectionStatus)}>{statusLabel(c.connectionStatus, lang)}</span></td>
                  <td style={S.td}><button onClick={() => setSelected(c)} style={{ background: "#EBF5FB", color: "#2E86C1", border: "none", padding: "7px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{lang === "hi" ? "देखें" : "View"}</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div style={S.modalOverlay} onClick={() => setSelected(null)}>
          <div style={{ ...S.modal, maxWidth: 540 }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 20, fontWeight: 700, color: "#1A5276", marginBottom: 20, paddingBottom: 12, borderBottom: "2px solid #EBF5FB" }}>👤 {lang === "hi" ? "ग्राहक विवरण" : "Customer Details"}</div>
            <div style={{ background: "linear-gradient(135deg,#1A5276,#2E86C1)", borderRadius: 14, padding: 20, marginBottom: 20, color: "white", display: "flex", alignItems: "center", gap: 15 }}>
              <div style={{ width: 55, height: 55, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800 }}>{selected.name.charAt(0)}</div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 700 }}>{selected.name}</div>
                <div style={{ fontSize: 13, opacity: 0.8 }}>{selected.kNumber} • {selected.meterNumber}</div>
                <span style={{ background: "rgba(255,255,255,0.2)", padding: "3px 10px", borderRadius: 20, fontSize: 12, marginTop: 5, display: "inline-block" }}>{statusLabel(selected.connectionStatus, lang)}</span>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 15 }}>
              {[["Father's Name", "पिता का नाम", selected.fatherName], ["Mobile", "मोबाइल", selected.mobile], ["Email", "ईमेल", selected.email || "N/A"], ["Type", "प्रकार", selected.connectionType], ["Phase", "फेज", selected.phase], ["Join Date", "जुड़ने की तिथि", selected.joinDate], ["Last Paid", "अंतिम भुगतान", selected.lastPaid], ["Current Bill", "वर्तमान बिल", selected.currentBill > 0 ? `₹${selected.currentBill}` : "Nil"]].map(([l, lh, v], i) => (
                <div key={i} style={S.infoBox}><div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>{lang === "hi" ? lh : l}</div><div style={{ fontSize: 14, fontWeight: 600 }}>{v}</div></div>
              ))}
            </div>
            <div style={{ ...S.infoBox, marginBottom: 20 }}>
              <div style={{ fontSize: 11, color: "#888", marginBottom: 4 }}>📍 {lang === "hi" ? "पता" : "Address"}</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{selected.address}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{ width: "100%", padding: 12, background: "#F0F4F8", border: "none", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600, color: "#666" }}>{lang === "hi" ? "बंद करें" : "Close"}</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function ElectricityAdmin() {
  const [page, setPage] = useState("dashboard");
  const [lang, setLang] = useState("en");

  const pages = {
    dashboard: { title: "Dashboard", titleHi: "डैशबोर्ड" },
    connections: { title: "New Connections", titleHi: "नए कनेक्शन" },
    complaints: { title: "Complaints", titleHi: "शिकायतें" },
    payments: { title: "Payments", titleHi: "भुगतान" },
    customers: { title: "Customers", titleHi: "ग्राहक" },
  };

  return (
    <div style={S.layout}>
      <Sidebar lang={lang} setLang={setLang} page={page} setPage={setPage} />
      <div style={S.mainContent}>
        <Header lang={lang} title={pages[page].title} titleHi={pages[page].titleHi} />
        {page === "dashboard" && <Dashboard lang={lang} setPage={setPage} />}
        {page === "connections" && <Connections lang={lang} />}
        {page === "complaints" && <Complaints lang={lang} />}
        {page === "payments" && <Payments lang={lang} />}
        {page === "customers" && <Customers lang={lang} />}
      </div>
    </div>
  );
}