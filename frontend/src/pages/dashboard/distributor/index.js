import { useState, useEffect } from "react";
import { dashAPI, orderAPI, storeAPI, productAPI } from "../../../api";
import { Card, SectionTitle, StatCard, DataTable, TabBar, Badge, Btn,
         fmtCurrency, fmtDate, MiniBarChart, DonutChart, Spinner } from "../../../components/common";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const TABS = [
  {id:"overview", icon:"📊", label:"Overview"},
  {id:"dispatch", icon:"🚚", label:"Dispatch Queue"},
  {id:"clients",  icon:"🏪", label:"Client Stores"},
  {id:"catalog",  icon:"💊", label:"Supply Catalog"},
];
const C = "#8B5CF6";

function Overview() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  useEffect(()=>{
    Promise.all([dashAPI.distributor(), orderAPI.getAll({limit:5})])
      .then(([d,o])=>{ setStats(d.data?.data || d.data || {}); setOrders(Array.isArray(o.data?.data) ? o.data.data : []); })
      .catch(()=>toast.error("Failed"));
  },[]);
  if (!stats) return <Spinner/>;
  const monthlyData = stats.monthlyDispatch || [];

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:22}}>
        <StatCard icon="🚚" label="In Transit"       value={stats.inTransit ?? 0} color={C}/>
        <StatCard icon="📦" label="Pending Dispatch" value={stats.pendingDispatch ?? 0} color={C}/>
        <StatCard icon="🏪" label="Client Stores"    value={stats.totalClients ?? 0} color={C}/>
        <StatCard icon="💰" label="Total Revenue"    value={fmtCurrency(stats.monthlyRevenue ?? 0)} color={C}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:18,marginBottom:18}}>
        <Card>
          <SectionTitle>Monthly Dispatch Trend</SectionTitle>
          <MiniBarChart data={monthlyData} color={C}/>
        </Card>
        <Card>
          <SectionTitle>Delivery Status</SectionTitle>
          <DonutChart size={130}
            data={(stats.deliveryBreakdown||[]).map(d=>({
              label: d._id,
              value: d.count,
              color: d._id==="delivered"?"#10B981"
                   : d._id==="cancelled"?"#EF4444"
                   : d._id==="shipped"?"#3B82F6"
                   : d._id==="processing"?"#8B5CF6"
                   : "#F59E0B"
            }))}
          />
        </Card>
      </div>
      <Card>
        <SectionTitle>Recent Dispatch Orders</SectionTitle>
        <DataTable cols={["Order No","Store","Amount","Status","Date"]} rows={orders}
          renderRow={r=>[
            <td key="on" style={{padding:"10px 16px",fontWeight:800,color:C}}>{r.orderNo}</td>,
            <td key="st" style={{padding:"10px 16px"}}>{r.store?.name}</td>,
            <td key="am" style={{padding:"10px 16px",fontWeight:700}}>{fmtCurrency(r.totalAmount)}</td>,
            <td key="ss" style={{padding:"10px 16px"}}><Badge status={r.status}/></td>,
            <td key="dt" style={{padding:"10px 16px",color:"#94A3B8",fontSize:12}}>{fmtDate(r.createdAt)}</td>,
          ]}
        />
      </Card>
    </div>
  );
}

function DispatchQueue() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { const {data} = await orderAPI.getAll(); setOrders(Array.isArray(data.data) ? data.data : []); }
    catch { toast.error("Failed"); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); },[]);

  const handleDispatch = async (id, newStatus) => {
    try {
      await orderAPI.updateStatus(id, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      setOrders(prev=>prev.map(o=>o._id===id?{...o,status:newStatus}:o));
    } catch { toast.error("Failed"); }
  };

  return (
    <Card>
      <SectionTitle>Dispatch Queue</SectionTitle>
      <DataTable loading={loading}
        cols={["Order No","Store","City","Items","Amount","Status","Priority","Action"]}
        rows={orders}
        renderRow={r=>[
          <td key="on" style={{padding:"12px 16px",fontWeight:800,color:C}}>{r.orderNo}</td>,
          <td key="st" style={{padding:"12px 16px",fontWeight:600}}>{r.store?.name}</td>,
          <td key="ci" style={{padding:"12px 16px",color:"#64748B"}}>📍{r.store?.city}</td>,
          <td key="it" style={{padding:"12px 16px"}}>{r.items?.length}</td>,
          <td key="am" style={{padding:"12px 16px",fontWeight:700}}>{fmtCurrency(r.totalAmount)}</td>,
          <td key="ss" style={{padding:"12px 16px"}}><Badge status={r.status}/></td>,
          <td key="pr" style={{padding:"12px 16px"}}>
            <span style={{background:r.status==="pending"?"#FEE2E2":"#F1F5F9",
              color:r.status==="pending"?"#991B1B":"#64748B",
              padding:"2px 8px",borderRadius:10,fontSize:11,fontWeight:700}}>
              {r.status==="pending"?"HIGH":"NORMAL"}
            </span>
          </td>,
          <td key="ac" style={{padding:"12px 16px",display:"flex",gap:6}}>
            {r.status==="processing" && <Btn small color={C} onClick={()=>handleDispatch(r._id,"shipped")}>Ship</Btn>}
            {r.status==="shipped"    && <Btn small color="#10B981" onClick={()=>handleDispatch(r._id,"delivered")}>Deliver</Btn>}
            {r.status==="delivered"  && <span style={{color:"#94A3B8",fontSize:12}}>Done</span>}
          </td>,
        ]}
      />
    </Card>
  );
}

