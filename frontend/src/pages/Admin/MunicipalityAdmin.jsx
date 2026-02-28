import { useState } from "react";

// ============================================================
// MUNICIPALITY ADMIN DASHBOARD — SUVIDHA
// ============================================================

const COLORS = {
  primary: "#1a3c5e",
  accent: "#f97316",
  accent2: "#10b981",
  bg: "#f0f4f8",
  sidebar: "#0f2a42",
  sidebarHover: "#1a3c5e",
  card: "#ffffff",
  text: "#1e293b",
  muted: "#64748b",
  border: "#e2e8f0",
  danger: "#ef4444",
  warning: "#f59e0b",
  success: "#10b981",
  info: "#3b82f6",
};

const NAV_ITEMS = [
  {
    id: "citizen",
    icon: "🧾",
    label: "Citizen Services",
    labelHi: "नागरिक सेवाएं",
    sub: [
      { id: "bpas", icon: "🧱", label: "Building Plan Approval", labelHi: "भवन योजना अनुमोदन" },
      { id: "water-conn", icon: "💧", label: "Water/Sewer Connection", labelHi: "जल/सीवर कनेक्शन" },
      { id: "property-reg", icon: "🏡", label: "Property Registration", labelHi: "संपत्ति पंजीकरण" },
      { id: "garbage-comp", icon: "🧹", label: "Garbage Complaints", labelHi: "कचरा शिकायतें" },
      { id: "streetlight", icon: "💡", label: "Streetlight Repair", labelHi: "स्ट्रीट लाइट मरम्मत" },
      { id: "vehicle", icon: "🚗", label: "Vehicle & Parking Permits", labelHi: "वाहन एवं पार्किंग" },
      { id: "rti", icon: "💬", label: "RTI & Public Feedback", labelHi: "आरटीआई एवं फीडबैक" },
      { id: "grievance", icon: "🔧", label: "Grievance Redressal", labelHi: "शिकायत निवारण" },
    ],
  },
  {
    id: "finance",
    icon: "💰",
    label: "Finance & Revenue",
    labelHi: "वित्त एवं राजस्व",
    sub: [
      { id: "property-tax", icon: "🏠", label: "Property Tax Collection", labelHi: "संपत्ति कर संग्रह" },
      { id: "water-bill", icon: "💧", label: "Water & Sewer Bills", labelHi: "जल एवं सीवर बिल" },
      { id: "waste-charges", icon: "🚮", label: "Solid Waste Charges", labelHi: "ठोस अपशिष्ट शुल्क" },
      { id: "payments", icon: "🧾", label: "Online Payments", labelHi: "ऑनलाइन भुगतान" },
      { id: "receipts", icon: "📑", label: "Receipt & Invoice", labelHi: "रसीद एवं चालान" },
      { id: "revenue-analytics", icon: "📈", label: "Revenue Analytics", labelHi: "राजस्व विश्लेषण" },
      { id: "budget", icon: "💼", label: "Budget & Expenditure", labelHi: "बजट एवं व्यय" },
    ],
  },
  {
    id: "projects",
    icon: "🧱",
    label: "Projects & Tenders",
    labelHi: "परियोजनाएं एवं निविदाएं",
    sub: [
      { id: "new-project", icon: "🚧", label: "New Project Creation", labelHi: "नई परियोजना" },
      { id: "tender", icon: "📄", label: "Tender Management", labelHi: "निविदा प्रबंधन" },
      { id: "contractor", icon: "👷", label: "Contractor Registration", labelHi: "ठेकेदार पंजीकरण" },
      { id: "progress", icon: "📅", label: "Work Progress Monitor", labelHi: "कार्य प्रगति" },
      { id: "site-photos", icon: "📸", label: "Site Photos & Reports", labelHi: "साइट फ़ोटो" },
      { id: "payment-stages", icon: "💰", label: "Payment Stages", labelHi: "भुगतान चरण" },
      { id: "alerts", icon: "🔔", label: "Delay & Budget Alerts", labelHi: "विलंब अलर्ट" },
    ],
  },
  {
    id: "sanitation",
    icon: "♻️",
    label: "Sanitation & Waste",
    labelHi: "स्वच्छता एवं कचरा",
    sub: [
      { id: "garbage-route", icon: "🗑️", label: "Garbage Route & Bins", labelHi: "कचरा मार्ग" },
      { id: "vehicle-track", icon: "🚛", label: "Vehicle Tracking", labelHi: "वाहन ट्रैकिंग" },
      { id: "worker-attend", icon: "👷", label: "Worker Attendance", labelHi: "कर्मचारी उपस्थिति" },
      { id: "daily-report", icon: "🧾", label: "Daily Waste Report", labelHi: "दैनिक रिपोर्ट" },
      { id: "ward-report", icon: "📍", label: "Ward Cleanliness Report", labelHi: "वार्ड स्वच्छता" },
    ],
  },
  {
    id: "complaints",
    icon: "📞",
    label: "Complaint & Feedback",
    labelHi: "शिकायत एवं फीडबैक",
    sub: [
      { id: "register-comp", icon: "🧾", label: "Register Complaint", labelHi: "शिकायत दर्ज करें" },
      { id: "assign", icon: "⏳", label: "Auto Assign Officer", labelHi: "अधिकारी नियुक्ति" },
      { id: "timeline", icon: "📅", label: "Resolution Timeline", labelHi: "समाधान समयसीमा" },
      { id: "closure", icon: "✅", label: "Closure Verification", labelHi: "समापन सत्यापन" },
      { id: "comp-analytics", icon: "📊", label: "Complaint Analytics", labelHi: "शिकायत विश्लेषण" },
    ],
  },
  {
    id: "communication",
    icon: "📢",
    label: "Communication",
    labelHi: "संचार",
    sub: [
      { id: "notifications", icon: "🔔", label: "Notifications", labelHi: "सूचनाएं" },
      { id: "sms-alerts", icon: "📩", label: "SMS / Email / Push Alerts", labelHi: "एसएमएस अलर्ट" },
      { id: "noticeboard", icon: "📢", label: "Notice Board", labelHi: "सूचना पट्ट" },
      { id: "events", icon: "📆", label: "Event / Meeting Scheduler", labelHi: "कार्यक्रम अनुसूची" },
    ],
  },
];

