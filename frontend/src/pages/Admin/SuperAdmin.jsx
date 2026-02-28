import { useState } from "react";

// ============================================================
// SUVIDHA — SUPER ADMIN DASHBOARD
// Premium Black Theme — Master Control
// ============================================================

const C = {
  bg: "#0a0a0f",
  sidebar: "#0d0d14",
  card: "#13131e",
  cardHover: "#1a1a2e",
  border: "#1e1e30",
  borderLight: "#2a2a40",
  text: "#f0f0ff",
  muted: "#6b6b8a",
  accent: "#00d4ff",
  accentGlow: "rgba(0,212,255,0.15)",
  gold: "#ffd700",
  goldGlow: "rgba(255,215,0,0.12)",
  success: "#00e676",
  danger: "#ff4757",
  warning: "#ffa502",
  purple: "#a855f7",
  electricity: "#fbbf24",
  gas: "#34d399",
  municipality: "#60a5fa",
};

const glowStyle = (color) => ({
  boxShadow: `0 0 20px ${color}, 0 0 40px ${color}33`,
});

// ---- Nav Items ----
const NAV = [
  { id: "dashboard", icon: "⬡", label: "Dashboard", labelHi: "डैशबोर्ड" },
  { id: "kiosks", icon: "◈", label: "Kiosk Monitor", labelHi: "कियोस्क निगरानी" },
  { id: "departments", icon: "◉", label: "Departments", labelHi: "विभाग" },
  { id: "payments", icon: "◎", label: "Payment Monitor", labelHi: "भुगतान" },
  { id: "analytics", icon: "◈", label: "Analytics & Reports", labelHi: "विश्लेषण" },
  { id: "config", icon: "⊙", label: "System Config", labelHi: "सिस्टम" },
];

