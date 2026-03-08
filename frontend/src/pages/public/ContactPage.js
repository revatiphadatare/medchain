import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import toast from "react-hot-toast";

const inputStyle = { width:"100%", padding:"12px 16px", border:"1.5px solid #E2E8F0", borderRadius:12, fontSize:14, fontFamily:"inherit", outline:"none", background:"#FAFCFF", color:"#0F172A", boxSizing:"border-box", transition:"border-color 0.2s" };

export default function ContactPage() {
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ name:"", email:"", phone:"", subject:"", message:"" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { toast.error("Please fill all required fields"); return; }
    setSending(true);
    // Simulate sending (replace with real API call)
    await new Promise(r => setTimeout(r, 1500));
    setSending(false);
    setSent(true);
    toast.success("Message sent! We'll get back to you within 24 hours.");
    setForm({ name:"", email:"", phone:"", subject:"", message:"" });
  };

  return (
    <div style={{ fontFamily:"'Segoe UI',system-ui,sans-serif", background:"#fff" }}>
      <Navbar scrolled={scrolled}/>

      {/* Hero */}
      <section style={{ background:"linear-gradient(135deg,#060B18,#0D1B35)", padding:"140px 32px 80px", textAlign:"center" }}>
        <span style={{ background:"rgba(14,165,233,0.15)", color:"#7DD3FC", fontSize:13, fontWeight:700, padding:"4px 16px", borderRadius:20 }}>Get In Touch</span>
        <h1 style={{ fontSize:"clamp(32px,5vw,52px)", fontWeight:900, color:"#fff", margin:"20px 0 16px", letterSpacing:-1.5 }}>We'd Love to Hear From You</h1>
        <p style={{ color:"#64748B", fontSize:17, maxWidth:480, margin:"0 auto", lineHeight:1.7 }}>Have questions about MedChain? Our team is ready to help you get started.</p>
      </section>

      {/* Contact section */}
      <section style={{ padding:"80px 32px", background:"#F8FAFC" }}>
        <div style={{ maxWidth:1000, margin:"0 auto", display:"grid", gridTemplateColumns:"1fr 1.5fr", gap:48, alignItems:"start" }}>

          {/* Info */}
          <div>
            <h2 style={{ fontSize:26, fontWeight:900, color:"#0F172A", margin:"0 0 8px" }}>Contact Information</h2>
            <p style={{ color:"#64748B", fontSize:15, margin:"0 0 36px", lineHeight:1.7 }}>Reach out via any channel. Our team typically responds within 2–4 hours on business days.</p>

            {[
              { icon:"📍", label:"Address",  val:"MedChain HQ, Pimpri-Chinchwad, Maharashtra 411018" },
              { icon:"📧", label:"Email",    val:"hello@medchain.in" },
              { icon:"📞", label:"Phone",    val:"+91 98200 00001" },
              { icon:"🕒", label:"Business Hours", val:"Mon–Sat, 9:00 AM – 7:00 PM IST" },
            ].map((c,i) => (
              <div key={i} style={{ display:"flex", gap:14, marginBottom:24 }}>
                <div style={{ width:44, height:44, borderRadius:12, background:"#EFF6FF", display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, flexShrink:0 }}>{c.icon}</div>
                <div>
                  <div style={{ fontWeight:700, color:"#0F172A", fontSize:14 }}>{c.label}</div>
                  <div style={{ color:"#64748B", fontSize:14, marginTop:2 }}>{c.val}</div>
                </div>
              </div>
            ))}

            <div style={{ marginTop:32, padding:20, background:"linear-gradient(135deg,#EFF6FF,#F0FDF4)", borderRadius:16, border:"1px solid #BFDBFE" }}>
              <div style={{ fontWeight:800, color:"#0F172A", fontSize:15, marginBottom:8 }}>🤝 Partnership Enquiries</div>
              <p style={{ color:"#64748B", fontSize:13, margin:0, lineHeight:1.6 }}>For distributor partnerships, bulk onboarding, or enterprise plans, email <strong>partners@medchain.in</strong></p>
            </div>
          </div>

          {/* Form */}
          <div style={{ background:"#fff", borderRadius:24, padding:36, border:"1px solid #E8EEF4", boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>
            {sent ? (
              <div style={{ textAlign:"center", padding:"40px 0" }}>
                <div style={{ fontSize:56, marginBottom:16 }}>✅</div>
                <h3 style={{ fontSize:22, fontWeight:800, color:"#0F172A", margin:"0 0 10px" }}>Message Sent!</h3>
                <p style={{ color:"#64748B", fontSize:15 }}>We'll respond to your email within 24 hours.</p>
                <button onClick={() => setSent(false)} style={{ marginTop:20, padding:"10px 24px", borderRadius:10, border:"none", background:"#0EA5E9", color:"#fff", fontWeight:700, cursor:"pointer", fontFamily:"inherit" }}>Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize:20, fontWeight:800, color:"#0F172A", margin:"0 0 24px" }}>Send a Message</h3>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:14 }}>
                  <div>
                    <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#64748B", marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Full Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" style={inputStyle}
                      onFocus={e=>e.target.style.borderColor="#0EA5E9"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}/>
                  </div>
                  <div>
                    <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#64748B", marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" style={inputStyle}
                      onFocus={e=>e.target.style.borderColor="#0EA5E9"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}/>
                  </div>
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#64748B", marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Email Address *</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="your@email.com" style={inputStyle}
                    onFocus={e=>e.target.style.borderColor="#0EA5E9"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}/>
                </div>
                <div style={{ marginBottom:14 }}>
                  <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#64748B", marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Subject</label>
                  <select name="subject" value={form.subject} onChange={handleChange} style={inputStyle}>
                    <option value="">Select a subject...</option>
                    <option>General Enquiry</option>
                    <option>Partnership / Distributor</option>
                    <option>Technical Support</option>
                    <option>Billing</option>
                    <option>Enterprise Plan</option>
                  </select>
                </div>
                <div style={{ marginBottom:24 }}>
                  <label style={{ display:"block", fontSize:12, fontWeight:600, color:"#64748B", marginBottom:6, textTransform:"uppercase", letterSpacing:0.5 }}>Message *</label>
                  <textarea name="message" value={form.message} onChange={handleChange} placeholder="Tell us how we can help..." rows={5}
                    style={{ ...inputStyle, resize:"vertical", minHeight:120 }}
                    onFocus={e=>e.target.style.borderColor="#0EA5E9"} onBlur={e=>e.target.style.borderColor="#E2E8F0"}/>
                </div>
                <button type="submit" disabled={sending} style={{
                  width:"100%", padding:"13px", borderRadius:12, border:"none",
                  background: sending ? "rgba(14,165,233,0.5)" : "linear-gradient(135deg,#0EA5E9,#10B981)",
                  color:"#fff", fontWeight:800, fontSize:15, cursor: sending ? "not-allowed" : "pointer",
                  fontFamily:"inherit", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                }}>
                  {sending ? (<><span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTop:"2px solid #fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }}/>Sending...</>) : "Send Message →"}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <Footer/>
    </div>
  );
}