// ---- Stat Card ----
function StatCard({ icon, label, value, sub, color }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 14,
      padding: "20px 22px",
      display: "flex",
      alignItems: "center",
      gap: 16,
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      borderLeft: `4px solid ${color}`,
      minWidth: 180,
      flex: "1 1 180px",
    }}>
      <div style={{ fontSize: 32 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 26, fontWeight: 800, color: COLORS.text }}>{value}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

// ---- Badge ----
function Badge({ status }) {
  const map = {
    Pending: { bg: "#fef3c7", color: "#92400e", label: "Pending" },
    "In Progress": { bg: "#dbeafe", color: "#1e40af", label: "In Progress" },
    Approved: { bg: "#d1fae5", color: "#065f46", label: "Approved" },
    Rejected: { bg: "#fee2e2", color: "#991b1b", label: "Rejected" },
    Closed: { bg: "#e0e7ff", color: "#3730a3", label: "Closed" },
  };
  const s = map[status] || { bg: "#f1f5f9", color: "#475569", label: status };
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "3px 10px", borderRadius: 99,
      fontSize: 11, fontWeight: 700,
    }}>{s.label}</span>
  );
}

// ---- Table ----
function Table({ cols, rows }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#f8fafc" }}>
            {cols.map(c => (
              <th key={c} style={{ padding: "10px 14px", textAlign: "left", color: COLORS.muted, fontWeight: 700, borderBottom: `1px solid ${COLORS.border}` }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom: `1px solid ${COLORS.border}` }}>
              {r.map((cell, j) => (
                <td key={j} style={{ padding: "10px 14px", color: COLORS.text }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ---- Page Components ----
function MainDashboard() {
  const stats = [
    { icon: "🧾", label: "Total Applications", value: "1,284", sub: "This month", color: COLORS.info },
    { icon: "⏳", label: "Pending Approvals", value: "247", sub: "Needs action", color: COLORS.warning },
    { icon: "✅", label: "Resolved Today", value: "38", sub: "Last 24 hrs", color: COLORS.success },
    { icon: "💰", label: "Revenue Collected", value: "₹12.4L", sub: "This month", color: COLORS.accent },
    { icon: "📢", label: "Active Complaints", value: "93", sub: "Open tickets", color: COLORS.danger },
    { icon: "🚧", label: "Ongoing Projects", value: "17", sub: "In progress", color: "#8b5cf6" },
  ];
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: COLORS.text, margin: 0 }}>नगर पालिका डैशबोर्ड</h2>
        <p style={{ color: COLORS.muted, margin: "4px 0 0", fontSize: 13 }}>Municipality Admin Overview — SUVIDHA</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px", color: COLORS.text }}>📋 Recent Applications</h3>
          <Table
            cols={["ID", "Citizen", "Type", "Status"]}
            rows={[
              ["#BPA-001", "Ramesh Kumar", "Building Plan", <Badge status="Pending" />],
              ["#WC-042", "Sunita Devi", "Water Connection", <Badge status="Approved" />],
              ["#PR-018", "Ajay Singh", "Property Reg.", <Badge status="In Progress" />],
              ["#GC-071", "Pooja Sharma", "Garbage Complaint", <Badge status="Closed" />],
              ["#RTI-009", "Manoj Patel", "RTI Application", <Badge status="Pending" />],
            ]}
          />
        </div>

        <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px", color: COLORS.text }}>💰 Revenue Summary</h3>
          {[
            { label: "Property Tax", value: "₹6,20,000", pct: 72, color: COLORS.info },
            { label: "Water Bills", value: "₹2,80,000", pct: 55, color: COLORS.accent2 },
            { label: "Waste Charges", value: "₹1,40,000", pct: 38, color: COLORS.warning },
            { label: "Permits & Fees", value: "₹1,60,000", pct: 45, color: "#8b5cf6" },
          ].map(r => (
            <div key={r.label} style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, color: COLORS.text, fontWeight: 600 }}>{r.label}</span>
                <span style={{ fontSize: 13, color: COLORS.muted }}>{r.value}</span>
              </div>
              <div style={{ background: "#f1f5f9", borderRadius: 99, height: 7 }}>
                <div style={{ background: r.color, width: `${r.pct}%`, height: 7, borderRadius: 99, transition: "width 0.6s" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 16px", color: COLORS.text }}>🚧 Active Projects</h3>
        <Table
          cols={["Project", "Ward", "Budget", "Progress", "Status"]}
          rows={[
            ["Road Repair - Sector 4", "Ward 12", "₹8.5L", <ProgressBar pct={65} />, <Badge status="In Progress" />],
            ["Sewage Line Upgrade", "Ward 7", "₹12L", <ProgressBar pct={30} />, <Badge status="In Progress" />],
            ["Park Development", "Ward 15", "₹4.2L", <ProgressBar pct={90} />, <Badge status="Approved" />],
            ["Streetlight Installation", "Ward 3", "₹2.8L", <ProgressBar pct={100} />, <Badge status="Closed" />],
          ]}
        />
      </div>
    </div>
  );
}

function ProgressBar({ pct }) {
  const c = pct >= 80 ? COLORS.success : pct >= 50 ? COLORS.info : COLORS.warning;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ background: "#f1f5f9", borderRadius: 99, height: 6, width: 80 }}>
        <div style={{ background: c, width: `${pct}%`, height: 6, borderRadius: 99 }} />
      </div>
      <span style={{ fontSize: 11, color: COLORS.muted }}>{pct}%</span>
    </div>
  );
}

// ---- Generic Sub Pages ----
function CitizenServicesPage({ sub }) {
  const subData = {
    bpas: {
      title: "🧱 Building Plan Approval (BPAS)",
      stats: [
        { icon: "📥", label: "New Applications", value: "42", color: COLORS.info },
        { icon: "⏳", label: "Under Review", value: "18", color: COLORS.warning },
        { icon: "✅", label: "Approved", value: "74", color: COLORS.success },
        { icon: "❌", label: "Rejected", value: "9", color: COLORS.danger },
      ],
      cols: ["Application ID", "Applicant", "Plot Area", "Zone", "Submitted", "Status", "Action"],
      rows: [
        ["#BPA-2024-001", "Ramesh Kumar", "250 sqm", "Residential", "15 Jan", <Badge status="Pending" />, <ActionBtns />],
        ["#BPA-2024-002", "Priya Sharma", "480 sqm", "Commercial", "16 Jan", <Badge status="In Progress" />, <ActionBtns />],
        ["#BPA-2024-003", "Suresh Patel", "120 sqm", "Residential", "17 Jan", <Badge status="Approved" />, <ActionBtns />],
        ["#BPA-2024-004", "Anjali Gupta", "300 sqm", "Mixed Use", "18 Jan", <Badge status="Rejected" />, <ActionBtns />],
      ],
    },
    "water-conn": {
      title: "💧 Water / Sewer Connection",
      stats: [
        { icon: "📥", label: "New Requests", value: "28", color: COLORS.info },
        { icon: "⏳", label: "Site Inspection", value: "11", color: COLORS.warning },
        { icon: "✅", label: "Approved", value: "52", color: COLORS.success },
        { icon: "🔧", label: "Installation Pending", value: "7", color: "#8b5cf6" },
      ],
      cols: ["Request ID", "Applicant", "Address", "Type", "Date", "Status", "Action"],
      rows: [
        ["#WC-101", "Sunita Devi", "12, Gandhi Nagar", "New Water", "10 Jan", <Badge status="Approved" />, <ActionBtns />],
        ["#WC-102", "Ravi Verma", "45, Shiv Colony", "Sewer", "11 Jan", <Badge status="Pending" />, <ActionBtns />],
        ["#WC-103", "Geeta Yadav", "7, Nehru Road", "Water + Sewer", "12 Jan", <Badge status="In Progress" />, <ActionBtns />],
      ],
    },
    "property-reg": {
      title: "🏡 Property Registration & Tax Assessment",
      stats: [
        { icon: "🏠", label: "Total Properties", value: "8,420", color: COLORS.info },
        { icon: "📥", label: "New Registrations", value: "31", color: COLORS.warning },
        { icon: "✅", label: "Assessed", value: "22", color: COLORS.success },
        { icon: "⚠️", label: "Defaulters", value: "148", color: COLORS.danger },
      ],
      cols: ["Property ID", "Owner", "Type", "Area", "Annual Tax", "Status", "Action"],
      rows: [
        ["#PROP-4421", "Mohan Lal", "Residential", "150 sqm", "₹4,200", <Badge status="Approved" />, <ActionBtns />],
        ["#PROP-4422", "Kavita Singh", "Commercial", "300 sqm", "₹12,800", <Badge status="Pending" />, <ActionBtns />],
        ["#PROP-4423", "Dinesh Gupta", "Residential", "200 sqm", "₹6,500", <Badge status="Approved" />, <ActionBtns />],
      ],
    },
    "garbage-comp": {
      title: "🧹 Garbage Collection Complaints",
      stats: [
        { icon: "📞", label: "New Complaints", value: "34", color: COLORS.danger },
        { icon: "⏳", label: "Assigned", value: "21", color: COLORS.warning },
        { icon: "✅", label: "Resolved Today", value: "15", color: COLORS.success },
        { icon: "🗓️", label: "Avg Resolution", value: "1.8d", color: COLORS.info },
      ],
      cols: ["Complaint ID", "Citizen", "Ward", "Location", "Date", "Status", "Action"],
      rows: [
        ["#GC-501", "Alka Mishra", "Ward 5", "Near Shiv Mandir", "Today", <Badge status="Pending" />, <ActionBtns />],
        ["#GC-502", "Hemant Joshi", "Ward 9", "Railway Crossing", "Yesterday", <Badge status="In Progress" />, <ActionBtns />],
        ["#GC-503", "Nisha Pandey", "Ward 3", "Market Area", "2 days ago", <Badge status="Closed" />, <ActionBtns />],
      ],
    },
    streetlight: {
      title: "💡 Streetlight Repair Complaints",
      stats: [
        { icon: "🔴", label: "Non-functional", value: "47", color: COLORS.danger },
        { icon: "🔧", label: "Under Repair", value: "19", color: COLORS.warning },
        { icon: "✅", label: "Fixed Today", value: "8", color: COLORS.success },
        { icon: "📍", label: "Wards Affected", value: "12", color: COLORS.info },
      ],
      cols: ["ID", "Location", "Ward", "Pole No.", "Reported", "Status", "Action"],
      rows: [
        ["#SL-201", "Gandhi Road", "Ward 2", "P-142", "Today", <Badge status="Pending" />, <ActionBtns />],
        ["#SL-202", "Bus Stand Area", "Ward 6", "P-089", "Yesterday", <Badge status="In Progress" />, <ActionBtns />],
        ["#SL-203", "School Street", "Ward 11", "P-211", "2 days ago", <Badge status="Closed" />, <ActionBtns />],
      ],
    },
    vehicle: {
      title: "🚗 Vehicle Parking & License Permits",
      stats: [
        { icon: "📥", label: "New Applications", value: "16", color: COLORS.info },
        { icon: "✅", label: "Permits Issued", value: "89", color: COLORS.success },
        { icon: "❌", label: "Expired", value: "23", color: COLORS.danger },
        { icon: "💰", label: "Revenue", value: "₹45,000", color: COLORS.accent },
      ],
      cols: ["Permit ID", "Applicant", "Vehicle No.", "Type", "Valid Till", "Status", "Action"],
      rows: [
        ["#VP-301", "Rakesh Verma", "MP09-AB1234", "Monthly Parking", "31 Jan", <Badge status="Approved" />, <ActionBtns />],
        ["#VP-302", "Seema Jain", "MP09-CD5678", "Annual", "Dec 2025", <Badge status="Approved" />, <ActionBtns />],
        ["#VP-303", "Ankit Tiwari", "MP09-EF9012", "Monthly Parking", "28 Jan", <Badge status="Pending" />, <ActionBtns />],
      ],
    },
    rti: {
      title: "💬 RTI Applications & Public Feedback",
      stats: [
        { icon: "📥", label: "New RTI", value: "12", color: COLORS.info },
        { icon: "⏳", label: "Under Process", value: "8", color: COLORS.warning },
        { icon: "✅", label: "Responded", value: "31", color: COLORS.success },
        { icon: "⏰", label: "Overdue (>30d)", value: "3", color: COLORS.danger },
      ],
      cols: ["RTI ID", "Applicant", "Subject", "Filed On", "Due Date", "Status", "Action"],
      rows: [
        ["#RTI-009", "Manoj Patel", "Road repair expenditure", "5 Jan", "4 Feb", <Badge status="Pending" />, <ActionBtns />],
        ["#RTI-010", "Reena Shah", "Water pipe tender details", "8 Jan", "7 Feb", <Badge status="In Progress" />, <ActionBtns />],
        ["#RTI-011", "Vinod Kumar", "Staff salary info", "10 Jan", "9 Feb", <Badge status="Closed" />, <ActionBtns />],
      ],
    },
    grievance: {
      title: "🔧 Online Grievance Redressal",
      stats: [
        { icon: "📞", label: "Total Grievances", value: "93", color: COLORS.info },
        { icon: "⏳", label: "Open", value: "41", color: COLORS.danger },
        { icon: "🔧", label: "In Progress", value: "28", color: COLORS.warning },
        { icon: "✅", label: "Resolved", value: "24", color: COLORS.success },
      ],
      cols: ["Grievance ID", "Citizen", "Category", "Date", "Assigned To", "Status", "Action"],
      rows: [
        ["#GR-601", "Lalita Devi", "Road Damage", "12 Jan", "Jr. Engineer Sharma", <Badge status="In Progress" />, <ActionBtns />],
        ["#GR-602", "Deepak Singh", "Water Leakage", "13 Jan", "Plumber Team A", <Badge status="Pending" />, <ActionBtns />],
        ["#GR-603", "Usha Rani", "Drainage Block", "14 Jan", "Sanitation Dept.", <Badge status="Closed" />, <ActionBtns />],
      ],
    },
  };
  const d = subData[sub] || subData["bpas"];
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: COLORS.text, marginBottom: 20 }}>{d.title}</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        {d.stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: COLORS.text }}>Applications List</span>
          <div style={{ display: "flex", gap: 8 }}>
            <input placeholder="Search..." style={inputStyle} />
            <button style={btnStyle(COLORS.accent)}>+ New</button>
            <button style={btnStyle(COLORS.info)}>Export</button>
          </div>
        </div>
        <Table cols={d.cols} rows={d.rows} />
      </div>
    </div>
  );
}

