import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import TopBar from "../components/TopBar";
import { adminLogin } from "../services/authService";

function AdminLogin() {
  const navigate = useNavigate();

  const [username, setUsername]       = useState("");
  const [password, setPassword]       = useState("");
  const [role, setRole]               = useState("dept_admin");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError("Please enter both Officer ID and Password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await adminLogin(username, password, role);

      if (response.success) {
        // Redirect based on role
        if (role === "super_admin") {
          navigate("/super-admin/dashboard");
        } else {
          navigate("/admin/dashboard");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef2f7] flex flex-col">
      <TopBar />

      <div className="flex flex-1 justify-center items-center">
        <div className="bg-white w-[520px] p-10 rounded-2xl shadow-2xl border">

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#0b3c5d]">
              Officer Control Panel
            </h2>
            <p className="text-gray-500">Authorized Personnel Only</p>
          </div>

          {/* Security badge */}
          <div className="bg-[#0b3c5d] text-white p-4 rounded-lg mb-6 text-center">
            🔒 Secure Government Access Portal
            <div className="text-xs mt-1 opacity-80">
              Smart City SUVIDHA Management System
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-semibold">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            {/* Role Selection */}
            <label className="text-sm font-semibold text-gray-600">
              Login As
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4 mt-1 bg-white text-gray-700 font-semibold"
            >
              <option value="dept_admin">Department Admin</option>
              <option value="super_admin">Super Admin (State/District)</option>
            </select>

            {/* Username */}
            <label className="text-sm font-semibold text-gray-600">
              Officer ID
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setError(""); }}
              placeholder="Enter Officer ID"
              className="w-full p-3 border rounded-lg mb-4 mt-1 focus:outline-none focus:border-[#0b3c5d]"
            />

            {/* Password */}
            <label className="text-sm font-semibold text-gray-600">
              Password
            </label>
            <div className="relative mt-1 mb-6">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter Password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:border-[#0b3c5d] pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0b3c5d] text-white py-3 rounded-lg text-lg hover:bg-[#092c44] shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading
                ? <><Loader2 className="animate-spin" size={20} /> Verifying...</>
                : "Access Control Panel →"
              }
            </button>
          </form>

          {/* Warning */}
          <p className="text-xs text-red-500 mt-6 text-center">
            Unauthorized access is strictly prohibited and monitored.
          </p>

          {/* Back to Kiosk */}
          <button
            onClick={() => navigate("/login")}
            className="w-full mt-3 text-gray-400 text-sm hover:text-[#0b3c5d] transition-colors"
          >
            ← Back to Citizen Login
          </button>

        </div>
      </div>
    </div>
  );
}

export default AdminLogin;