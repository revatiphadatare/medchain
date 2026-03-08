import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./context/AuthContext";
import DashboardLayout from "./components/layouts/DashboardLayout";

// Public pages
import HomePage     from "./pages/public/HomePage";
import AboutPage    from "./pages/public/AboutPage";
import ServicesPage from "./pages/public/ServicesPage";
import ContactPage  from "./pages/public/ContactPage";

// Auth pages
import LoginPage    from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

// Role dashboards
import SuperAdminDashboard  from "./pages/dashboard/super-admin";
import StoreOwnerDashboard  from "./pages/dashboard/store-owner";
import PharmacistDashboard  from "./pages/dashboard/pharmacist";
import DistributorDashboard from "./pages/dashboard/distributor";
import { Spinner } from "./components/common";

const DASH_MAP = {
  super_admin:  <SuperAdminDashboard/>,
  store_owner:  <StoreOwnerDashboard/>,
  pharmacist:   <PharmacistDashboard/>,
  distributor:  <DistributorDashboard/>,
};

function PrivateRoute() {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"#F3F6FA" }}>
      <Spinner/>
    </div>
  );
  if (!user) return <Navigate to="/login" replace/>;
  return (
    <DashboardLayout>
      {DASH_MAP[user.role] || <div style={{ padding:40, textAlign:"center", color:"#94A3B8" }}>Unknown role</div>}
    </DashboardLayout>
  );
}

// Redirect logged-in users away from login/register
function GuestRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace/>;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public website */}
      <Route path="/"         element={<HomePage/>}/>
      <Route path="/about"    element={<AboutPage/>}/>
      <Route path="/services" element={<ServicesPage/>}/>
      <Route path="/contact"  element={<ContactPage/>}/>

      {/* Auth */}
      <Route path="/login"    element={<GuestRoute><LoginPage/></GuestRoute>}/>
      <Route path="/register" element={<GuestRoute><RegisterPage/></GuestRoute>}/>

      {/* Protected dashboard */}
      <Route path="/dashboard" element={<PrivateRoute/>}/>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace/>}/>
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes/>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { fontFamily:"'Segoe UI',system-ui,sans-serif", fontSize:13, borderRadius:12 },
            success: { iconTheme: { primary:"#10B981", secondary:"#fff" } },
            error:   { iconTheme: { primary:"#EF4444", secondary:"#fff" } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
