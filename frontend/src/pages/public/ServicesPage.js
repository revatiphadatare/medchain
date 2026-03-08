import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const SERVICES = [
  { icon:"🏥", title:"Multi-Store Management", color:"#0EA5E9", desc:"Centrally manage unlimited medical stores. Approve, suspend, monitor revenue and inventory across every location in real time.", features:["Store onboarding & approval","GSTIN verification","City-wise analytics","Revenue dashboard per store"] },
  { icon:"📦", title:"B2B Order Management", color:"#10B981", desc:"Place and process bulk medicine orders between stores and distributors. Automated order numbering, stock deduction, and payment tracking.", features:["Bulk order placement","Auto stock deduction","Payment status tracking","Order history & export"] },
  { icon:"💊", title:"Pharmacy & Dispensing", color:"#F59E0B", desc:"Digital dispensing logs, prescription verification workflows, and real-time stock checks for pharmacists on the floor.", features:["Prescription verify & approve","Dispensing audit log","Expiry date monitoring","Low stock alerts"] },
  { icon:"🚚", title:"Distribution Network", color:"#8B5CF6", desc:"Manage your supply catalog, dispatch orders to client stores, and track every delivery from warehouse to doorstep.", features:["Dispatch queue management","Priority flagging","Client store accounts","Supply catalog with pricing"] },
  { icon:"📊", title:"Analytics & Reporting", color:"#EF4444", desc:"Role-specific dashboards with real-time charts, revenue trends, top products, and category breakdowns.", features:["Monthly revenue trends","Top-selling products","Category breakdown","Export to CSV"] },
  { icon:"🔐", title:"Security & Access Control", color:"#06B6D4", desc:"JWT-based authentication with role-level access. Every user sees exactly what they're supposed to — nothing more.", features:["4 distinct role portals","JWT token auth","Route-level authorization","Account activate/deactivate"] },
];

const PRICING = [
  { plan:"Starter", price:"Free", color:"#64748B", features:["1 Store","Up to 100 products","Basic analytics","Email support"], cta:"Get Started", role:"store_owner" },
  { plan:"Professional", price:"₹2,999/mo", color:"#0EA5E9", features:["Up to 10 Stores","Unlimited products","Full analytics","Priority support","Staff management"], cta:"Start Free Trial", role:"store_owner", popular:true },
  { plan:"Enterprise", price:"Custom", color:"#8B5CF6", features:["Unlimited stores","Distributor network","Custom integrations","Dedicated account manager","SLA guarantee"], cta:"Contact Us", role:"super_admin" },
];

export default function ServicesPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:"#fff" }}>
      <Navbar scrolled={scrolled}/>

      {/* Hero */}
      <section style={{ background:"linear-gradient(135deg,#060B18,#0D1B35)", padding:"140px 32px 80px", textAlign:"center" }}>
        <span style={{ background:"rgba(16,185,129,0.15)", color:"#6EE7B7", fontSize:13, fontWeight:700, padding:"4px 16px", borderRadius:20 }}>What We Offer</span>
        <h1 style={{ fontSize:"clamp(32px,5vw,56px)", fontWeight:900, color:"#fff", margin:"20px 0 16px", letterSpacing:-1.5 }}>
          Services Built for<br/>
          <span style={{ background:"linear-gradient(135deg,#10B981,#0EA5E9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Medical Commerce</span>
        </h1>
        <p style={{ color:"#64748B", fontSize:17, maxWidth:520, margin:"0 auto", lineHeight:1.7 }}>
          Every feature on MedChain is purpose-built for the Indian medical supply chain.
        </p>
      </section>

      {/* Services Grid */}
      <section style={{ padding:"80px 32px", background:"#F8FAFC" }}>
        <div style={{ maxWidth:1100, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))", gap:28 }}>
          {SERVICES.map((s,i) => (
            <div key={i} style={{ background:"#fff", borderRadius:24, padding:32, border:"1px solid #E8EEF4", transition:"all 0.2s" }}
              onMouseEnter={e=>{ e.currentTarget.style.boxShadow=`0 12px 40px ${s.color}20`; e.currentTarget.style.transform="translateY(-4px)"; }}
              onMouseLeave={e=>{ e.currentTarget.style.boxShadow="none"; e.currentTarget.style.transform="translateY(0)"; }}
            >
              <div style={{ width:56, height:56, borderRadius:16, background:s.color+"15", display:"flex", alignItems:"center", justifyContent:"center", fontSize:28, marginBottom:20 }}>{s.icon}</div>
              <h3 style={{ fontSize:20, fontWeight:800, color:"#0F172A", margin:"0 0 12px" }}>{s.title}</h3>
              <p style={{ color:"#64748B", fontSize:14, lineHeight:1.7, margin:"0 0 20px" }}>{s.desc}</p>
              <div style={{ borderTop:"1px solid #F1F5F9", paddingTop:16 }}>
                {s.features.map((f,j) => (
                  <div key={j} style={{ display:"flex", alignItems:"center", gap:10, padding:"6px 0", fontSize:13, color:"#475569" }}>
                    <span style={{ color:s.color, fontWeight:700 }}>✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding:"80px 32px", background:"#fff" }}>
        <div style={{ maxWidth:1000, margin:"0 auto" }}>
          <h2 style={{ textAlign:"center", fontSize:36, fontWeight:900, color:"#0F172A", margin:"0 0 8px", letterSpacing:-1 }}>Simple, Transparent Pricing</h2>
          <p style={{ textAlign:"center", color:"#64748B", fontSize:16, margin:"0 0 52px" }}>Start free, scale as you grow</p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:24 }}>
            {PRICING.map((p,i) => (
              <div key={i} style={{
                borderRadius:24, padding:32, border:`2px solid ${p.popular?"#0EA5E9":"#E2E8F0"}`,
                background: p.popular ? "linear-gradient(135deg,#F0F9FF,#fff)" : "#fff",
                position:"relative", transition:"all 0.2s",
              }}
                onMouseEnter={e=>e.currentTarget.style.transform="translateY(-4px)"}
                onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
              >
                {p.popular && <div style={{ position:"absolute", top:-14, left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#0EA5E9,#10B981)", color:"#fff", fontSize:12, fontWeight:800, padding:"4px 16px", borderRadius:20 }}>Most Popular</div>}
                <div style={{ fontWeight:800, fontSize:18, color:"#0F172A", marginBottom:8 }}>{p.plan}</div>
                <div style={{ fontSize:32, fontWeight:900, color:p.color, marginBottom:20 }}>{p.price}</div>
                <div style={{ marginBottom:28 }}>
                  {p.features.map((f,j) => (
                    <div key={j} style={{ display:"flex", alignItems:"center", gap:10, padding:"7px 0", fontSize:14, color:"#475569", borderBottom:"1px solid #F8FAFC" }}>
                      <span style={{ color:"#10B981", fontWeight:700 }}>✓</span> {f}
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate(`/register?role=${p.role}`)} style={{
                  width:"100%", padding:"12px", borderRadius:12, border:"none",
                  background: p.popular ? "linear-gradient(135deg,#0EA5E9,#10B981)" : "#F1F5F9",
                  color: p.popular ? "#fff" : "#0F172A",
                  fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:"inherit",
                }}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
