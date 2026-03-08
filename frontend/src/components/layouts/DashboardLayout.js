import { useAuth } from "../../context/AuthContext";
import { ROLE_META } from "../common";

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const rm = ROLE_META[user?.role] || {};

  return (
    <div style={{ minHeight:"100vh", background:"#F3F6FA", fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      {/* Top Nav */}
      <div style={{
        background:"#fff", borderBottom:"1px solid #E2E8F0",
        padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between",
        height:62, position:"sticky", top:0, zIndex:200,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ width:38, height:38, borderRadius:11,
            background:"linear-gradient(135deg,#0EA5E9,#10B981)",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🏥</div>
          <div>
            <span style={{ fontWeight:900, fontSize:17, color:"#0F172A", letterSpacing:-0.5 }}>MedChain</span>
            <span style={{ color:"#CBD5E1", margin:"0 6px" }}>·</span>
            <span style={{ background:rm.lightBg, color:rm.color,
              padding:"3px 12px", borderRadius:20, fontSize:12, fontWeight:700 }}>
              {rm.icon} {rm.label} Portal
            </span>
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:14 }}>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontWeight:800, fontSize:14, color:"#0F172A" }}>{user?.name}</div>
            <div style={{ fontSize:11, color:"#94A3B8" }}>{user?.email}</div>
          </div>
          <div style={{ width:40, height:40, borderRadius:12, background:rm.lightBg,
            color:rm.color, display:"flex", alignItems:"center", justifyContent:"center",
            fontWeight:900, fontSize:14, border:`1.5px solid ${rm.color}30`,
            flexShrink:0 }}>
            {(user?.name?.split(" ").map(n=>n?.[0]||"").join("").slice(0,2)) || "U"}
          </div>
          <button onClick={logout} style={{ fontSize:12, color:"#64748B", background:"#F1F5F9",
            border:"1px solid #E2E8F0", borderRadius:9, padding:"7px 14px",
            cursor:"pointer", fontWeight:600, fontFamily:"inherit" }}>
            ⬅ Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding:"28px 28px 48px" }}>
        <div style={{ marginBottom:24 }}>
          <h1 style={{ margin:0, fontSize:26, fontWeight:900, color:"#0F172A", letterSpacing:-0.7 }}>
            Welcome back, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p style={{ margin:"5px 0 0", color:"#64748B", fontSize:14 }}>
            {user?.role === "super_admin" && "Full platform control · All stores, orders & analytics"}
            {user?.role === "store_owner"  && `${user?.store?.name} · Inventory, orders, staff & sales`}
            {user?.role === "pharmacist"   && `Dispensary · ${user?.store?.name}`}
            {user?.role === "distributor"  && `${user?.company} · Dispatch, clients & catalog`}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
