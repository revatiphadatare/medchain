import { useState, useEffect } from "react";
import { dashAPI, orderAPI, productAPI, staffAPI, inventoryAPI } from "../../../api";
import { Card, SectionTitle, StatCard, DataTable, TabBar, Badge, Btn, Modal,
         Input, Select, fmtCurrency, fmtDate, MiniBarChart, HBarChart, Spinner, useForm } from "../../../components/common";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const TABS = [
  {id:"overview",  icon:"📊", label:"Overview"},
  {id:"inventory", icon:"📦", label:"Inventory"},
  {id:"orders",    icon:"🛒", label:"B2B Orders"},
  {id:"sales",     icon:"📈", label:"Sales Reports"},
  {id:"staff",     icon:"👥", label:"Staff"},
];
const C = "#10B981";

function Overview({ storeId }) {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    Promise.all([dashAPI.storeOwner(), orderAPI.getAll({ limit:5 })])
      .then(([d,o]) => { setStats(d.data?.data || d.data || {}); setOrders(Array.isArray(o.data?.data) ? o.data.data : []); })
      .catch(() => toast.error("Failed to load"));
  }, []);

  if (!stats) return <Spinner/>;
  const monthlyData = stats.monthlyRevenue || [];

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:22}}>
        <StatCard icon="📦" label="Total Orders"   value={stats.totalOrders} color={C}/>
        <StatCard icon="💰" label="Total Revenue"  value={fmtCurrency(stats.totalRevenue)} color={C}/>
        <StatCard icon="👥" label="Staff Count"    value={stats.staffCount ?? 0} color={C}/>
        <StatCard icon="⚠️" label="Low Stock Items" value={stats.productStats?.find(p=>p._id==="low_stock")?.count||0} color={C}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:18,marginBottom:18}}>
        <Card>
          <SectionTitle>Monthly Revenue</SectionTitle>
          <MiniBarChart data={monthlyData} color={C}/>
          {stats.topProducts?.length > 0 && (
            <div style={{marginTop:18,borderTop:"1px solid #F1F5F9",paddingTop:14}}>
              <div style={{fontWeight:700,fontSize:13,marginBottom:12,color:"#0F172A"}}>Top Products by Revenue</div>
              <HBarChart
                color={C}
                data={(stats.topProducts||[]).map(p=>({label:p.product?.name||"Unknown",value:p.totalRev||0}))}
                valueFormatter={fmtCurrency}
              />
            </div>
          )}
        </Card>
        <Card>
          <SectionTitle>Quick Actions</SectionTitle>
          {[["🛒 Place B2B Order","Place new order"],["📦 Check Inventory","View stock levels"],["📊 Sales Report","View analytics"]].map(([l,d],i)=>(
            <div key={i} style={{padding:"12px",background:"#F8FAFC",border:"1px solid #E8EEF4",
              borderRadius:10,marginBottom:8}}>
              <div style={{fontWeight:600,fontSize:13,color:"#334155"}}>{l}</div>
              <div style={{fontSize:11,color:"#94A3B8",marginTop:2}}>{d}</div>
            </div>
          ))}
        </Card>
      </div>
      <Card>
        <SectionTitle>Recent Orders</SectionTitle>
        <DataTable cols={["Order No","Items","Amount","Status","Date"]} rows={orders}
          renderRow={r=>[
            <td key="on" style={{padding:"10px 16px",fontWeight:800,color:C}}>{r.orderNo}</td>,
            <td key="it" style={{padding:"10px 16px"}}>{r.items?.length} items</td>,
            <td key="am" style={{padding:"10px 16px",fontWeight:700}}>{fmtCurrency(r.totalAmount)}</td>,
            <td key="st" style={{padding:"10px 16px"}}><Badge status={r.status}/></td>,
            <td key="dt" style={{padding:"10px 16px",color:"#94A3B8",fontSize:12}}>{fmtDate(r.createdAt)}</td>,
          ]}
        />
      </Card>
    </div>
  );
}

