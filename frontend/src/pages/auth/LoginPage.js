import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const inputBase = {
  width:"100%", padding:"12px 16px",
  background:"rgba(255,255,255,0.07)",
  border:"1.5px solid rgba(255,255,255,0.12)",
  borderRadius:12, color:"#F1F5F9", fontSize:14,
  fontFamily:"inherit", outline:"none",
  boxSizing:"border-box", transition:"border-color 0.2s, background 0.2s",
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [searchParams] = useSearchParams();
  const justRegistered = searchParams.get("registered") === "1";

  const [form, setForm]         = useState({ email:"", password:"" });
  const [focused, setFocused]   = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});

  useEffect(() => {
    if (justRegistered) toast.success("Account created! Please sign in.", { duration: 4000 });
  }, [justRegistered]);

  const validate = () => {
    const e = {};
    if (!form.email.trim())    e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.password)        e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Minimum 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const user = await login(form.email.trim().toLowerCase(), form.password);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}!`);
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed. Please check your credentials.";
      toast.error(msg);
      const lower = msg.toLowerCase();
      if (lower.includes("password"))                    setErrors({ password: "Incorrect password" });
      else if (lower.includes("email") || lower.includes("account") || lower.includes("not found")) setErrors({ email: msg });
      else if (lower.includes("deactivated"))            setErrors({ email: "Account deactivated. Contact your administrator." });
    } finally {
      setLoading(false);
    }
  };

  const getStyle = (field) => ({
    ...inputBase,
    border: errors[field] ? "1.5px solid #EF4444"
      : focused === field  ? "1.5px solid #0EA5E9"
      : inputBase.border,
    background: focused === field ? "rgba(14,165,233,0.08)" : inputBase.background,
  });

  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(135deg,#060B18 0%,#0D1B35 40%,#0A1628 70%,#060B18 100%)",
      display:"flex", alignItems:"center", justifyContent:"center",
      padding:20, fontFamily:"'Segoe UI',system-ui,sans-serif",
    }}>
      <div style={{ width:"100%", maxWidth:420 }}>

        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <div style={{ width:72, height:72, borderRadius:22,
            background:"linear-gradient(135deg,#0EA5E9,#10B981)",
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:34, margin:"0 auto 14px",
            boxShadow:"0 8px 40px rgba(14,165,233,0.35)" }}>🏥</div>
          <h1 style={{ margin:0, fontSize:28, fontWeight:900, color:"#fff", letterSpacing:-1 }}>MedChain B2B</h1>
          <p style={{ margin:"8px 0 0", color:"#64748B", fontSize:14 }}>Multi-Medical eCommerce Platform</p>
        </div>

        {/* Registered banner */}
        {justRegistered && (
          <div style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", borderRadius:14, padding:"12px 16px", marginBottom:20, color:"#6EE7B7", fontSize:14, fontWeight:600, textAlign:"center" }}>
            ✅ Account created successfully! Sign in below.
          </div>
        )}

        {/* Card */}
        <div style={{ background:"rgba(255,255,255,0.04)", backdropFilter:"blur(24px)", borderRadius:24, padding:"32px 28px", border:"1px solid rgba(255,255,255,0.08)", boxShadow:"0 24px 64px rgba(0,0,0,0.4)" }}>
          <h2 style={{ margin:"0 0 6px", fontSize:20, fontWeight:800, color:"#F1F5F9" }}>Sign in to your account</h2>
          <p style={{ margin:"0 0 28px", color:"#64748B", fontSize:13 }}>Enter your registered email and password</p>

          <form onSubmit={handleSubmit} noValidate>

            {/* Email */}
            <div style={{ marginBottom:18 }}>
              <label style={{ display:"block", color:"#94A3B8", fontSize:12, fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                onFocus={()=>setFocused("email")} onBlur={()=>setFocused("")}
                placeholder="your@email.com" autoComplete="email"
                style={getStyle("email")} />
              {errors.email && <p style={{ color:"#EF4444", fontSize:12, margin:"6px 0 0" }}>⚠ {errors.email}</p>}
            </div>

            {/* Password */}
            <div style={{ marginBottom:28 }}>
              <label style={{ display:"block", color:"#94A3B8", fontSize:12, fontWeight:600, marginBottom:8, textTransform:"uppercase", letterSpacing:0.5 }}>Password</label>
              <div style={{ position:"relative" }}>
                <input type={showPass?"text":"password"} name="password" value={form.password}
                  onChange={handleChange} onFocus={()=>setFocused("password")} onBlur={()=>setFocused("")}
                  placeholder="Enter your password" autoComplete="current-password"
                  style={{ ...getStyle("password"), paddingRight:48 }}/>
                <button type="button" onClick={()=>setShowPass(p=>!p)} tabIndex={-1}
                  style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", background:"none", border:"none", cursor:"pointer", color:"#64748B", fontSize:16, padding:4 }}>
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
              {errors.password && <p style={{ color:"#EF4444", fontSize:12, margin:"6px 0 0" }}>⚠ {errors.password}</p>}
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width:"100%", padding:"13px 0", borderRadius:12, border:"none",
              background: loading ? "rgba(14,165,233,0.4)" : "linear-gradient(135deg,#0EA5E9,#10B981)",
              color:"#fff", fontWeight:800, fontSize:15,
              cursor: loading ? "not-allowed" : "pointer", fontFamily:"inherit",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              boxShadow: loading ? "none" : "0 4px 20px rgba(14,165,233,0.3)",
            }}>
              {loading ? (
                <><span style={{ width:16,height:16,border:"2px solid rgba(255,255,255,0.3)",borderTop:"2px solid #fff",borderRadius:"50%",animation:"mc-spin 0.7s linear infinite",display:"inline-block" }}/>Signing in...</>
              ) : "Sign In →"}
            </button>
          </form>

          <p style={{ textAlign:"center", marginTop:20, color:"#64748B", fontSize:13 }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color:"#0EA5E9", fontWeight:700, textDecoration:"none" }}>Create Account</Link>
          </p>
        </div>

        <p style={{ textAlign:"center", marginTop:18, color:"#334155", fontSize:12 }}>
          🔒 Secure login · <Link to="/" style={{ color:"#475569", textDecoration:"none" }}>← Back to Home</Link>
        </p>
      </div>

      <style>{`
        @keyframes mc-spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #475569 !important; }
        input:-webkit-autofill, input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0 100px #0d1b35 inset !important;
          -webkit-text-fill-color: #F1F5F9 !important;
          caret-color: #F1F5F9;
        }
      `}</style>
    </div>
  );
}