function FinancePage({ sub }) {
  const titles = {
    "property-tax": "🏠 Property Tax Collection",
    "water-bill": "💧 Water & Sewer Bill Management",
    "waste-charges": "🚮 Solid Waste User Charges",
    "payments": "🧾 Online Payment Integration",
    "receipts": "📑 Receipt & Invoice Generator",
    "revenue-analytics": "📈 Revenue Analytics & Defaulter List",
    "budget": "💼 Budget Planning & Expenditure",
  };
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: COLORS.text, marginBottom: 20 }}>{titles[sub] || titles["property-tax"]}</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <StatCard icon="💰" label="Total Collected" value="₹12.4L" sub="This Month" color={COLORS.success} />
        <StatCard icon="⚠️" label="Pending Amount" value="₹3.8L" sub="Defaulters" color={COLORS.danger} />
        <StatCard icon="📑" label="Receipts Generated" value="842" sub="This Month" color={COLORS.info} />
        <StatCard icon="📈" label="Collection Rate" value="76%" sub="vs target" color={COLORS.accent} />
      </div>
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: COLORS.text }}>Payment Records</span>
          <div style={{ display: "flex", gap: 8 }}>
            <input placeholder="Search by ID / Name..." style={inputStyle} />
            <button style={btnStyle(COLORS.success)}>Generate Receipt</button>
            <button style={btnStyle(COLORS.info)}>Export</button>
          </div>
        </div>
        <Table
          cols={["Receipt No.", "Citizen", "Amount", "Mode", "Date", "Status", "Action"]}
          rows={[
            ["#RCP-8841", "Ramesh Kumar", "₹4,200", "UPI", "20 Jan", <Badge status="Approved" />, <ActionBtns />],
            ["#RCP-8842", "Sunita Devi", "₹2,800", "Card", "20 Jan", <Badge status="Approved" />, <ActionBtns />],
            ["#RCP-8843", "Ajay Singh", "₹6,500", "NetBanking", "19 Jan", <Badge status="Pending" />, <ActionBtns />],
            ["#RCP-8844", "Pooja Sharma", "₹1,400", "UPI", "19 Jan", <Badge status="Approved" />, <ActionBtns />],
          ]}
        />
      </div>
    </div>
  );
}

