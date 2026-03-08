import { useState, useEffect } from "react";
import { dashAPI, productAPI, rxAPI, inventoryAPI } from "../../../api";
import { Card, SectionTitle, StatCard, DataTable, TabBar, Badge, Btn, Modal,
         Input, fmtDate, Spinner, useForm } from "../../../components/common";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const TABS = [
  {id:"overview",      icon:"📊", label:"Overview"},
  {id:"stock",         icon:"📦", label:"Stock Check"},
  {id:"prescriptions", icon:"📋", label:"Prescriptions"},
];
const C = "#F59E0B";

function Overview() {
  const [stats, setStats] = useState(null);
  useEffect(()=>{
    dashAPI.pharmacist().then(({data})=>setStats(data?.data || data || {})).catch(()=>toast.error("Failed"));
  },[]);
  if (!stats) return <Spinner/>;

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:22}}>
        <StatCard icon="📋" label="Pending Prescriptions" value={stats.pendingRx ?? 0} color={C}/>
        <StatCard icon="⚠️" label="Low Stock Items"       value={stats.lowStock ?? 0} color={C}/>
        <StatCard icon="🔴" label="Out of Stock"          value={stats.outOfStock ?? 0} color={C}/>
        <StatCard icon="📅" label="Expiring in 30 Days"  value={stats.expiringSoon ?? 0} color={C}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
        <Card>
          <SectionTitle>🔴 Stock Alerts</SectionTitle>
          {stats.alertProducts?.length === 0 && <div style={{color:"#94A3B8",textAlign:"center",padding:24}}>All stocks are healthy ✅</div>}
          {stats.alertProducts?.map(p=>(
            <div key={p._id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F8FAFC"}}>
              <div>
                <div style={{fontWeight:700,color:"#0F172A",fontSize:13}}>{p.name}</div>
                <div style={{fontSize:11,color:"#94A3B8"}}>{p.category} · {p.supplier}</div>
              </div>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:12,fontWeight:700,marginBottom:3}}>{p.stock} units</div>
                <Badge status={p.status}/>
              </div>
            </div>
          ))}
        </Card>
        <Card>
          <SectionTitle>Today's Quick Stats</SectionTitle>
          {[
            ["💊 Prescriptions Pending", stats.pendingRx, "#F59E0B"],
            ["⚠️ Low Stock Medicines",   stats.lowStock,  "#EF4444"],
            ["📅 Expiring Soon",         stats.expiringSoon, "#8B5CF6"],
          ].map(([l,v,col],i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px",background:"#F8FAFC",borderRadius:10,marginBottom:8}}>
              <span style={{fontSize:13,color:"#334155",fontWeight:500}}>{l}</span>
              <span style={{fontSize:20,fontWeight:900,color:col}}>{v}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function StockCheck() {
  const [products, setProducts] = useState([]);
  const [alerts, setAlerts] = useState({lowStock:[],outOfStock:[],expiringSoon:[]});
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(()=>{
    Promise.all([productAPI.getAll(), inventoryAPI.getAlerts()])
      .then(([p,a]) => { setProducts(Array.isArray(p.data.data) ? p.data.data : []); setAlerts(a.data.data || {lowStock:[],outOfStock:[],expiringSoon:[]}); })
      .catch(()=>toast.error("Failed"))
      .finally(()=>setLoading(false));
  },[]);

  const displayProducts = tab==="all" ? products
    : tab==="low" ? alerts.lowStock
    : tab==="out" ? alerts.outOfStock
    : alerts.expiringSoon;

  return (
    <Card>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        {[["all","All Stock",products.length],["low","Low Stock",alerts.lowStock?.length],["out","Out of Stock",alerts.outOfStock?.length],["expiry","Expiring Soon",alerts.expiringSoon?.length]].map(([k,l,v])=>(
          <button key={k} onClick={()=>setTab(k)} style={{padding:"7px 14px",borderRadius:10,border:"1.5px solid",
            borderColor:tab===k?C:"#E2E8F0",background:tab===k?C:"#fff",
            color:tab===k?"#fff":"#64748B",fontWeight:600,fontSize:12,cursor:"pointer",fontFamily:"inherit"}}>
            {l} ({v||0})
          </button>
        ))}
      </div>
      <DataTable loading={loading}
        cols={["Medicine","Category","Stock","Expiry","Batch","Supplier","Status"]}
        rows={displayProducts||[]}
        renderRow={r=>[
          <td key="n" style={{padding:"11px 16px",fontWeight:800}}>{r.name}</td>,
          <td key="c" style={{padding:"11px 16px",color:"#64748B"}}>{r.category}</td>,
          <td key="s" style={{padding:"11px 16px",fontWeight:700}}>{r.stock?.toLocaleString()}</td>,
          <td key="e" style={{padding:"11px 16px",fontSize:12,color:new Date(r.expiryDate)<new Date(Date.now()+30*864e5)?"#EF4444":"#64748B"}}>{fmtDate(r.expiryDate)}</td>,
          <td key="b" style={{padding:"11px 16px",fontFamily:"monospace",fontSize:11,color:"#94A3B8"}}>{r.batchNo}</td>,
          <td key="su" style={{padding:"11px 16px",color:"#475569"}}>{r.supplier}</td>,
          <td key="st" style={{padding:"11px 16px"}}><Badge status={r.status}/></td>,
        ]}
      />
    </Card>
  );
}

function Prescriptions() {
  const { user } = useAuth();
  const [rxs, setRxs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [form, handleChange, resetForm] = useForm({patientName:"",medicine:"",doctor:"",quantity:1,notes:""});

  const load = async () => {
    setLoading(true);
    try { const {data} = await rxAPI.getAll({status:statusFilter||undefined}); setRxs(Array.isArray(data.data) ? data.data : []); }
    catch { toast.error("Failed"); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); },[statusFilter]);

  const handleVerify = async (id, status) => {
    try { await rxAPI.verify(id,{status}); toast.success(`Prescription ${status}`); load(); }
    catch { toast.error("Failed"); }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try { await rxAPI.create(form); toast.success("Prescription added"); setShowAdd(false); resetForm(); load(); }
    catch (err) { toast.error(err.response?.data?.message||"Failed"); }
  };

  return (
    <Card>
      <SectionTitle action={
        <div style={{display:"flex",gap:8}}>
          {["pending","approved","rejected",""].map(s=>(
            <button key={s||"all"} onClick={()=>setStatusFilter(s)} style={{
              padding:"5px 12px",borderRadius:8,border:"1.5px solid",
              borderColor:statusFilter===s?C:"#E2E8F0",background:statusFilter===s?C:"#fff",
              color:statusFilter===s?"#fff":"#64748B",fontWeight:600,fontSize:11,
              cursor:"pointer",fontFamily:"inherit",textTransform:"capitalize"}}>
              {s||"All"}
            </button>
          ))}
          <Btn small color={C} onClick={()=>setShowAdd(true)}>+ Add Rx</Btn>
        </div>
      }>Prescription Queue</SectionTitle>
      <DataTable loading={loading}
        cols={["Patient","Medicine","Doctor","Qty","Status","Date","Actions"]}
        rows={rxs}
        renderRow={r=>[
          <td key="p" style={{padding:"11px 16px",fontWeight:700}}>{r.patientName}</td>,
          <td key="m" style={{padding:"11px 16px",color:"#334155"}}>{r.medicine}</td>,
          <td key="d" style={{padding:"11px 16px",color:"#64748B"}}>{r.doctor}</td>,
          <td key="q" style={{padding:"11px 16px",fontWeight:600}}>{r.quantity}</td>,
          <td key="s" style={{padding:"11px 16px"}}><Badge status={r.status}/></td>,
          <td key="dt" style={{padding:"11px 16px",color:"#94A3B8",fontSize:12}}>{fmtDate(r.createdAt)}</td>,
          <td key="ac" style={{padding:"11px 16px",display:"flex",gap:6}}>
            {r.status==="pending" && <>
              <Btn small color="#10B981" onClick={()=>handleVerify(r._id,"approved")}>✓ Approve</Btn>
              <Btn small color="#EF4444" outline onClick={()=>handleVerify(r._id,"rejected")}>✗ Reject</Btn>
            </>}
          </td>,
        ]}
      />
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add Prescription">
        <form onSubmit={handleCreate}>
          <Input label="Patient Name" name="patientName" value={form.patientName} onChange={handleChange} required/>
          <Input label="Medicine" name="medicine" value={form.medicine} onChange={handleChange} required/>
          <Input label="Doctor" name="doctor" value={form.doctor} onChange={handleChange} required/>
          <Input label="Quantity" name="quantity" type="number" value={form.quantity} onChange={handleChange} required/>
          <Input label="Notes" name="notes" value={form.notes} onChange={handleChange}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
            <Btn outline color="#64748B" onClick={()=>setShowAdd(false)}>Cancel</Btn>
            <Btn type="submit" color={C}>Add Prescription</Btn>
          </div>
        </form>
      </Modal>
    </Card>
  );
}

export default function PharmacistDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("overview");
  return (
    <div>
      <div style={{background:"#FFFBEB",border:"1px solid #FDE68A",borderRadius:12,padding:"11px 16px",marginBottom:18,fontSize:13,color:"#92400E",fontWeight:600}}>
        💊 Dispensary &nbsp;·&nbsp; <span style={{fontWeight:400,color:"#B45309"}}>{user?.store?.name || "Unassigned Store"}</span>
      </div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} color={C}/>
      {tab==="overview"      && <Overview/>}
      {tab==="stock"         && <StockCheck/>}
      {tab==="prescriptions" && <Prescriptions/>}
    </div>
  );
}
