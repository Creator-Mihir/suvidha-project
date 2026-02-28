import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Water from "./pages/water/Water";
import Electricity from "./pages/Electricity/Electricity";
import GasServicesKiosk from "./pages/gas/Gas";
import SuvidhaAI from './components/KioskUI/SuvidhaAI';
import Municipality from "./pages/Municipality/Municipality";
import WelcomeSetup from "./pages/WelcomeSetup";
 import ElectricityAdmin  from './pages/Admin/ElectricityAdmin';
 import GasAdmin          from './pages/Admin/GasAdmin';
 import MunicipalityAdmin from './pages/Admin/MunicipalityAdmin';
import SuperAdmin        from './pages/Admin/SuperAdmin';


function App() {
  return (
    <BrowserRouter>
    <SuvidhaAI />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
       <Route path="/dashboard" element={<Dashboard />} />
       <Route path="/water" element={<Water />} />
       <Route path="/gas" element={<GasServicesKiosk/>} />
       <Route path="/municipality" element={<Municipality />} />
       <Route path="/Adminlogin" element={<AdminLogin />} />
       <Route path="/welcome-setup" element={<WelcomeSetup />} />
       <Route path="/admin/electricity"  element={<ElectricityAdmin />} />
         <Route path="/admin/gas"          element={<GasAdmin />} />
      
        <Route path="/admin/municipality" element={<MunicipalityAdmin />} /> 
        <Route path="/admin/super"        element={<SuperAdmin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/electricity" element={<Electricity />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