function ProjectsPage({ sub }) {
  const titles = {
    "new-project": "🚧 New Project Creation",
    "tender": "📄 Tender Management",
    "contractor": "👷 Contractor Registration",
    "progress": "📅 Work Progress Monitor",
    "site-photos": "📸 Site Photos & Reports",
    "payment-stages": "💰 Payment Stages Tracking",
    "alerts": "🔔 Delay & Budget Alerts",
  };
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: COLORS.text, marginBottom: 20 }}>{titles[sub] || titles["new-project"]}</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <StatCard icon="🚧" label="Active Projects" value="17" sub="Ongoing" color={COLORS.warning} />
        <StatCard icon="✅" label="Completed" value="34" sub="This Year" color={COLORS.success} />
        <StatCard icon="📄" label="Open Tenders" value="6" sub="Bidding Live" color={COLORS.info} />
        <StatCard icon="💰" label="Total Budget" value="₹84L" sub="Allocated" color={COLORS.accent} />
      </div>
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: COLORS.text }}>Projects List</span>
          <div style={{ display: "flex", gap: 8 }}>
            <input placeholder="Search project..." style={inputStyle} />
            <button style={btnStyle(COLORS.accent)}>+ New Project</button>
          </div>
        </div>
        <Table
          cols={["Project ID", "Title", "Ward", "Budget", "Contractor", "Progress", "Status", "Action"]}
          rows={[
            ["#PRJ-001", "Road Repair Sector 4", "Ward 12", "₹8.5L", "ABC Contractors", <ProgressBar pct={65} />, <Badge status="In Progress" />, <ActionBtns />],
            ["#PRJ-002", "Sewage Line Upgrade", "Ward 7", "₹12L", "XYZ Infra", <ProgressBar pct={30} />, <Badge status="In Progress" />, <ActionBtns />],
            ["#PRJ-003", "Park Development", "Ward 15", "₹4.2L", "Green Works", <ProgressBar pct={90} />, <Badge status="Approved" />, <ActionBtns />],
          ]}
        />
      </div>
    </div>
  );
}