function Inventory() {
  const [products, setProducts] = useState([]);
  const [alerts, setAlerts] = useState({});
  const [loading, setLoading] = useState(true);
  const [editStock, setEditStock] = useState(null);
  const [newStock, setNewStock] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const [p, a] = await Promise.all([productAPI.getAll(), inventoryAPI.getAlerts()]);
      setProducts(Array.isArray(p.data.data) ? p.data.data : []); setAlerts(a.data.data || {lowStock:[],outOfStock:[],expiringSoon:[]});
    } catch { toast.error("Failed to load inventory"); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); },[]);

  const handleUpdateStock = async () => {
    try {
      await inventoryAPI.updateStock(editStock._id, Number(newStock));
      toast.success("Stock updated"); setEditStock(null); load();
    } catch { toast.error("Failed"); }
  };

  return (
    <Card>
      <div style={{display:"flex",gap:10,marginBottom:16,flexWrap:"wrap"}}>
        {[["All",products.length,"#64748B"],["Low Stock",alerts.lowStock?.length||0,"#F59E0B"],
          ["Out of Stock",alerts.outOfStock?.length||0,"#EF4444"],["Expiring Soon",alerts.expiringSoon?.length||0,"#8B5CF6"]
        ].map(([l,v,col])=>(
          <div key={l} style={{background:col+"12",border:`1px solid ${col}30`,borderRadius:10,padding:"8px 14px",textAlign:"center",minWidth:100}}>
            <div style={{fontWeight:800,color:col,fontSize:17}}>{v}</div>
            <div style={{fontSize:11,color:"#64748B"}}>{l}</div>
          </div>
        ))}
      </div>
      <DataTable loading={loading}
        cols={["Medicine","Category","Batch","B2B Price","MRP","Stock","Expiry","Status","Action"]}
        rows={products}
        renderRow={r=>[
          <td key="n" style={{padding:"11px 16px",fontWeight:800}}>{r.name}</td>,
          <td key="c" style={{padding:"11px 16px",color:"#64748B"}}>{r.category}</td>,
          <td key="b" style={{padding:"11px 16px",fontFamily:"monospace",fontSize:11,color:"#94A3B8"}}>{r.batchNo}</td>,
          <td key="p" style={{padding:"11px 16px",fontWeight:700,color:"#0369A1"}}>₹{r.b2bPrice}</td>,
          <td key="m" style={{padding:"11px 16px",color:"#64748B"}}>₹{r.mrp}</td>,
          <td key="s" style={{padding:"11px 16px",fontWeight:700}}>{r.stock?.toLocaleString()}</td>,
          <td key="e" style={{padding:"11px 16px",fontSize:12,color:"#94A3B8"}}>{fmtDate(r.expiryDate)}</td>,
          <td key="st" style={{padding:"11px 16px"}}><Badge status={r.status}/></td>,
          <td key="ac" style={{padding:"11px 16px"}}><Btn small color={C} outline onClick={()=>{setEditStock(r);setNewStock(r.stock);}}>Update Stock</Btn></td>,
        ]}
      />
      <Modal open={!!editStock} onClose={()=>setEditStock(null)} title={`Update Stock — ${editStock?.name}`}>
        <div style={{marginBottom:16,padding:"12px",background:"#F8FAFC",borderRadius:10,fontSize:13,color:"#475569"}}>
          Current Stock: <strong>{editStock?.stock}</strong> units
        </div>
        <Input label="New Stock Quantity" type="number" value={newStock} onChange={e=>setNewStock(e.target.value)}/>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <Btn outline color="#64748B" onClick={()=>setEditStock(null)}>Cancel</Btn>
          <Btn color={C} onClick={handleUpdateStock}>Update</Btn>
        </div>
      </Modal>
    </Card>
  );
}

