import TopBar from "../components/TopBar";


function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#eef2f7] flex flex-col">
      <TopBar />
      <div className="p-6">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#0b3c5d]">
              State Control Dashboard
            </h1>
            <p className="text-gray-500">
              Smart Governance • SUVIDHA Kiosk Network
            </p>
          </div>
          
          <div className="text-right">
            <p className="font-semibold text-xl ">Officer: Mihir </p>
            <p className="text-sm text-gray-500">
              {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        {/* Live Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">

          <StatCard title="Citizens Served Today" value="1,284" icon="👥" />
          <StatCard title="Active Complaints" value="86" icon="🙋‍♂️" />
          <StatCard title="Electricity Requests" value="342" icon="💡" />
          <StatCard title="Water Requests" value="210" icon="💦" />

        </div>

        {/* Main Panels */}
        <div className="grid grid-cols-3 gap-6 flex-wrap">

          <Panel title="⚡ Electricity Department">
            <p>New Connection Requests: 23</p>
            <p>Pending Bills: 41</p>
            <button className="btn">Open Panel</button>
          </Panel>

          <Panel title="💧 Water Department">
            <p>New Connections: 12</p>
            <p>Leak Complaints: 7</p>
            <button className="btn">Open Panel</button>
          </Panel>

          <Panel title="🚨 Complaints Control">
            <p>Total Complaints: 86</p>
            <p>Resolved Today: 24</p>
            <button className="btn">View Complaints</button>
          </Panel>

          <Panel title="🖥 Kiosk Monitoring">
            <p>Online Kiosks: 42</p>
            <p>Offline Kiosks: 3</p>
            <button className="btn">Monitor</button>
          </Panel>

          <Panel title="📊 Analytics">
            <p>Daily Users Graph</p>
            <button className="btn">View Analytics</button>
          </Panel>

          <Panel title="👮 Officer Controls">
            <p>Add Operator</p>
            <p>Manage Staff</p>
            <button className="btn">Manage</button>
          </Panel>

        </div>

      </div>
      

     
    </div>
  );
}

/* Reusable Stat Card */
function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md flex items-center gap-4">
      <div className="text-4xl">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h2 className="text-2xl font-bold text-[#0b3c5d]">{value}</h2>
      </div>
    </div>
  );
}

/* Reusable Panel */
function Panel({ title, children }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h3 className="text-lg font-bold text-[#0b3c5d] mb-3">{title}</h3>
      <div className="text-gray-600 mb-4">{children}</div>
    </div>
  );
}

export default AdminDashboard;