function SanitationPage({ sub }) {
  const titles = {
    "garbage-route": "🗑️ Garbage Route Map & Bin Status",
    "vehicle-track": "🚛 Vehicle Tracking",
    "worker-attend": "👷 Worker Attendance Tracking",
    "daily-report": "🧾 Daily Waste Collection Report",
    "ward-report": "📍 Ward-wise Cleanliness Report",
  };
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: COLORS.text, marginBottom: 20 }}>{titles[sub] || titles["garbage-route"]}</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <StatCard icon="🚛" label="Vehicles Active" value="12/15" sub="Today" color={COLORS.success} />
        <StatCard icon="🗑️" label="Bins Collected" value="284" sub="Today" color={COLORS.info} />
        <StatCard icon="👷" label="Workers Present" value="48/52" sub="Today" color={COLORS.warning} />
        <StatCard icon="🏆" label="Cleanest Ward" value="Ward 7" sub="This Week" color={COLORS.accent2} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: COLORS.text }}>🚛 Vehicle Status</h3>
          <Table
            cols={["Vehicle", "Route", "Driver", "Status"]}
            rows={[
              ["MUN-01", "Ward 1-3", "Ramesh D.", <Badge status="In Progress" />],
              ["MUN-02", "Ward 4-6", "Suresh K.", <Badge status="Approved" />],
              ["MUN-03", "Ward 7-9", "Pradeep M.", <Badge status="Pending" />],
              ["MUN-04", "Ward 10-12", "Vijay S.", <Badge status="In Progress" />],
            ]}
          />
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 14, color: COLORS.text }}>📍 Ward Cleanliness Score</h3>
          {[
            { ward: "Ward 7", score: 94, color: COLORS.success },
            { ward: "Ward 3", score: 87, color: COLORS.success },
            { ward: "Ward 11", score: 79, color: COLORS.info },
            { ward: "Ward 5", score: 62, color: COLORS.warning },
            { ward: "Ward 14", score: 45, color: COLORS.danger },
          ].map(w => (
            <div key={w.ward} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{w.ward}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: w.color }}>{w.score}%</span>
              </div>
              <div style={{ background: "#f1f5f9", borderRadius: 99, height: 7 }}>
                <div style={{ background: w.color, width: `${w.score}%`, height: 7, borderRadius: 99 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComplaintsPage({ sub }) {
  const titles = {
    "register-comp": "🧾 Register Complaint",
    "assign": "⏳ Auto Assign to Officer",
    "timeline": "📅 Resolution Timeline",
    "closure": "✅ Closure Verification",
    "comp-analytics": "📊 Complaint Analytics",
  };
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: COLORS.text, marginBottom: 20 }}>{titles[sub] || titles["register-comp"]}</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <StatCard icon="📞" label="Total Open" value="93" sub="Active" color={COLORS.danger} />
        <StatCard icon="⏳" label="Avg Resolution" value="2.4d" sub="Days" color={COLORS.warning} />
        <StatCard icon="✅" label="Resolved This Month" value="187" sub="Closed" color={COLORS.success} />
        <StatCard icon="⭐" label="Citizen Rating" value="4.1/5" sub="Avg feedback" color={COLORS.accent} />
      </div>
      <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: 15, color: COLORS.text }}>All Complaints</span>
          <div style={{ display: "flex", gap: 8 }}>
            <select style={inputStyle}>
              <option>All Categories</option>
              <option>Road</option>
              <option>Water</option>
              <option>Sanitation</option>
              <option>Street Light</option>
            </select>
            <input placeholder="Search..." style={inputStyle} />
          </div>
        </div>
        <Table
          cols={["Comp. ID", "Citizen", "Category", "Ward", "Date", "Officer", "Rating", "Status", "Action"]}
          rows={[
            ["#CMP-701", "Neha Gupta", "Road Damage", "Ward 4", "Today", "Eng. Sharma", "—", <Badge status="Pending" />, <ActionBtns />],
            ["#CMP-702", "Rohit Jain", "Drainage Block", "Ward 9", "Yesterday", "San. Team B", "⭐⭐⭐⭐", <Badge status="Closed" />, <ActionBtns />],
            ["#CMP-703", "Meena Rao", "Garbage Issue", "Ward 2", "2 days ago", "Sanitation", "⭐⭐⭐", <Badge status="In Progress" />, <ActionBtns />],
            ["#CMP-704", "Vikash Tiwari", "Street Light", "Ward 7", "3 days ago", "Elec. Team", "⭐⭐⭐⭐⭐", <Badge status="Closed" />, <ActionBtns />],
          ]}
        />
      </div>
    </div>
  );
}

