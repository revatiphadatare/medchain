import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const STATS = [
  { value: "500+", label: "Medical Stores" },
  { value: "10,000+", label: "Products Listed" },
  { value: "50,000+", label: "Orders Delivered" },
  { value: "99.8%", label: "Uptime Guaranteed" },
];

const FEATURES = [
  { icon: "🏥", title: "Multi-Store Management", desc: "Manage hundreds of medical stores from a single platform with real-time inventory sync across all locations." },
  { icon: "📦", title: "B2B Order Management", desc: "Streamline bulk procurement between distributors, medical stores, and pharmacists with automated workflows." },
  { icon: "💊", title: "Prescription Tracking", desc: "Digital prescription management with pharmacist verification, audit trails, and compliance reporting." },
  { icon: "📊", title: "Analytics & Reports", desc: "Deep business insights with real-time dashboards, sales trends, inventory alerts, and revenue tracking." },
  { icon: "🚚", title: "Distribution Network", desc: "Connect distributors directly to stores for seamless supply chain management and dispatch tracking." },
  { icon: "🔐", title: "Role-Based Security", desc: "Enterprise-grade access control — every user sees only what they need with JWT-secured APIs." },
];

const ROLES = [
  { role: "super_admin", icon: "👑", title: "Super Admin", color: "#0EA5E9", bg: "linear-gradient(135deg,#0EA5E9,#0284C7)", desc: "Full platform control. Manage all stores, products, users, pricing and analytics across the entire network.", perks: ["Manage all medical stores", "Full product catalog control", "User & role management", "Platform-wide analytics"] },
  { role: "store_owner", icon: "🏪", title: "Store Owner", color: "#10B981", bg: "linear-gradient(135deg,#10B981,#059669)", desc: "Run your medical store efficiently. Manage inventory, place B2B orders, track staff and monitor sales.", perks: ["Inventory management", "Place bulk B2B orders", "Staff scheduling", "Sales reports & insights"] },
  { role: "pharmacist",  icon: "💊", title: "Pharmacist",  color: "#F59E0B", bg: "linear-gradient(135deg,#F59E0B,#D97706)", desc: "Handle dispensing, verify prescriptions, and stay on top of stock levels and expiry alerts.", perks: ["Prescription verification", "Stock expiry alerts", "Dispensing log", "Low-stock notifications"] },
  { role: "distributor", icon: "🚚", title: "Distributor", color: "#8B5CF6", bg: "linear-gradient(135deg,#8B5CF6,#7C3AED)", desc: "Manage your supply chain, dispatch orders to client stores, and maintain your medicine catalog.", perks: ["Dispatch queue management", "Client store accounts", "Supply catalog & pricing", "Delivery tracking"] },
];

