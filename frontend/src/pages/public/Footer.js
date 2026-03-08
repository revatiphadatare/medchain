import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={{ background:"#060B18", padding:"60px 32px 32px", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ maxWidth:1100, margin:"0 auto" }}>
        <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr 1fr", gap:40, marginBottom:48 }}>
          {/* Brand */}
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
              <div style={{ width:40, height:40, borderRadius:12, background:"linear-gradient(135deg,#0EA5E9,#10B981)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20 }}>🏥</div>
              <span style={{ fontWeight:900, fontSize:20, color:"#fff" }}>MedChain B2B</span>
            </div>
            <p style={{ color:"#475569", fontSize:14, lineHeight:1.7, maxWidth:280, margin:"0 0 20px" }}>
              India's leading B2B medical eCommerce platform connecting distributors, stores, and pharmacists.
            </p>
            <div style={{ color:"#475569", fontSize:13 }}>
              📍 Pimpri-Chinchwad, Maharashtra, India<br/>
              📧 hello@medchain.in<br/>
              📞 +91 98200 00001
            </div>
          </div>

          {/* Company */}
          <div>
            <div style={{ color:"#94A3B8", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:16 }}>Company</div>
            {[["About Us","/about"],["Services","/services"],["Contact","/contact"]].map(([l,to])=>(
              <div key={l} style={{ marginBottom:10 }}>
                <Link to={to} style={{ color:"#64748B", fontSize:14, textDecoration:"none", transition:"color 0.2s" }}
                  onMouseEnter={e=>e.target.style.color="#fff"}
                  onMouseLeave={e=>e.target.style.color="#64748B"}>{l}</Link>
              </div>
            ))}
          </div>

          {/* Join As */}
          <div>
            <div style={{ color:"#94A3B8", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:16 }}>Join As</div>
            {[["Super Admin","super_admin"],["Store Owner","store_owner"],["Pharmacist","pharmacist"],["Distributor","distributor"]].map(([l,r])=>(
              <div key={r} style={{ marginBottom:10 }}>
                <Link to={`/register?role=${r}`} style={{ color:"#64748B", fontSize:14, textDecoration:"none", transition:"color 0.2s" }}
                  onMouseEnter={e=>e.target.style.color="#fff"}
                  onMouseLeave={e=>e.target.style.color="#64748B"}>{l}</Link>
              </div>
            ))}
          </div>

          {/* Legal */}
          <div>
            <div style={{ color:"#94A3B8", fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginBottom:16 }}>Account</div>
            {[["Sign In","/login"],["Create Account","/register"]].map(([l,to])=>(
              <div key={l} style={{ marginBottom:10 }}>
                <Link to={to} style={{ color:"#64748B", fontSize:14, textDecoration:"none" }}
                  onMouseEnter={e=>e.target.style.color="#fff"}
                  onMouseLeave={e=>e.target.style.color="#64748B"}>{l}</Link>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", paddingTop:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <p style={{ color:"#334155", fontSize:13, margin:0 }}>© 2026 MedChain B2B. All rights reserved.</p>
          <p style={{ color:"#334155", fontSize:13, margin:0 }}>Built with ❤️ for India's Medical Ecosystem</p>
        </div>
      </div>
    </footer>
  );
}