// ---- Stat Card ----
function StatCard({ icon, label, value, sub, color, glow }) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${C.border}`,
      borderRadius: 16,
      padding: "22px 24px",
      display: "flex",
      alignItems: "center",
      gap: 18,
      flex: "1 1 180px",
      position: "relative",
      overflow: "hidden",
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = `0 8px 30px ${color}22`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}
    >
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: 80, height: 80,
        background: `radial-gradient(circle at top right, ${color}18, transparent 70%)`,
      }} />
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: `${color}15`,
        border: `1px solid ${color}30`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, flexShrink: 0,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: C.text, letterSpacing: -1 }}>{value}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: C.text, opacity: 0.8 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>{sub}</div>}
      </div>
      <div style={{
        position: "absolute", bottom: 0, left: 0,
        height: 2, width: "100%",
        background: `linear-gradient(90deg, ${color}, transparent)`,
      }} />
    </div>
  );
}

// ---- Badge ----
function Badge({ status }) {
  const map = {
    Online: { bg: `${C.success}20`, color: C.success, dot: true },
    Offline: { bg: `${C.danger}20`, color: C.danger, dot: true },
    Active: { bg: `${C.accent}20`, color: C.accent, dot: true },
    Pending: { bg: `${C.warning}20`, color: C.warning, dot: false },
    Completed: { bg: `${C.success}20`, color: C.success, dot: false },
    Failed: { bg: `${C.danger}20`, color: C.danger, dot: false },
    Maintenance: { bg: `${C.purple}20`, color: C.purple, dot: true },
  };
  const s = map[status] || { bg: `${C.muted}20`, color: C.muted, dot: false };
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "3px 10px", borderRadius: 99,
      fontSize: 11, fontWeight: 700,
      display: "inline-flex", alignItems: "center", gap: 5,
    }}>
      {s.dot && <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.color, display: "inline-block" }} />}
      {status}
    </span>
  );
}

// ---- Table ----
function Table({ cols, rows }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${C.border}` }}>
            {cols.map(c => (
              <th key={c} style={{
                padding: "10px 16px", textAlign: "left",
                color: C.muted, fontWeight: 700, fontSize: 11,
                textTransform: "uppercase", letterSpacing: 1,
              }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{
              borderBottom: `1px solid ${C.border}`,
              transition: "background 0.15s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = C.cardHover}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {r.map((cell, j) => (
                <td key={j} style={{ padding: "12px 16px", color: C.text }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ActionBtn({ label, color }) {
  return (
    <button style={{
      padding: "4px 10px", fontSize: 11, fontWeight: 700,
      background: `${color}20`, color: color,
      border: `1px solid ${color}40`,
      borderRadius: 6, cursor: "pointer",
    }}>{label}</button>
  );
}

// ============================================================
// PAGES
// ============================================================

function DashboardPage() {
  const stats = [
    { icon: "🖥️", label: "Total Kiosks", value: "48", sub: "Across all zones", color: C.accent },
    { icon: "✅", label: "Online Now", value: "42", sub: "6 offline", color: C.success },
    { icon: "💰", label: "Today's Revenue", value: "₹2.4L", sub: "All departments", color: C.gold },
    { icon: "📋", label: "Pending Tasks", value: "186", sub: "Needs attention", color: C.warning },
    { icon: "👥", label: "Citizens Served", value: "1,842", sub: "Today", color: C.purple },
    { icon: "⚠️", label: "System Alerts", value: "7", sub: "Active alerts", color: C.danger },
  ];

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
          <div style={{ width: 4, height: 28, background: `linear-gradient(180deg, ${C.accent}, ${C.purple})`, borderRadius: 99 }} />
          <h2 style={{ fontSize: 24, fontWeight: 900, color: C.text, margin: 0, letterSpacing: -0.5 }}>
            System Overview
          </h2>
        </div>
        <p style={{ color: C.muted, fontSize: 13, marginLeft: 16 }}>SUVIDHA Master Control — Super Admin</p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Department Quick Status */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 24 }}>
        {[
          { name: "Electricity Dept.", icon: "⚡", color: C.electricity, pending: 42, online: 16, revenue: "₹84,200" },
          { name: "Gas Department", icon: "🔥", color: C.gas, pending: 38, online: 14, revenue: "₹62,400" },
          { name: "Municipality", icon: "🏛️", color: C.municipality, pending: 106, online: 12, revenue: "₹94,800" },
        ].map(d => (
          <div key={d.name} style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 16, padding: 20,
            borderTop: `2px solid ${d.color}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 24 }}>{d.icon}</span>
              <div>
                <div style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>{d.name}</div>
                <div style={{ color: C.muted, fontSize: 11 }}>Department Status</div>
              </div>
            </div>
            {[
              { label: "Kiosks Online", value: d.online, color: C.success },
              { label: "Pending Tasks", value: d.pending, color: C.warning },
              { label: "Revenue Today", value: d.revenue, color: d.color },
            ].map(row => (
              <div key={row.label} style={{
                display: "flex", justifyContent: "space-between",
                padding: "8px 0", borderBottom: `1px solid ${C.border}`,
              }}>
                <span style={{ color: C.muted, fontSize: 12 }}>{row.label}</span>
                <span style={{ color: row.color, fontWeight: 700, fontSize: 12 }}>{row.value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
        <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🕐 Recent System Activity</h3>
        <Table
          cols={["Time", "Event", "Department", "Kiosk", "Status"]}
          rows={[
            ["10:42 AM", "New connection approved", "Electricity", "KSK-014", <Badge status="Completed" />],
            ["10:38 AM", "Payment received ₹4,200", "Municipality", "KSK-027", <Badge status="Completed" />],
            ["10:31 AM", "Kiosk went offline", "Gas", "KSK-009", <Badge status="Offline" />],
            ["10:24 AM", "Complaint registered", "Municipality", "KSK-031", <Badge status="Pending" />],
            ["10:18 AM", "System backup completed", "All", "SERVER", <Badge status="Completed" />],
          ]}
        />
      </div>
    </div>
  );
}

function KioskPage() {
  const kiosks = [
    { id: "KSK-001", location: "Collectorate Gate", zone: "Zone A", dept: "All", uptime: "99.2%", today: "142", status: "Online" },
    { id: "KSK-002", location: "Railway Station", zone: "Zone A", dept: "All", uptime: "98.7%", today: "198", status: "Online" },
    { id: "KSK-003", location: "Bus Stand", zone: "Zone B", dept: "All", uptime: "97.1%", today: "167", status: "Online" },
    { id: "KSK-004", location: "Mahakal Mandir", zone: "Zone B", dept: "All", uptime: "99.8%", today: "221", status: "Online" },
    { id: "KSK-009", location: "Freeganj Market", zone: "Zone C", dept: "Gas", uptime: "82.3%", today: "0", status: "Offline" },
    { id: "KSK-015", location: "Civil Hospital", zone: "Zone A", dept: "All", uptime: "94.5%", today: "89", status: "Maintenance" },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 4, height: 28, background: `linear-gradient(180deg, ${C.accent}, ${C.purple})`, borderRadius: 99 }} />
        <h2 style={{ fontSize: 22, fontWeight: 900, color: C.text, margin: 0 }}>Kiosk Monitor</h2>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <StatCard icon="🖥️" label="Total Kiosks" value="48" color={C.accent} />
        <StatCard icon="✅" label="Online" value="42" color={C.success} />
        <StatCard icon="🔴" label="Offline" value="4" color={C.danger} />
        <StatCard icon="🔧" label="Maintenance" value="2" color={C.purple} />
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
          <span style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>All Kiosks</span>
          <div style={{ display: "flex", gap: 8 }}>
            <input placeholder="Search kiosk..." style={inputSt} />
            <select style={inputSt}>
              <option>All Zones</option>
              <option>Zone A</option>
              <option>Zone B</option>
              <option>Zone C</option>
            </select>
          </div>
        </div>
        <Table
          cols={["Kiosk ID", "Location", "Zone", "Uptime", "Today's Txns", "Status", "Action"]}
          rows={kiosks.map(k => [
            <span style={{ color: C.accent, fontWeight: 700 }}>{k.id}</span>,
            k.location, k.zone, k.uptime, k.today,
            <Badge status={k.status} />,
            <div style={{ display: "flex", gap: 5 }}>
              <ActionBtn label="View" color={C.accent} />
              <ActionBtn label="Restart" color={C.warning} />
            </div>
          ])}
        />
      </div>
    </div>
  );
}

function DepartmentsPage() {
  const [selected, setSelected] = useState(null);

  const depts = [
    {
      id: "electricity",
      name: "Electricity Department",
      nameHi: "विद्युत विभाग",
      icon: "⚡",
      color: C.electricity,
      desc: "Power connections, bill payments, complaints",
      stats: { kiosks: 16, pending: 42, resolved: 284, revenue: "₹84,200" },
      admins: ["admin@electricity.gov.in"],
      recentActivity: [
        { action: "New connection approved", user: "Ramesh Kumar", time: "10 min ago" },
        { action: "Bill payment ₹3,200", user: "Sunita Devi", time: "24 min ago" },
        { action: "Complaint #ELC-491 closed", user: "System", time: "1 hr ago" },
      ]
    },
    {
      id: "gas",
      name: "Gas Department",
      nameHi: "गैस विभाग",
      icon: "🔥",
      color: C.gas,
      desc: "Gas connections, delivery tracking, safety",
      stats: { kiosks: 14, pending: 38, resolved: 196, revenue: "₹62,400" },
      admins: ["admin@gas.gov.in"],
      recentActivity: [
        { action: "Gas connection approved", user: "Ajay Singh", time: "15 min ago" },
        { action: "Delivery complaint #GAS-201", user: "Priya Sharma", time: "42 min ago" },
        { action: "KSK-009 went offline", user: "System Alert", time: "2 hr ago" },
      ]
    },
    {
      id: "municipality",
      name: "Municipality",
      nameHi: "नगर पालिका",
      icon: "🏛️",
      color: C.municipality,
      desc: "Property tax, civic complaints, certificates",
      stats: { kiosks: 12, pending: 106, resolved: 412, revenue: "₹94,800" },
      admins: ["admin@municipality.gov.in"],
      recentActivity: [
        { action: "Building plan approved #BPA-042", user: "Mohan Lal", time: "8 min ago" },
        { action: "Property tax ₹4,200 collected", user: "Kavita Singh", time: "31 min ago" },
        { action: "Grievance #GR-601 assigned", user: "System", time: "1.5 hr ago" },
      ]
    },
  ];

  if (selected) {
    const d = depts.find(x => x.id === selected);
    return (
      <div>
        <button
          onClick={() => setSelected(null)}
          style={{ background: `${C.accent}15`, border: `1px solid ${C.accent}30`, color: C.accent, padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 700, marginBottom: 20 }}
        >← Back to Departments</button>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: `${d.color}15`, border: `2px solid ${d.color}40`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28,
          }}>{d.icon}</div>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: C.text, margin: 0 }}>{d.name}</h2>
            <p style={{ color: C.muted, fontSize: 13, margin: "4px 0 0" }}>{d.nameHi} • {d.desc}</p>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
          <StatCard icon="🖥️" label="Kiosks Active" value={d.stats.kiosks} color={C.accent} />
          <StatCard icon="⏳" label="Pending Tasks" value={d.stats.pending} color={C.warning} />
          <StatCard icon="✅" label="Resolved Today" value={d.stats.resolved} color={C.success} />
          <StatCard icon="💰" label="Revenue Today" value={d.stats.revenue} color={d.color} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
            <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🕐 Recent Activity</h3>
            {d.recentActivity.map((a, i) => (
              <div key={i} style={{
                display: "flex", gap: 12, marginBottom: 14,
                paddingBottom: 14, borderBottom: i < d.recentActivity.length - 1 ? `1px solid ${C.border}` : "none"
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: d.color, marginTop: 5, flexShrink: 0,
                  boxShadow: `0 0 6px ${d.color}`,
                }} />
                <div>
                  <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{a.action}</div>
                  <div style={{ color: C.muted, fontSize: 11, marginTop: 3 }}>{a.user} • {a.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
            <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📊 Performance</h3>
            {[
              { label: "Resolution Rate", value: 87, color: C.success },
              { label: "Kiosk Uptime", value: 94, color: C.accent },
              { label: "Payment Success", value: 98, color: d.color },
              { label: "Citizen Satisfaction", value: 82, color: C.purple },
            ].map(p => (
              <div key={p.label} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: C.muted, fontSize: 12 }}>{p.label}</span>
                  <span style={{ color: p.color, fontSize: 12, fontWeight: 700 }}>{p.value}%</span>
                </div>
                <div style={{ background: C.border, borderRadius: 99, height: 5 }}>
                  <div style={{ background: p.color, width: `${p.value}%`, height: 5, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
        <div style={{ width: 4, height: 28, background: `linear-gradient(180deg, ${C.accent}, ${C.purple})`, borderRadius: 99 }} />
        <h2 style={{ fontSize: 22, fontWeight: 900, color: C.text, margin: 0 }}>Departments</h2>
      </div>
      <p style={{ color: C.muted, fontSize: 13, marginBottom: 28, marginLeft: 16 }}>Click on a department to view details</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
        {depts.map(d => (
          <div
            key={d.id}
            onClick={() => setSelected(d.id)}
            style={{
              background: C.card,
              border: `1px solid ${C.border}`,
              borderRadius: 20,
              padding: 28,
              cursor: "pointer",
              transition: "all 0.25s",
              position: "relative",
              overflow: "hidden",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.border = `1px solid ${d.color}50`;
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = `0 12px 40px ${d.color}20`;
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = `1px solid ${C.border}`;
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div style={{
              position: "absolute", top: 0, right: 0,
              width: 120, height: 120,
              background: `radial-gradient(circle at top right, ${d.color}12, transparent 70%)`,
            }} />

            <div style={{
              width: 64, height: 64, borderRadius: 18,
              background: `${d.color}15`,
              border: `2px solid ${d.color}30`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, marginBottom: 18,
            }}>{d.icon}</div>

            <h3 style={{ color: C.text, fontSize: 18, fontWeight: 800, margin: "0 0 4px" }}>{d.name}</h3>
            <p style={{ color: d.color, fontSize: 12, fontWeight: 600, margin: "0 0 4px" }}>{d.nameHi}</p>
            <p style={{ color: C.muted, fontSize: 12, margin: "0 0 20px" }}>{d.desc}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { label: "Kiosks", value: d.stats.kiosks, color: C.accent },
                { label: "Pending", value: d.stats.pending, color: C.warning },
                { label: "Resolved", value: d.stats.resolved, color: C.success },
                { label: "Revenue", value: d.stats.revenue, color: d.color },
              ].map(s => (
                <div key={s.label} style={{
                  background: `${s.color}08`,
                  border: `1px solid ${s.color}20`,
                  borderRadius: 10, padding: "10px 12px",
                }}>
                  <div style={{ color: s.color, fontSize: 16, fontWeight: 800 }}>{s.value}</div>
                  <div style={{ color: C.muted, fontSize: 10, marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 16, padding: "10px 14px",
              background: `${d.color}10`, borderRadius: 10,
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <span style={{ color: d.color, fontSize: 12, fontWeight: 700 }}>View Department →</span>
              <Badge status="Active" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PaymentsPage() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 4, height: 28, background: `linear-gradient(180deg, ${C.gold}, ${C.accent})`, borderRadius: 99 }} />
        <h2 style={{ fontSize: 22, fontWeight: 900, color: C.text, margin: 0 }}>Payment Monitor</h2>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <StatCard icon="💰" label="Total Today" value="₹2.4L" sub="All Departments" color={C.gold} />
        <StatCard icon="✅" label="Successful" value="1,284" sub="Transactions" color={C.success} />
        <StatCard icon="❌" label="Failed" value="23" sub="Need attention" color={C.danger} />
        <StatCard icon="⏳" label="Pending" value="47" sub="Processing" color={C.warning} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
            <span style={{ color: C.text, fontWeight: 700, fontSize: 14 }}>Recent Transactions</span>
            <div style={{ display: "flex", gap: 8 }}>
              <input placeholder="Search..." style={inputSt} />
              <select style={inputSt}>
                <option>All Depts</option>
                <option>Electricity</option>
                <option>Gas</option>
                <option>Municipality</option>
              </select>
            </div>
          </div>
          <Table
            cols={["Txn ID", "Citizen", "Dept.", "Amount", "Mode", "Time", "Status"]}
            rows={[
              ["#TXN-8841", "Ramesh Kumar", "⚡ Electricity", "₹4,200", "UPI", "10:42 AM", <Badge status="Completed" />],
              ["#TXN-8842", "Sunita Devi", "🏛️ Municipality", "₹2,800", "Card", "10:38 AM", <Badge status="Completed" />],
              ["#TXN-8843", "Ajay Singh", "🔥 Gas", "₹850", "NetBanking", "10:31 AM", <Badge status="Failed" />],
              ["#TXN-8844", "Pooja Sharma", "⚡ Electricity", "₹6,500", "UPI", "10:24 AM", <Badge status="Completed" />],
              ["#TXN-8845", "Mohan Lal", "🏛️ Municipality", "₹1,400", "UPI", "10:18 AM", <Badge status="Pending" />],
            ]}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
            <h3 style={{ color: C.text, fontSize: 13, fontWeight: 700, marginBottom: 16 }}>💰 Revenue by Dept.</h3>
            {[
              { name: "Electricity", icon: "⚡", value: "₹84,200", pct: 72, color: C.electricity },
              { name: "Gas", icon: "🔥", value: "₹62,400", pct: 52, color: C.gas },
              { name: "Municipality", icon: "🏛️", value: "₹94,800", pct: 88, color: C.municipality },
            ].map(d => (
              <div key={d.name} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ color: C.muted, fontSize: 12 }}>{d.icon} {d.name}</span>
                  <span style={{ color: d.color, fontSize: 12, fontWeight: 700 }}>{d.value}</span>
                </div>
                <div style={{ background: C.border, borderRadius: 99, height: 5 }}>
                  <div style={{ background: d.color, width: `${d.pct}%`, height: 5, borderRadius: 99 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
            <h3 style={{ color: C.text, fontSize: 13, fontWeight: 700, marginBottom: 14 }}>💳 Payment Modes</h3>
            {[
              { mode: "UPI", pct: 58, color: C.accent },
              { mode: "Card", pct: 24, color: C.purple },
              { mode: "NetBanking", pct: 18, color: C.gold },
            ].map(m => (
              <div key={m.mode} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ color: C.muted, fontSize: 12, width: 80 }}>{m.mode}</span>
                <div style={{ flex: 1, background: C.border, borderRadius: 99, height: 5 }}>
                  <div style={{ background: m.color, width: `${m.pct}%`, height: 5, borderRadius: 99 }} />
                </div>
                <span style={{ color: m.color, fontSize: 12, fontWeight: 700, width: 32, textAlign: "right" }}>{m.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsPage() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 4, height: 28, background: `linear-gradient(180deg, ${C.purple}, ${C.accent})`, borderRadius: 99 }} />
        <h2 style={{ fontSize: 22, fontWeight: 900, color: C.text, margin: 0 }}>Analytics & Reports</h2>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 24 }}>
        <StatCard icon="👥" label="Citizens Served" value="48,284" sub="This Month" color={C.purple} />
        <StatCard icon="📋" label="Total Transactions" value="12,841" sub="This Month" color={C.accent} />
        <StatCard icon="💰" label="Monthly Revenue" value="₹42.8L" sub="All Depts" color={C.gold} />
        <StatCard icon="⭐" label="Avg Satisfaction" value="4.2/5" sub="Citizen Rating" color={C.success} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
          <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 16 }}>📈 Monthly Trend (Transactions)</h3>
          {["Oct", "Nov", "Dec", "Jan"].map((m, i) => {
            const vals = [8200, 9400, 11200, 12841];
            const max = 14000;
            const pct = (vals[i] / max) * 100;
            return (
              <div key={m} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ color: C.muted, fontSize: 12 }}>{m} 2024</span>
                  <span style={{ color: C.accent, fontSize: 12, fontWeight: 700 }}>{vals[i].toLocaleString()}</span>
                </div>
                <div style={{ background: C.border, borderRadius: 99, height: 7 }}>
                  <div style={{ background: `linear-gradient(90deg, ${C.accent}, ${C.purple})`, width: `${pct}%`, height: 7, borderRadius: 99 }} />
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
          <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, marginBottom: 16 }}>🏆 Top Performing Kiosks</h3>
          <Table
            cols={["Rank", "Kiosk", "Location", "Txns"]}
            rows={[
              [<span style={{ color: C.gold }}>🥇</span>, "KSK-004", "Mahakal Mandir", "221"],
              [<span style={{ color: "#c0c0c0" }}>🥈</span>, "KSK-002", "Railway Station", "198"],
              [<span style={{ color: "#cd7f32" }}>🥉</span>, "KSK-003", "Bus Stand", "167"],
              ["4", "KSK-001", "Collectorate", "142"],
              ["5", "KSK-007", "Dewas Gate", "138"],
            ]}
          />
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
          <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: 0 }}>📑 Generate Reports</h3>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[
            { label: "Daily Revenue Report", icon: "💰", color: C.gold },
            { label: "Kiosk Performance", icon: "🖥️", color: C.accent },
            { label: "Complaint Summary", icon: "📋", color: C.warning },
            { label: "Citizen Analytics", icon: "👥", color: C.purple },
          ].map(r => (
            <button key={r.label} style={{
              background: `${r.color}10`, border: `1px solid ${r.color}30`,
              borderRadius: 12, padding: "16px 14px", cursor: "pointer",
              textAlign: "center", transition: "all 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = `${r.color}20`}
              onMouseLeave={e => e.currentTarget.style.background = `${r.color}10`}
            >
              <div style={{ fontSize: 24, marginBottom: 8 }}>{r.icon}</div>
              <div style={{ color: r.color, fontSize: 12, fontWeight: 700 }}>{r.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ConfigPage() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ width: 4, height: 28, background: `linear-gradient(180deg, ${C.warning}, ${C.danger})`, borderRadius: 99 }} />
        <h2 style={{ fontSize: 22, fontWeight: 900, color: C.text, margin: 0 }}>System Configuration</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {[
          {
            title: "🔐 Security Settings", color: C.danger,
            items: ["JWT Token Expiry: 24 hrs", "OTP Length: 6 digits", "Max Login Attempts: 5", "Session Timeout: 30 min"]
          },
          {
            title: "🖥️ Kiosk Configuration", color: C.accent,
            items: ["Auto Restart: Enabled", "Idle Timeout: 5 min", "Heartbeat Interval: 30s", "Log Retention: 30 days"]
          },
          {
            title: "💳 Payment Settings", color: C.gold,
            items: ["Payment Gateway: Razorpay", "UPI Enabled: Yes", "Card Payments: Yes", "Receipt Auto-send: SMS + Email"]
          },
          {
            title: "🔔 Notification Config", color: C.purple,
            items: ["SMS Provider: Textlocal", "Email: SMTP Configured", "Push Notifications: Active", "Alert Threshold: 5 min"]
          },
        ].map(sec => (
          <div key={sec.title} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, alignItems: "center" }}>
              <h3 style={{ color: C.text, fontSize: 14, fontWeight: 700, margin: 0 }}>{sec.title}</h3>
              <button style={{
                background: `${sec.color}15`, border: `1px solid ${sec.color}30`,
                color: sec.color, padding: "5px 12px", borderRadius: 8,
                fontSize: 11, fontWeight: 700, cursor: "pointer",
              }}>Edit</button>
            </div>
            {sec.items.map((item, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0", borderBottom: i < sec.items.length - 1 ? `1px solid ${C.border}` : "none",
              }}>
                <span style={{ color: C.muted, fontSize: 12 }}>{item.split(":")[0]}</span>
                <span style={{ color: sec.color, fontSize: 12, fontWeight: 700 }}>{item.split(":")[1]?.trim()}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Shared Styles ----
const inputSt = {
  padding: "7px 12px", borderRadius: 8,
  border: `1px solid ${C.border}`,
  background: C.cardHover,
  color: C.text,
  fontSize: 12, outline: "none",
};

// ============================================================
// MAIN APP
// ============================================================
export default function SuperAdmin() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderPage = () => {
    if (active === "dashboard") return <DashboardPage />;
    if (active === "kiosks") return <KioskPage />;
    if (active === "departments") return <DepartmentsPage />;
    if (active === "payments") return <PaymentsPage />;
    if (active === "analytics") return <AnalyticsPage />;
    if (active === "config") return <ConfigPage />;
    return <DashboardPage />;
  };

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, fontFamily: "'Segoe UI', sans-serif", overflow: "hidden" }}>

      {/* SIDEBAR */}
      <div style={{
        width: sidebarOpen ? 240 : 62,
        background: C.sidebar,
        borderRight: `1px solid ${C.border}`,
        display: "flex", flexDirection: "column",
        transition: "width 0.25s ease",
        overflow: "hidden", flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{
          padding: "20px 16px",
          borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10, flexShrink: 0,
            background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 900, color: "#000",
            ...glowStyle(C.accent + "40"),
          }}>S</div>
          {sidebarOpen && (
            <div>
              <div style={{ color: C.text, fontWeight: 900, fontSize: 16, letterSpacing: 1 }}>SUVIDHA</div>
              <div style={{
                color: C.accent, fontSize: 9, fontWeight: 700,
                letterSpacing: 2, textTransform: "uppercase",
              }}>Super Admin</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
          {NAV.map(item => (
            <div
              key={item.id}
              onClick={() => setActive(item.id)}
              style={{
                padding: sidebarOpen ? "12px 16px" : "12px",
                display: "flex", alignItems: "center", gap: 12,
                cursor: "pointer",
                background: active === item.id ? `${C.accent}12` : "transparent",
                borderLeft: active === item.id ? `2px solid ${C.accent}` : "2px solid transparent",
                borderRight: active === item.id ? `1px solid ${C.accent}20` : "1px solid transparent",
                transition: "all 0.15s",
                justifyContent: sidebarOpen ? "flex-start" : "center",
              }}
              onMouseEnter={e => { if (active !== item.id) e.currentTarget.style.background = `${C.accent}08`; }}
              onMouseLeave={e => { if (active !== item.id) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{
                fontSize: 18, color: active === item.id ? C.accent : C.muted,
                fontFamily: "monospace",
              }}>{item.icon}</span>
              {sidebarOpen && (
                <div>
                  <div style={{ color: active === item.id ? C.accent : C.text, fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                  <div style={{ color: C.muted, fontSize: 10 }}>{item.labelHi}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Admin info */}
        {sidebarOpen && (
          <div style={{ padding: "14px 16px", borderTop: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, fontWeight: 900, color: "#000",
              }}>SA</div>
              <div>
                <div style={{ color: C.text, fontSize: 12, fontWeight: 700 }}>Super Admin</div>
                <div style={{ color: C.muted, fontSize: 10 }}>superadmin@suvidha.gov.in</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{
          height: 56, background: C.card,
          borderBottom: `1px solid ${C.border}`,
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px", flexShrink: 0,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ background: "none", border: "none", color: C.muted, fontSize: 18, cursor: "pointer" }}
            >☰</button>
            <span style={{ color: C.muted, fontSize: 12 }}>
              SUVIDHA <span style={{ color: C.border }}>›</span>{" "}
              <span style={{ color: C.text, fontWeight: 600 }}>
                {NAV.find(n => n.id === active)?.label}
              </span>
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ position: "relative", cursor: "pointer" }}>
              <span style={{ fontSize: 18 }}>🔔</span>
              <span style={{
                position: "absolute", top: -3, right: -5,
                background: C.danger, color: "#fff",
                borderRadius: 99, fontSize: 9, padding: "1px 4px", fontWeight: 800,
              }}>7</span>
            </div>
            <div style={{
              padding: "5px 12px", borderRadius: 8,
              background: `${C.success}15`, border: `1px solid ${C.success}30`,
              color: C.success, fontSize: 11, fontWeight: 700,
              display: "flex", alignItems: "center", gap: 6,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.success, display: "inline-block" }} />
              System Online
            </div>
            <div style={{
              width: 32, height: 32, borderRadius: "50%",
              background: `linear-gradient(135deg, ${C.accent}, ${C.purple})`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 900, color: "#000",
            }}>SA</div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