function CommunicationPage({ sub }) {
  const titles = {
    "notifications": "🔔 Real-time Notifications",
    "sms-alerts": "📩 SMS / Email / Push Alerts",
    "noticeboard": "📢 Public Notice Board",
    "events": "📆 Event / Meeting Scheduler",
  };
  const notices = [
    { title: "Property Tax Last Date", date: "31 Jan 2025", type: "Urgent", color: COLORS.danger },
    { title: "Ward Committee Meeting - All Wards", date: "25 Jan 2025", type: "Meeting", color: COLORS.info },
    { title: "New Water Connection Camp - Ward 5", date: "22 Jan 2025", type: "Event", color: COLORS.success },
    { title: "Road Closure - Sector 4 (3 days)", date: "20 Jan 2025", type: "Notice", color: COLORS.warning },
  ];
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, color: COLORS.text, marginBottom: 20 }}>{titles[sub] || titles["notifications"]}</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <StatCard icon="🔔" label="Unread Notifications" value="14" sub="Today" color={COLORS.warning} />
        <StatCard icon="📩" label="SMS Sent Today" value="320" sub="Citizens notified" color={COLORS.info} />
        <StatCard icon="📢" label="Active Notices" value="8" sub="On board" color={COLORS.accent} />
        <StatCard icon="📆" label="Upcoming Events" value="3" sub="This week" color={COLORS.success} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, alignItems: "center" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: COLORS.text }}>📢 Notice Board</h3>
            <button style={btnStyle(COLORS.accent)}>+ Add Notice</button>
          </div>
          {notices.map((n, i) => (
            <div key={i} style={{ borderLeft: `3px solid ${n.color}`, paddingLeft: 12, marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{n.title}</span>
                <span style={{ fontSize: 11, background: n.color + "22", color: n.color, padding: "2px 8px", borderRadius: 99, fontWeight: 700 }}>{n.type}</span>
              </div>
              <div style={{ fontSize: 11, color: COLORS.muted, marginTop: 3 }}>{n.date}</div>
            </div>
          ))}
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, alignItems: "center" }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: COLORS.text }}>📆 Upcoming Events</h3>
            <button style={btnStyle(COLORS.info)}>+ Schedule</button>
          </div>
          {[
            { title: "Ward Committee Meeting", date: "25 Jan", time: "11:00 AM", loc: "Council Hall" },
            { title: "Budget Review Meeting", date: "28 Jan", time: "3:00 PM", loc: "Admin Office" },
            { title: "Citizens Grievance Day", date: "30 Jan", time: "10:00 AM", loc: "Municipal HQ" },
          ].map((e, i) => (
            <div key={i} style={{ display: "flex", gap: 14, marginBottom: 14, padding: 12, background: "#f8fafc", borderRadius: 10 }}>
              <div style={{ background: COLORS.primary, color: "#fff", borderRadius: 8, padding: "8px 12px", textAlign: "center", minWidth: 44 }}>
                <div style={{ fontSize: 16, fontWeight: 800 }}>{e.date.split(" ")[0]}</div>
                <div style={{ fontSize: 10 }}>{e.date.split(" ")[1]}</div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text }}>{e.title}</div>
                <div style={{ fontSize: 11, color: COLORS.muted }}>{e.time} • {e.loc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---- Shared Styles ----
const inputStyle = {
  padding: "7px 12px", borderRadius: 8, border: `1px solid ${COLORS.border}`,
  fontSize: 13, color: COLORS.text, outline: "none", background: "#f8fafc",
};
const btnStyle = (bg) => ({
  padding: "7px 14px", borderRadius: 8, border: "none",
  background: bg, color: "#fff", fontSize: 12, fontWeight: 700,
  cursor: "pointer", whiteSpace: "nowrap",
});

function ActionBtns() {
  return (
    <div style={{ display: "flex", gap: 5 }}>
      <button style={{ padding: "3px 8px", fontSize: 11, background: COLORS.info, color: "#fff", borderRadius: 5, border: "none", cursor: "pointer" }}>View</button>
      <button style={{ padding: "3px 8px", fontSize: 11, background: COLORS.success, color: "#fff", borderRadius: 5, border: "none", cursor: "pointer" }}>Approve</button>
      <button style={{ padding: "3px 8px", fontSize: 11, background: COLORS.danger, color: "#fff", borderRadius: 5, border: "none", cursor: "pointer" }}>Reject</button>
    </div>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function MunicipalityAdmin() {
  const [activeModule, setActiveModule] = useState("dashboard");
  const [activeSub, setActiveSub] = useState(null);
  const [expandedNav, setExpandedNav] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleNavClick = (id) => {
    if (id === activeModule) {
      setExpandedNav(expandedNav === id ? null : id);
    } else {
      setActiveModule(id);
      setActiveSub(null);
      setExpandedNav(id);
    }
  };

  const handleSubClick = (moduleId, subId) => {
    setActiveModule(moduleId);
    setActiveSub(subId);
  };

  const renderPage = () => {
    if (activeModule === "dashboard") return <MainDashboard />;
    if (activeModule === "citizen") return <CitizenServicesPage sub={activeSub || "bpas"} />;
    if (activeModule === "finance") return <FinancePage sub={activeSub || "property-tax"} />;
    if (activeModule === "projects") return <ProjectsPage sub={activeSub || "new-project"} />;
    if (activeModule === "sanitation") return <SanitationPage sub={activeSub || "garbage-route"} />;
    if (activeModule === "complaints") return <ComplaintsPage sub={activeSub || "register-comp"} />;
    if (activeModule === "communication") return <CommunicationPage sub={activeSub || "notifications"} />;
    return <MainDashboard />;
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Segoe UI', sans-serif", background: COLORS.bg, overflow: "hidden" }}>
      {/* SIDEBAR */}
      <div style={{
        width: sidebarOpen ? 260 : 64,
        background: COLORS.sidebar,
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease",
        overflow: "hidden",
        flexShrink: 0,
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ padding: "20px 16px", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: COLORS.accent, color: "#fff", width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>🏛️</div>
          {sidebarOpen && (
            <div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 15, lineHeight: 1 }}>SUVIDHA</div>
              <div style={{ color: "#94a3b8", fontSize: 10, marginTop: 2 }}>Municipality Admin</div>
            </div>
          )}
        </div>

        {/* Dashboard link */}
        <div
          onClick={() => { setActiveModule("dashboard"); setActiveSub(null); setExpandedNav(null); }}
          style={{
            padding: "12px 16px",
            display: "flex", alignItems: "center", gap: 12,
            cursor: "pointer",
            background: activeModule === "dashboard" ? "rgba(249,115,22,0.15)" : "transparent",
            borderLeft: activeModule === "dashboard" ? `3px solid ${COLORS.accent}` : "3px solid transparent",
            margin: "8px 0 4px",
          }}
        >
          <span style={{ fontSize: 18 }}>📊</span>
          {sidebarOpen && <span style={{ color: activeModule === "dashboard" ? COLORS.accent : "#cbd5e1", fontSize: 13, fontWeight: 600 }}>Dashboard</span>}
        </div>

        {/* Nav Items */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <div key={item.id}>
              <div
                onClick={() => handleNavClick(item.id)}
                style={{
                  padding: "11px 16px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  cursor: "pointer",
                  background: activeModule === item.id ? "rgba(249,115,22,0.10)" : "transparent",
                  borderLeft: activeModule === item.id ? `3px solid ${COLORS.accent}` : "3px solid transparent",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 17 }}>{item.icon}</span>
                  {sidebarOpen && (
                    <div>
                      <div style={{ color: activeModule === item.id ? COLORS.accent : "#cbd5e1", fontSize: 12, fontWeight: 700 }}>{item.label}</div>
                      <div style={{ color: "#64748b", fontSize: 10 }}>{item.labelHi}</div>
                    </div>
                  )}
                </div>
                {sidebarOpen && (
                  <span style={{ color: "#64748b", fontSize: 10, transform: expandedNav === item.id ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>▶</span>
                )}
              </div>

              {/* Sub Items */}
              {sidebarOpen && expandedNav === item.id && (
                <div style={{ background: "rgba(0,0,0,0.2)", paddingBottom: 4 }}>
                  {item.sub.map(s => (
                    <div
                      key={s.id}
                      onClick={() => handleSubClick(item.id, s.id)}
                      style={{
                        padding: "8px 16px 8px 44px",
                        cursor: "pointer",
                        background: activeSub === s.id && activeModule === item.id ? "rgba(249,115,22,0.15)" : "transparent",
                        display: "flex", alignItems: "center", gap: 8,
                      }}
                    >
                      <span style={{ fontSize: 13 }}>{s.icon}</span>
                      <div>
                        <div style={{ color: activeSub === s.id && activeModule === item.id ? COLORS.accent : "#94a3b8", fontSize: 11, fontWeight: 600 }}>{s.label}</div>
                        <div style={{ color: "#475569", fontSize: 9 }}>{s.labelHi}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Admin Info */}
        {sidebarOpen && (
          <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>👤</div>
            <div>
              <div style={{ color: "#e2e8f0", fontSize: 12, fontWeight: 700 }}>Municipality Admin</div>
              <div style={{ color: "#64748b", fontSize: 10 }}>Nagar Palika, Ujjain</div>
            </div>
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{
          background: "#fff", height: 56,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 24px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
          flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: COLORS.muted }}
            >☰</button>
            <div style={{ fontSize: 13, color: COLORS.muted }}>
              नगर पालिका प्रशासन <span style={{ color: COLORS.border }}>›</span>{" "}
              <span style={{ color: COLORS.text, fontWeight: 600 }}>
                {activeModule === "dashboard" ? "Dashboard" : NAV_ITEMS.find(n => n.id === activeModule)?.label}
                {activeSub && (() => {
                  const mod = NAV_ITEMS.find(n => n.id === activeModule);
                  const s = mod?.sub?.find(s => s.id === activeSub);
                  return s ? ` › ${s.label}` : "";
                })()}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ position: "relative", cursor: "pointer" }}>
              <span style={{ fontSize: 20 }}>🔔</span>
              <span style={{ position: "absolute", top: -2, right: -4, background: COLORS.danger, color: "#fff", borderRadius: 99, fontSize: 9, padding: "1px 4px", fontWeight: 800 }}>14</span>
            </div>
            <div style={{ fontSize: 13, color: COLORS.muted }}>🏛️ Nagar Palika Ujjain</div>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: COLORS.primary, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 700 }}>MA</div>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
