import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { authAPI, storeAPI } from "../../api";
import toast from "react-hot-toast";
import Navbar from "../public/Navbar";

const ROLES = [
  {
    id: "super_admin", icon: "👑", label: "Super Admin", color: "#0EA5E9", bg: "#DBEAFE",
    desc: "Full platform control — manage all stores, users, products and analytics.",
  },
  {
    id: "store_owner", icon: "🏪", label: "Store Owner", color: "#10B981", bg: "#D1FAE5",
    desc: "Manage your medical store — inventory, B2B orders, staff and sales.",
  },
  {
    id: "pharmacist", icon: "💊", label: "Pharmacist", color: "#F59E0B", bg: "#FEF3C7",
    desc: "Handle dispensing, prescriptions, stock alerts and expiry management.",
  },
  {
    id: "distributor", icon: "🚚", label: "Distributor", color: "#8B5CF6", bg: "#EDE9FE",
    desc: "Manage your supply catalog, dispatch orders and client store accounts.",
  },
];

const inputStyle = {
  width: "100%", padding: "11px 14px", border: "1.5px solid #E2E8F0", borderRadius: 10,
  fontSize: 14, fontFamily: "inherit", outline: "none", background: "#FAFCFF",
  color: "#0F172A", boxSizing: "border-box", transition: "border-color 0.2s",
};

