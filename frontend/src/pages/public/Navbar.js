import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Navbar({ scrolled }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About Us" },
    { to: "/services", label: "Services" },
    { to: "/contact", label: "Contact" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 999,
      background: scrolled ? "rgba(6,11,24,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "none",
      transition: "all 0.3s",
      padding: "0 32px",
      height: 70,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      {/* Logo */}
      <Link to="/" style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none" }}>
        <div style={{ width:38, height:38, borderRadius:11, background:"linear-gradient(135deg,#0EA5E9,#10B981)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🏥</div>
        <span style={{ fontWeight:900, fontSize:20, color:"#fff", letterSpacing:-0.5 }}>MedChain</span>
        <span style={{ background:"rgba(14,165,233,0.2)", color:"#7DD3FC", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:8 }}>B2B</span>
      </Link>

      {/* Desktop links */}
      <div style={{ display:"flex", alignItems:"center", gap:4 }} className="nav-desktop">
        {links.map(l => (
          <Link key={l.to} to={l.to} style={{
            padding:"8px 16px", borderRadius:10,
            color: isActive(l.to) ? "#0EA5E9" : "#94A3B8",
            fontWeight: isActive(l.to) ? 700 : 500,
            fontSize:14, textDecoration:"none",
            background: isActive(l.to) ? "rgba(14,165,233,0.1)" : "transparent",
            transition:"all 0.2s",
          }}
            onMouseEnter={e=>{ if(!isActive(l.to)){e.target.style.color="#fff";e.target.style.background="rgba(255,255,255,0.05)";} }}
            onMouseLeave={e=>{ if(!isActive(l.to)){e.target.style.color="#94A3B8";e.target.style.background="transparent";} }}
          >
            {l.label}
          </Link>
        ))}
      </div>

      {/* Auth buttons */}
      <div style={{ display:"flex", gap:10, alignItems:"center" }}>
        <button onClick={() => navigate("/login")} style={{
          padding:"8px 20px", borderRadius:10,
          border:"1.5px solid rgba(255,255,255,0.2)",
          background:"transparent", color:"#fff",
          fontWeight:600, fontSize:14, cursor:"pointer",
          fontFamily:"inherit", transition:"all 0.2s",
        }}
          onMouseEnter={e=>{ e.target.style.background="rgba(255,255,255,0.1)"; }}
          onMouseLeave={e=>{ e.target.style.background="transparent"; }}
        >
          Sign In
        </button>
        <button onClick={() => navigate("/register")} style={{
          padding:"8px 20px", borderRadius:10, border:"none",
          background:"linear-gradient(135deg,#0EA5E9,#10B981)",
          color:"#fff", fontWeight:700, fontSize:14,
          cursor:"pointer", fontFamily:"inherit",
          boxShadow:"0 4px 14px rgba(14,165,233,0.3)",
        }}>
          Register Free
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
