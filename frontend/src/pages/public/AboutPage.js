import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const TEAM = [
  { name:"Rajesh Kumar",     role:"Founder & CEO",       avatar:"RK", color:"#0EA5E9" },
  { name:"Dr. Sunita Mehta", role:"Chief Medical Officer",avatar:"SM", color:"#10B981" },
  { name:"Arjun Patel",      role:"CTO",                  avatar:"AP", color:"#8B5CF6" },
  { name:"Priya Nair",       role:"Head of Operations",   avatar:"PN", color:"#F59E0B" },
];

const MILESTONES = [
  { year:"2022", event:"MedChain founded in Pimpri-Chinchwad, Maharashtra" },
  { year:"2023", event:"First 50 medical stores onboarded across Pune & Mumbai" },
  { year:"2024", event:"Reached 200+ stores, launched distributor network" },
  { year:"2025", event:"500+ stores, 10,000+ products, expanded to 8 states" },
  { year:"2026", event:"Pan-India launch with real-time B2B order management" },
];

export default function AboutPage() {
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
        <span style={{ background:"rgba(14,165,233,0.15)", color:"#7DD3FC", fontSize:13, fontWeight:700, padding:"4px 16px", borderRadius:20 }}>Our Story</span>
        <h1 style={{ fontSize:"clamp(32px,5vw,56px)", fontWeight:900, color:"#fff", margin:"20px 0 16px", letterSpacing:-1.5 }}>
          Building India's Medical<br/>
          <span style={{ background:"linear-gradient(135deg,#0EA5E9,#10B981)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", backgroundClip:"text" }}>Commerce Infrastructure</span>
        </h1>
        <p style={{ color:"#64748B", fontSize:17, maxWidth:560, margin:"0 auto", lineHeight:1.7 }}>
          We started MedChain to solve a real problem — the fragmented, inefficient way medical supplies move across India's healthcare ecosystem.
        </p>
      </section>

      {/* Mission */}
      <section style={{ padding:"80px 32px", background:"#F8FAFC" }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1fr", gap:48, alignItems:"center" }}>
          <div>
            <span style={{ background:"#EFF6FF", color:"#0369A1", fontSize:13, fontWeight:700, padding:"4px 14px", borderRadius:20 }}>Our Mission</span>
            <h2 style={{ fontSize:32, fontWeight:900, color:"#0F172A", margin:"16px 0 16px", letterSpacing:-0.5 }}>Connecting Every Medical Link</h2>
            <p style={{ color:"#64748B", fontSize:16, lineHeight:1.8, marginBottom:16 }}>
              MedChain exists to digitise and streamline India's medical supply chain — from distributor to store to patient. We believe every pharmacist and store owner deserves enterprise-grade tools.
            </p>
            <p style={{ color:"#64748B", fontSize:16, lineHeight:1.8 }}>
              Our platform eliminates manual paperwork, reduces stockouts, prevents expiry losses, and gives real-time visibility to every stakeholder in the chain.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
            {[["🎯","Mission","Digitise India's medical supply chain"],["👁️","Vision","Healthier India through better commerce"],["💡","Values","Transparency, trust, and technology"],["🤝","Promise","24/7 support for every partner"]].map(([icon,title,desc],i)=>(
              <div key={i} style={{ background:"#fff", borderRadius:16, padding:20, border:"1px solid #E8EEF4" }}>
                <div style={{ fontSize:28, marginBottom:10 }}>{icon}</div>
                <div style={{ fontWeight:800, color:"#0F172A", fontSize:14, marginBottom:6 }}>{title}</div>
                <div style={{ color:"#64748B", fontSize:13, lineHeight:1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding:"80px 32px", background:"#fff" }}>
        <div style={{ maxWidth:700, margin:"0 auto" }}>
          <h2 style={{ textAlign:"center", fontSize:32, fontWeight:900, color:"#0F172A", margin:"0 0 48px", letterSpacing:-0.5 }}>Our Journey</h2>
          {MILESTONES.map((m,i) => (
            <div key={i} style={{ display:"flex", gap:24, marginBottom:32, alignItems:"flex-start" }}>
              <div style={{ display:"flex", flexDirection:"column", alignItems:"center", flexShrink:0 }}>
                <div style={{ width:48, height:48, borderRadius:14, background:"linear-gradient(135deg,#0EA5E9,#10B981)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:12 }}>{m.year}</div>
                {i < MILESTONES.length-1 && <div style={{ width:2, height:32, background:"#E2E8F0", margin:"8px 0" }}/>}
              </div>
              <div style={{ paddingTop:10 }}>
                <p style={{ color:"#334155", fontSize:16, margin:0, lineHeight:1.6 }}>{m.event}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ padding:"80px 32px", background:"#F8FAFC" }}>
        <div style={{ maxWidth:900, margin:"0 auto" }}>
          <h2 style={{ textAlign:"center", fontSize:32, fontWeight:900, color:"#0F172A", margin:"0 0 48px", letterSpacing:-0.5 }}>Meet the Team</h2>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:24 }}>
            {TEAM.map((t,i) => (
              <div key={i} style={{ background:"#fff", borderRadius:20, padding:28, textAlign:"center", border:"1px solid #E8EEF4" }}>
                <div style={{ width:64, height:64, borderRadius:18, background:`linear-gradient(135deg,${t.color},${t.color}90)`, display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:900, fontSize:18, margin:"0 auto 16px" }}>{t.avatar}</div>
                <div style={{ fontWeight:800, color:"#0F172A", fontSize:15 }}>{t.name}</div>
                <div style={{ color:"#64748B", fontSize:13, marginTop:4 }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer/>
    </div>
  );
}