const TESTIMONIALS = [
  { name: "Dr. Priya Sharma", role: "Store Owner, Mumbai", text: "MedChain transformed how we manage our pharmacy. Order processing time dropped by 70% in the first month.", avatar: "PS" },
  { name: "Ravi Nair", role: "Distributor, Chennai", text: "Managing 40+ client stores was a nightmare before MedChain. Now dispatch is fully automated and trackable.", avatar: "RN" },
  { name: "Kavita Rao", role: "Pharmacist, Pune", text: "The prescription tracking and expiry alerts have made compliance so much easier. Highly recommended.", avatar: "KR" },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-rotate roles
  useEffect(() => {
    const t = setInterval(() => setActiveRole(p => (p + 1) % ROLES.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: "#fff", overflowX: "hidden" }}>
      <Navbar scrolled={scrolled} />

      {/* ── HERO */}
      <section style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #060B18 0%, #0D1B35 50%, #0A1628 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "120px 24px 80px", position: "relative", overflow: "hidden",
      }}>
        {/* Animated background blobs */}
        <div style={{ position:"absolute", top:80, left:"10%", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle,rgba(14,165,233,0.12),transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", bottom:80, right:"10%", width:350, height:350, borderRadius:"50%", background:"radial-gradient(circle,rgba(16,185,129,0.1),transparent 70%)", pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle,rgba(14,165,233,0.05),transparent 70%)", pointerEvents:"none" }}/>

        <div style={{ maxWidth: 900, textAlign: "center", position: "relative", zIndex: 1 }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(14,165,233,0.15)", border:"1px solid rgba(14,165,233,0.3)", borderRadius:24, padding:"6px 18px", marginBottom:28 }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background:"#0EA5E9", display:"inline-block", animation:"pulse 2s infinite" }}/>
            <span style={{ color:"#7DD3FC", fontSize:13, fontWeight:600 }}>India's #1 B2B Medical eCommerce Platform</span>
          </div>

          <h1 style={{ fontSize: "clamp(36px,6vw,72px)", fontWeight:900, color:"#fff", margin:"0 0 24px", letterSpacing:-2, lineHeight:1.1 }}>
            The Future of
            <span style={{ display:"block", background:"linear-gradient(135deg,#0EA5E9,#10B981)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>
              Medical Commerce
            </span>
          </h1>

          <p style={{ fontSize:18, color:"#94A3B8", margin:"0 auto 40px", maxWidth:620, lineHeight:1.7 }}>
            Connect medical stores, pharmacists, and distributors on one powerful B2B platform. 
            Automate orders, track inventory, and grow your medical business with real-time insights.
          </p>

          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", marginBottom:64 }}>
            <button onClick={() => navigate("/register")} style={{
              padding:"14px 32px", borderRadius:14, border:"none",
              background:"linear-gradient(135deg,#0EA5E9,#10B981)",
              color:"#fff", fontWeight:800, fontSize:16, cursor:"pointer",
              fontFamily:"inherit", boxShadow:"0 8px 32px rgba(14,165,233,0.4)",
              transition:"transform 0.2s",
            }}
              onMouseEnter={e=>e.target.style.transform="translateY(-2px)"}
              onMouseLeave={e=>e.target.style.transform="translateY(0)"}
            >
              Get Started Free →
            </button>
            <button onClick={() => document.getElementById("services").scrollIntoView({behavior:"smooth"})} style={{
              padding:"14px 32px", borderRadius:14,
              border:"1.5px solid rgba(255,255,255,0.15)",
              background:"rgba(255,255,255,0.05)",
              color:"#fff", fontWeight:700, fontSize:16, cursor:"pointer",
              fontFamily:"inherit", transition:"all 0.2s",
            }}
              onMouseEnter={e=>{ e.target.style.background="rgba(255,255,255,0.1)"; e.target.style.borderColor="rgba(255,255,255,0.3)"; }}
              onMouseLeave={e=>{ e.target.style.background="rgba(255,255,255,0.05)"; e.target.style.borderColor="rgba(255,255,255,0.15)"; }}
            >
              Explore Services
            </button>
          </div>

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:24, maxWidth:720, margin:"0 auto" }}>
            {STATS.map((s,i) => (
              <div key={i} style={{ textAlign:"center" }}>
                <div style={{ fontSize:32, fontWeight:900, color:"#fff", letterSpacing:-1 }}>{s.value}</div>
                <div style={{ fontSize:13, color:"#64748B", marginTop:4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
      </section>

      {/* ── ROLES SECTION */}
      <section style={{ padding:"100px 24px", background:"#F8FAFC" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <span style={{ background:"#EFF6FF", color:"#0369A1", fontSize:13, fontWeight:700, padding:"4px 14px", borderRadius:20 }}>Who is MedChain for?</span>
            <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:900, color:"#0F172A", margin:"16px 0 12px", letterSpacing:-1 }}>One Platform, Four Roles</h2>
            <p style={{ color:"#64748B", fontSize:16, maxWidth:560, margin:"0 auto" }}>Register as any role and get a purpose-built dashboard tailored to your needs.</p>
          </div>

          {/* Role tabs */}
          <div style={{ display:"flex", justifyContent:"center", gap:8, marginBottom:40, flexWrap:"wrap" }}>
            {ROLES.map((r,i) => (
              <button key={i} onClick={() => setActiveRole(i)} style={{
                padding:"10px 20px", borderRadius:12,
                border: `2px solid ${activeRole===i ? r.color : "#E2E8F0"}`,
                background: activeRole===i ? r.color+"15" : "#fff",
                color: activeRole===i ? r.color : "#64748B",
                fontWeight:700, fontSize:14, cursor:"pointer",
                fontFamily:"inherit", transition:"all 0.2s",
                display:"flex", alignItems:"center", gap:8,
              }}>
                {r.icon} {r.title}
              </button>
            ))}
          </div>

          {/* Active role card */}
          {ROLES.map((r,i) => i === activeRole && (
            <div key={i} style={{
              display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"center",
              background:"#fff", borderRadius:24, padding:48,
              border:`1px solid ${r.color}30`,
              boxShadow:`0 8px 40px ${r.color}15`,
            }}>
              <div>
                <div style={{ width:72, height:72, borderRadius:20, background:r.bg, display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, marginBottom:20 }}>{r.icon}</div>
                <h3 style={{ fontSize:28, fontWeight:900, color:"#0F172A", margin:"0 0 14px", letterSpacing:-0.5 }}>{r.title}</h3>
                <p style={{ color:"#64748B", fontSize:16, lineHeight:1.7, margin:"0 0 28px" }}>{r.desc}</p>
                <button onClick={() => navigate(`/register?role=${r.role}`)} style={{
                  padding:"12px 28px", borderRadius:12, border:"none",
                  background: r.bg, color:"#fff", fontWeight:700, fontSize:14,
                  cursor:"pointer", fontFamily:"inherit",
                }}>
                  Register as {r.title} →
                </button>
              </div>
              <div>
                <div style={{ fontSize:13, fontWeight:700, color:"#94A3B8", textTransform:"uppercase", letterSpacing:1, marginBottom:16 }}>What you can do</div>
                {r.perks.map((p,j) => (
                  <div key={j} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 0", borderBottom:"1px solid #F1F5F9" }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:r.color+"15", color:r.color, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, flexShrink:0 }}>✓</div>
                    <span style={{ fontSize:15, color:"#334155", fontWeight:500 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES */}
      <section id="services" style={{ padding:"100px 24px", background:"#fff" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:64 }}>
            <span style={{ background:"#F0FDF4", color:"#15803D", fontSize:13, fontWeight:700, padding:"4px 14px", borderRadius:20 }}>Our Services</span>
            <h2 style={{ fontSize:"clamp(28px,4vw,44px)", fontWeight:900, color:"#0F172A", margin:"16px 0 12px", letterSpacing:-1 }}>Everything You Need to Scale</h2>
            <p style={{ color:"#64748B", fontSize:16, maxWidth:520, margin:"0 auto" }}>Built specifically for the Indian medical distribution ecosystem.</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:24 }}>
            {FEATURES.map((f,i) => (
              <div key={i} style={{
                padding:28, borderRadius:20, border:"1px solid #E8EEF4",
                background:"#FAFCFF", transition:"all 0.2s",
              }}
                onMouseEnter={e=>{ e.currentTarget.style.boxShadow="0 8px 32px rgba(14,165,233,0.12)"; e.currentTarget.style.borderColor="#BFDBFE"; e.currentTarget.style.transform="translateY(-4px)"; }}
                onMouseLeave={e=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.borderColor="#E8EEF4"; e.currentTarget.style.transform="translateY(0)"; }}
              >
                <div style={{ fontSize:40, marginBottom:16 }}>{f.icon}</div>
                <h3 style={{ fontSize:18, fontWeight:800, color:"#0F172A", margin:"0 0 10px" }}>{f.title}</h3>
                <p style={{ color:"#64748B", fontSize:14, lineHeight:1.7, margin:0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS */}
      <section style={{ padding:"100px 24px", background:"linear-gradient(135deg,#060B18,#0D1B35)" }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:60 }}>
            <h2 style={{ fontSize:"clamp(26px,4vw,40px)", fontWeight:900, color:"#fff", margin:"0 0 12px", letterSpacing:-1 }}>Trusted by Medical Professionals</h2>
            <p style={{ color:"#64748B", fontSize:16 }}>See what our users say about MedChain</p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:24 }}>
            {TESTIMONIALS.map((t,i) => (
              <div key={i} style={{ background:"rgba(255,255,255,0.05)", backdropFilter:"blur(20px)", borderRadius:20, padding:28, border:"1px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize:28, marginBottom:16 }}>⭐⭐⭐⭐⭐</div>
                <p style={{ color:"#CBD5E1", fontSize:15, lineHeight:1.7, margin:"0 0 20px", fontStyle:"italic" }}>"{t.text}"</p>
                <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                  <div style={{ width:42, height:42, borderRadius:12, background:"linear-gradient(135deg,#0EA5E9,#10B981)", display:"flex", alignItems:"center", justifyContent:"center", fontWeight:900, color:"#fff", fontSize:14 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight:700, color:"#fff", fontSize:14 }}>{t.name}</div>
                    <div style={{ fontSize:12, color:"#64748B" }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA */}
      <section style={{ padding:"100px 24px", background:"#fff", textAlign:"center" }}>
        <div style={{ maxWidth:640, margin:"0 auto" }}>
          <h2 style={{ fontSize:"clamp(28px,4vw,48px)", fontWeight:900, color:"#0F172A", margin:"0 0 16px", letterSpacing:-1 }}>Ready to Transform Your Medical Business?</h2>
          <p style={{ color:"#64748B", fontSize:17, lineHeight:1.7, margin:"0 0 36px" }}>Join 500+ medical stores already using MedChain. Setup takes less than 5 minutes.</p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap" }}>
            <button onClick={() => navigate("/register")} style={{
              padding:"14px 36px", borderRadius:14, border:"none",
              background:"linear-gradient(135deg,#0EA5E9,#10B981)",
              color:"#fff", fontWeight:800, fontSize:16,
              cursor:"pointer", fontFamily:"inherit",
              boxShadow:"0 8px 32px rgba(14,165,233,0.35)",
            }}>
              Create Free Account →
            </button>
            <Link to="/login" style={{
              padding:"14px 36px", borderRadius:14,
              border:"2px solid #E2E8F0", background:"transparent",
              color:"#0F172A", fontWeight:700, fontSize:16,
              textDecoration:"none", display:"inline-flex", alignItems:"center",
            }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