function ClientStores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    storeAPI.getAll({status:"active"})
      .then(({data})=>setStores(Array.isArray(data.data) ? data.data : []))
      .catch(()=>toast.error("Failed"))
      .finally(()=>setLoading(false));
  },[]);

  return (
    <Card>
      <SectionTitle>Active Client Stores</SectionTitle>
      <DataTable loading={loading}
        cols={["Store","Owner","City","GSTIN","Orders","Revenue","Status"]}
        rows={stores}
        renderRow={r=>[
          <td key="n" style={{padding:"12px 16px",fontWeight:800}}>{r.name}</td>,
          <td key="o" style={{padding:"12px 16px",color:"#475569"}}>{r.owner?.name||"—"}</td>,
          <td key="c" style={{padding:"12px 16px",color:"#64748B"}}>📍{r.city}</td>,
          <td key="g" style={{padding:"12px 16px",fontFamily:"monospace",fontSize:11,color:"#94A3B8"}}>{r.gstin}</td>,
          <td key="or" style={{padding:"12px 16px",fontWeight:700}}>{r.totalOrders||0}</td>,
          <td key="rv" style={{padding:"12px 16px",fontWeight:800,color:"#10B981"}}>{fmtCurrency(r.totalRevenue||0)}</td>,
          <td key="st" style={{padding:"12px 16px"}}><Badge status={r.status}/></td>,
        ]}
      />
    </Card>
  );
}

function SupplyCatalog() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{
    productAPI.getAll().then(({data})=>setProducts(Array.isArray(data.data) ? data.data : []))
      .catch(()=>toast.error("Failed")).finally(()=>setLoading(false));
  },[]);

  return (
    <Card>
      <SectionTitle>My Supply Catalog</SectionTitle>
      <DataTable loading={loading}
        cols={["Medicine","Category","B2B Price","MRP","Available Stock","Supplier","Expiry","Status"]}
        rows={products}
        renderRow={r=>[
          <td key="n" style={{padding:"11px 16px",fontWeight:800}}>{r.name}</td>,
          <td key="c" style={{padding:"11px 16px",color:"#64748B"}}>{r.category}</td>,
          <td key="p" style={{padding:"11px 16px",fontWeight:700,color:C}}>₹{r.b2bPrice}</td>,
          <td key="m" style={{padding:"11px 16px",color:"#64748B"}}>₹{r.mrp}</td>,
          <td key="s" style={{padding:"11px 16px",fontWeight:700}}>{r.stock?.toLocaleString()}</td>,
          <td key="su" style={{padding:"11px 16px",color:"#475569"}}>{r.supplier}</td>,
          <td key="e" style={{padding:"11px 16px",fontSize:12,color:"#94A3B8"}}>{fmtDate(r.expiryDate)}</td>,
          <td key="st" style={{padding:"11px 16px"}}><Badge status={r.status}/></td>,
        ]}
      />
    </Card>
  );
}

export default function DistributorDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("overview");
  return (
    <div>
      <div style={{background:"#F5F3FF",border:"1px solid #DDD6FE",borderRadius:12,padding:"11px 16px",marginBottom:18,fontSize:13,color:"#4C1D95",fontWeight:600}}>
        🚚 <span>{user?.company || user?.name || "Distribution Partner"}</span> &nbsp;·&nbsp; <span style={{fontWeight:400,color:"#7C3AED"}}>Verified Distributor</span>
      </div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} color={C}/>
      {tab==="overview" && <Overview/>}
      {tab==="dispatch" && <DispatchQueue/>}
      {tab==="clients"  && <ClientStores/>}
      {tab==="catalog"  && <SupplyCatalog/>}
    </div>
  );
}