function B2BOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [cart, setCart] = useState([]);

  const load = async () => {
    setLoading(true);
    try {
      const [o,p] = await Promise.all([orderAPI.getAll(), productAPI.getAll({status:"in_stock"})]);
      setOrders(Array.isArray(o.data.data) ? o.data.data : []); setProducts(Array.isArray(p.data.data) ? p.data.data : []);
    } catch { toast.error("Failed"); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); },[]);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i=>i.product===product._id);
      if (exists) return prev.map(i=>i.product===product._id?{...i,quantity:i.quantity+1}:i);
      return [...prev, {product:product._id,name:product.name,quantity:1,unitPrice:product.b2bPrice}];
    });
  };

  const placeOrder = async () => {
    if (!cart.length) return toast.error("Cart is empty");
    try {
      await orderAPI.create({ items: cart.map(i=>({product:i.product,quantity:i.quantity})) });
      toast.success("Order placed!"); setShowModal(false); setCart([]); load();
    } catch (err) { toast.error(err.response?.data?.message||"Failed to place order"); }
  };

  const cartTotal = cart.reduce((s,i)=>s+(i.quantity*i.unitPrice),0);

  return (
    <div>
      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:16}}>
        <Btn color={C} onClick={()=>setShowModal(true)}>🛒 Place New B2B Order</Btn>
      </div>
      <Card>
        <SectionTitle>My Orders</SectionTitle>
        <DataTable loading={loading}
          cols={["Order No","Items","Amount","Payment","Status","Date"]}
          rows={orders}
          renderRow={r=>[
            <td key="on" style={{padding:"12px 16px",fontWeight:800,color:C}}>{r.orderNo}</td>,
            <td key="it" style={{padding:"12px 16px"}}>{r.items?.length} items</td>,
            <td key="am" style={{padding:"12px 16px",fontWeight:700}}>{fmtCurrency(r.totalAmount)}</td>,
            <td key="ps" style={{padding:"12px 16px"}}><Badge status={r.paymentStatus}/></td>,
            <td key="st" style={{padding:"12px 16px"}}><Badge status={r.status}/></td>,
            <td key="dt" style={{padding:"12px 16px",color:"#94A3B8",fontSize:12}}>{fmtDate(r.createdAt)}</td>,
          ]}
        />
      </Card>

      <Modal open={showModal} onClose={()=>{setShowModal(false);setCart([]);}} title="Place B2B Order">
        <div style={{maxHeight:280,overflowY:"auto",marginBottom:16}}>
          {products.map(p=>(
            <div key={p._id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #F1F5F9"}}>
              <div>
                <div style={{fontWeight:600,fontSize:13,color:"#0F172A"}}>{p.name}</div>
                <div style={{fontSize:11,color:"#94A3B8"}}>₹{p.b2bPrice}/unit · Stock: {p.stock}</div>
              </div>
              <Btn small color={C} onClick={()=>addToCart(p)}>+ Add</Btn>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div style={{background:"#F0FDF4",border:"1px solid #A7F3D0",borderRadius:12,padding:14,marginBottom:16}}>
            <div style={{fontWeight:700,fontSize:13,marginBottom:8}}>Cart ({cart.length} items)</div>
            {cart.map((i,idx)=>(
              <div key={idx} style={{display:"flex",justifyContent:"space-between",fontSize:12,padding:"3px 0"}}>
                <span>{i.name} × {i.quantity}</span>
                <span style={{fontWeight:700}}>₹{(i.quantity*i.unitPrice).toFixed(2)}</span>
              </div>
            ))}
            <div style={{borderTop:"1px solid #A7F3D0",paddingTop:8,marginTop:8,display:"flex",justifyContent:"space-between",fontWeight:800}}>
              <span>Total</span><span style={{color:"#10B981"}}>{fmtCurrency(cartTotal)}</span>
            </div>
          </div>
        )}
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <Btn outline color="#64748B" onClick={()=>{setShowModal(false);setCart([]);}}>Cancel</Btn>
          <Btn color={C} onClick={placeOrder} disabled={!cart.length}>Place Order</Btn>
        </div>
      </Modal>
    </div>
  );
}