function Field({ label, error, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#64748B", marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>{label}</label>
      {children}
      {error && <p style={{ color:"#EF4444", fontSize:12, margin:"5px 0 0" }}>⚠ {error}</p>}
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preRole = searchParams.get("role");

  const [step, setStep]       = useState(preRole ? 2 : 1); // 1=pick role, 2=fill form
  const [role, setRole]       = useState(preRole || "");
  const [stores, setStores]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors]   = useState({});

  const [form, setForm] = useState({
    name: "", email: "", password: "", confirmPassword: "",
    phone: "", store: "", company: "", companyGstin: "",
  });

  // Fetch stores for store_owner / pharmacist
  useEffect(() => {
    if (role === "store_owner" || role === "pharmacist") {
      storeAPI.getAll({ status: "active" })
        .then(({ data }) => setStores(data.data || []))
        .catch(() => {});
    }
  }, [role]);

  const activeRole = ROLES.find(r => r.id === role);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())         e.name    = "Full name is required";
    if (!form.email.trim())        e.email   = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password)            e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!form.phone.trim())        e.phone   = "Phone number is required";
    if (role === "distributor" && !form.company.trim()) e.company = "Company name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role,
        phone: form.phone.trim(),
      };
      if (form.store)        payload.store        = form.store;
      if (form.company)      payload.company      = form.company.trim();
      if (form.companyGstin) payload.companyGstin = form.companyGstin.trim();

      await authAPI.register(payload);
      toast.success("Account created! Please sign in.");
      navigate("/login?registered=1");
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(msg);
      if (msg.toLowerCase().includes("email")) setErrors(p => ({ ...p, email: msg }));
    } finally {
      setLoading(false);
    }
  };

  const selectRole = (r) => { setRole(r); setStep(2); };

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#060B18 0%,#0D1B35 50%,#0A1628 100%)", fontFamily:"'Segoe UI',system-ui,sans-serif" }}>
      <Navbar scrolled />

      <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"100px 20px 60px", minHeight:"100vh" }}>
        <div style={{ width:"100%", maxWidth: step === 1 ? 860 : 520 }}>

          {/* Header */}
          <div style={{ textAlign:"center", marginBottom:36 }}>
            <div style={{ width:68, height:68, borderRadius:20, background:"linear-gradient(135deg,#0EA5E9,#10B981)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:32, margin:"0 auto 16px", boxShadow:"0 8px 32px rgba(14,165,233,0.3)" }}>🏥</div>
            <h1 style={{ fontSize:28, fontWeight:900, color:"#fff", margin:"0 0 8px", letterSpacing:-0.5 }}>
              {step === 1 ? "Join MedChain B2B" : `Register as ${activeRole?.label}`}
            </h1>
            <p style={{ color:"#64748B", fontSize:14, margin:0 }}>
              {step === 1 ? "Choose your role to get started" : `Fill in your details to create your ${activeRole?.label} account`}
            </p>
          </div>

          {/* STEP 1 — Role Selection */}
          {step === 1 && (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(380px,1fr))", gap:16 }}>
              {ROLES.map(r => (
                <button key={r.id} onClick={() => selectRole(r.id)} style={{
                  display:"flex", alignItems:"flex-start", gap:16, padding:"22px 24px",
                  background:"rgba(255,255,255,0.05)", backdropFilter:"blur(20px)",
                  border:`1.5px solid rgba(255,255,255,0.08)`,
                  borderRadius:20, cursor:"pointer", textAlign:"left",
                  fontFamily:"inherit", transition:"all 0.22s",
                }}
                  onMouseEnter={e=>{ e.currentTarget.style.background=`${r.color}15`; e.currentTarget.style.borderColor=`${r.color}50`; e.currentTarget.style.transform="translateY(-3px)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background="rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.08)"; e.currentTarget.style.transform="translateY(0)"; }}
                >
                  <div style={{ width:54, height:54, borderRadius:16, background:r.color+"25", border:`1.5px solid ${r.color}40`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:24, flexShrink:0 }}>{r.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800, color:"#F1F5F9", fontSize:17, marginBottom:4 }}>{r.label}</div>
                    <div style={{ color:"#64748B", fontSize:13, lineHeight:1.6 }}>{r.desc}</div>
                    <div style={{ marginTop:10, color:r.color, fontSize:13, fontWeight:700 }}>Register as {r.label} →</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* STEP 2 — Registration Form */}
          {step === 2 && activeRole && (
            <div style={{ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(24px)", borderRadius:24, padding:"32px 28px", border:"1px solid rgba(255,255,255,0.08)" }}>
              {/* Role badge + back */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
                <span style={{ background:activeRole.bg, color:activeRole.color, padding:"6px 14px", borderRadius:20, fontSize:13, fontWeight:700 }}>
                  {activeRole.icon} {activeRole.label}
                </span>
                <button onClick={() => setStep(1)} style={{ background:"none", border:"none", color:"#64748B", cursor:"pointer", fontSize:13, fontFamily:"inherit", fontWeight:600 }}>
                  ← Change Role
                </button>
              </div>

              <form onSubmit={handleSubmit} noValidate>
                {/* Name & Phone */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <Field label="Full Name *" error={errors.name}>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Dr. Priya Sharma"
                      style={{ ...inputStyle, borderColor: errors.name ? "#EF4444" : inputStyle.borderColor }}
                      onFocus={e=>e.target.style.borderColor=activeRole.color}
                      onBlur={e=>e.target.style.borderColor=errors.name?"#EF4444":"#E2E8F0"}/>
                  </Field>
                  <Field label="Phone Number *" error={errors.phone}>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98200 XXXXX"
                      style={{ ...inputStyle, borderColor: errors.phone ? "#EF4444" : inputStyle.borderColor }}
                      onFocus={e=>e.target.style.borderColor=activeRole.color}
                      onBlur={e=>e.target.style.borderColor=errors.phone?"#EF4444":"#E2E8F0"}/>
                  </Field>
                </div>

                {/* Email */}
                <Field label="Email Address *" error={errors.email}>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com"
                    style={{ ...inputStyle, borderColor: errors.email ? "#EF4444" : inputStyle.borderColor }}
                    onFocus={e=>e.target.style.borderColor=activeRole.color}
                    onBlur={e=>e.target.style.borderColor=errors.email?"#EF4444":"#E2E8F0"}/>
                </Field>

                {/* Password */}
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                  <Field label="Password *" error={errors.password}>
                    <div style={{ position:"relative" }}>
                      <input type={showPass?"text":"password"} name="password" value={form.password} onChange={handleChange}
                        placeholder="Min. 6 characters"
                        style={{ ...inputStyle, paddingRight:42, borderColor:errors.password?"#EF4444":inputStyle.borderColor }}
                        onFocus={e=>e.target.style.borderColor=activeRole.color}
                        onBlur={e=>e.target.style.borderColor=errors.password?"#EF4444":"#E2E8F0"}/>
                      <button type="button" onClick={()=>setShowPass(p=>!p)} tabIndex={-1}
                        style={{ position:"absolute", right:12, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", fontSize:14, color:"#94A3B8" }}>
                        {showPass?"🙈":"👁"}
                      </button>
                    </div>
                  </Field>
                  <Field label="Confirm Password *" error={errors.confirmPassword}>
                    <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange}
                      placeholder="Re-enter password"
                      style={{ ...inputStyle, borderColor:errors.confirmPassword?"#EF4444":inputStyle.borderColor }}
                      onFocus={e=>e.target.style.borderColor=activeRole.color}
                      onBlur={e=>e.target.style.borderColor=errors.confirmPassword?"#EF4444":"#E2E8F0"}/>
                  </Field>
                </div>

                {/* Store Owner / Pharmacist — Assign Store */}
                {(role === "store_owner" || role === "pharmacist") && (
                  <Field label="Assign to Store" error={errors.store}>
                    <select name="store" value={form.store} onChange={handleChange}
                      style={inputStyle}
                      onFocus={e=>e.target.style.borderColor=activeRole.color}
                      onBlur={e=>e.target.style.borderColor="#E2E8F0"}>
                      <option value="">Select a store (optional)</option>
                      {stores.map(s => <option key={s._id} value={s._id}>{s.name} — {s.city}</option>)}
                    </select>
                    <p style={{ fontSize:11, color:"#94A3B8", margin:"5px 0 0" }}>
                      If your store isn't listed, an admin will assign it after approval.
                    </p>
                  </Field>
                )}

                {/* Distributor — Company */}
                {role === "distributor" && (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
                    <Field label="Company Name *" error={errors.company}>
                      <input name="company" value={form.company} onChange={handleChange} placeholder="HealthFirst Distributors"
                        style={inputStyle}
                        onFocus={e=>e.target.style.borderColor=activeRole.color}
                        onBlur={e=>e.target.style.borderColor="#E2E8F0"}/>
                    </Field>
                    <Field label="Company GSTIN">
                      <input name="companyGstin" value={form.companyGstin} onChange={handleChange} placeholder="27AADCA1234B1Z5"
                        style={inputStyle}
                        onFocus={e=>e.target.style.borderColor=activeRole.color}
                        onBlur={e=>e.target.style.borderColor="#E2E8F0"}/>
                    </Field>
                  </div>
                )}

                {/* Submit */}
                <button type="submit" disabled={loading} style={{
                  width:"100%", padding:"13px", marginTop:8, borderRadius:12, border:"none",
                  background: loading ? "rgba(14,165,233,0.4)" : `linear-gradient(135deg,${activeRole.color},${activeRole.color}CC)`,
                  color:"#fff", fontWeight:800, fontSize:15,
                  cursor: loading ? "not-allowed" : "pointer", fontFamily:"inherit",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                  boxShadow: loading ? "none" : `0 6px 24px ${activeRole.color}40`,
                }}>
                  {loading ? (
                    <><span style={{ width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid #fff",borderRadius:"50%",display:"inline-block",animation:"spin 0.7s linear infinite" }}/>Creating Account...</>
                  ) : `Create ${activeRole.label} Account →`}
                </button>

                <p style={{ textAlign:"center", marginTop:18, color:"#64748B", fontSize:13 }}>
                  Already have an account?{" "}
                  <Link to="/login" style={{ color:activeRole.color, fontWeight:700, textDecoration:"none" }}>Sign In</Link>
                </p>
              </form>
            </div>
          )}

          <p style={{ textAlign:"center", marginTop:20, color:"#334155", fontSize:11 }}>
            🔒 Your data is encrypted and secure · MedChain B2B
          </p>
        </div>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}