function SalesReports() {
  const [stats, setStats] = useState(null);
  useEffect(()=>{
    dashAPI.storeOwner().then(({data})=>setStats(data?.data || data || {})).catch(()=>toast.error("Failed"));
  },[]);
  if (!stats) return <Spinner/>;
  const monthlyData = stats.monthlyRevenue || [];
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const avgRev = monthlyData.length ? monthlyData.reduce((s,d)=>s+(d.revenue||d.val||0),0)/monthlyData.length : 0;
  const bestMonth = monthlyData.reduce((b,d)=>{
    const v = d.revenue||d.val||0;
    const label = d.month || (d._id?.month ? MONTHS[d._id.month-1] : "");
    return v > (b.val||0) ? {val:v, month:label} : b;
  }, {val:0, month:""});

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:14,marginBottom:22}}>
        <StatCard icon="💰" label="Total Revenue" value={fmtCurrency(stats.totalRevenue)} color={C}/>
        <StatCard icon="📦" label="Total Orders"  value={stats.totalOrders} color={C}/>
        <StatCard icon="📈" label="Avg / Month"   value={fmtCurrency(Math.round(avgRev))} color={C}/>
        <StatCard icon="🏆" label="Best Month"    value={bestMonth.month||"—"} sub={fmtCurrency(bestMonth.val)} color={C}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:18}}>
        <Card>
          <SectionTitle>Monthly Revenue Trend</SectionTitle>
          <MiniBarChart data={monthlyData} color={C}/>
          {stats.topProducts?.length > 0 && (
            <div style={{marginTop:18,borderTop:"1px solid #F1F5F9",paddingTop:14}}>
              <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>Top Selling Products</div>
              <HBarChart
                color={C}
                data={(stats.topProducts||[]).map(p=>({label:p.product?.name||"Unknown",value:p.totalRev||0}))}
                valueFormatter={fmtCurrency}
              />
              {(stats.topProducts||[]).map((p,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:11,color:"#94A3B8"}}>
                  <span>{p.product?.name}</span><span>{p.totalQty} units</span>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card>
          <SectionTitle>Product Status</SectionTitle>
          {(stats.productStats||[]).map((p,i)=>(
            <div key={i} style={{marginBottom:12}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:12,color:"#475569",fontWeight:600,textTransform:"capitalize"}}>{p._id?.replace("_"," ")}</span>
                <span style={{fontSize:13,fontWeight:800,color:p._id==="in_stock"?"#10B981":p._id==="out_of_stock"?"#EF4444":"#F59E0B"}}>{p.count}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function Staff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, handleChange, resetForm, setForm] = useForm({name:"",role:"",shift:"Morning",phone:"",email:"",monthlySales:0});

  const load = async () => {
    setLoading(true);
    try { const {data} = await staffAPI.getAll(); setStaff(Array.isArray(data.data) ? data.data : []); }
    catch { toast.error("Failed"); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) await staffAPI.update(editItem._id, form);
      else await staffAPI.create(form);
      toast.success(editItem?"Updated!":"Staff added!"); setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message||"Failed"); }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Remove this staff?")) return;
    try { await staffAPI.remove(id); toast.success("Removed"); load(); }
    catch { toast.error("Failed"); }
  };

  const toggleDuty = async (s) => {
    try {
      await staffAPI.update(s._id, { status: s.status==="on_duty"?"off_duty":"on_duty" });
      load();
    } catch { toast.error("Failed"); }
  };

  return (
    <Card>
      <SectionTitle action={<Btn color={C} onClick={()=>{resetForm();setEditItem(null);setShowModal(true);}}>+ Add Staff</Btn>}>Staff Management</SectionTitle>
      <DataTable loading={loading}
        cols={["Name","Role","Shift","Status","Joined","Sales","Actions"]}
        rows={staff}
        renderRow={r=>[
          <td key="n" style={{padding:"12px 16px"}}>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <div style={{width:36,height:36,borderRadius:10,background:"#D1FAE5",color:"#065F46",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:13}}>
                {r.name?.[0]}
              </div>
              <span style={{fontWeight:700,color:"#0F172A",fontSize:13}}>{r.name}</span>
            </div>
          </td>,
          <td key="r" style={{padding:"12px 16px",color:"#475569"}}>{r.role}</td>,
          <td key="sh" style={{padding:"12px 16px",color:"#64748B"}}>{r.shift}</td>,
          <td key="st" style={{padding:"12px 16px"}}><Badge status={r.status}/></td>,
          <td key="j" style={{padding:"12px 16px",color:"#94A3B8",fontSize:12}}>{fmtDate(r.joinedAt)}</td>,
          <td key="s" style={{padding:"12px 16px",fontWeight:700,color:r.monthlySales>0?"#10B981":"#94A3B8"}}>{r.monthlySales>0?fmtCurrency(r.monthlySales):"—"}</td>,
          <td key="ac" style={{padding:"12px 16px",display:"flex",gap:6}}>
            <Btn small color={r.status==="on_duty"?"#F59E0B":"#10B981"} outline onClick={()=>toggleDuty(r)}>{r.status==="on_duty"?"Off":"On Duty"}</Btn>
            <Btn small color="#EF4444" outline onClick={()=>handleRemove(r._id)}>Remove</Btn>
          </td>,
        ]}
      />
      <Modal open={showModal} onClose={()=>setShowModal(false)} title={editItem?"Edit Staff":"Add Staff"}>
        <form onSubmit={handleSubmit}>
          <Input label="Full Name" name="name" value={form.name} onChange={handleChange} required/>
          <Input label="Role / Designation" name="role" value={form.role} onChange={handleChange} required/>
          <Select label="Shift" name="shift" value={form.shift} onChange={handleChange}>
            <option>Morning</option><option>Evening</option><option>Night</option>
          </Select>
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange}/>
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
            <Btn outline color="#64748B" onClick={()=>setShowModal(false)}>Cancel</Btn>
            <Btn type="submit" color={C}>{editItem?"Update":"Add"}</Btn>
          </div>
        </form>
      </Modal>
    </Card>
  );
}

export default function StoreOwnerDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState("overview");
  return (
    <div>
      <div style={{background:"#ECFDF5",border:"1px solid #A7F3D0",borderRadius:12,padding:"11px 16px",marginBottom:18,fontSize:13,color:"#065F46",fontWeight:600}}>
        🏪 {user?.store?.name || "Your Store"} &nbsp;·&nbsp; <span style={{fontWeight:400,color:"#10B981"}}>{user?.store?.city || ""}{user?.store?.gstin ? " · GST: " + user.store.gstin : ""}</span>
      </div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} color={C}/>
      {tab==="overview"  && <Overview/>}
      {tab==="inventory" && <Inventory/>}
      {tab==="orders"    && <B2BOrders/>}
      {tab==="sales"     && <SalesReports/>}
      {tab==="staff"     && <Staff/>}
    </div>
  );
}
