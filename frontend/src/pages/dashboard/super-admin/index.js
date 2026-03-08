import { useState, useEffect, useCallback } from "react";
import { dashAPI, storeAPI, productAPI, orderAPI, userAPI } from "../../../api";
import { Card, SectionTitle, StatCard, DataTable, TabBar, Badge, Btn, Modal,
         Input, Select, fmtCurrency, fmtDate, MiniBarChart, DonutChart, HBarChart, Spinner, ROLE_META, useForm } from "../../../components/common";
import toast from "react-hot-toast";

const TABS = [
  {id:"overview", icon:"📊", label:"Overview"},
  {id:"stores",   icon:"🏪", label:"All Stores"},
  {id:"products", icon:"💊", label:"Products"},
  {id:"orders",   icon:"📦", label:"Orders"},
  {id:"users",    icon:"👥", label:"Users & Roles"},
];
const C = "#0EA5E9";

// ── Overview Tab
function Overview() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    Promise.all([dashAPI.superAdmin(), orderAPI.getAll({ limit:5 })])
      .then(([d, o]) => { setStats(d.data?.data || d.data || {}); setOrders(o.data?.data || o.data || []); })
      .catch(() => toast.error("Failed to load dashboard"));
  }, []);

  if (!stats) return <Spinner />;

  // Pass raw MongoDB data directly — MiniBarChart normalizes internally
  const monthlyData = stats.monthlyRevenue || [];

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(190px,1fr))",gap:14,marginBottom:24}}>
        <StatCard icon="🏪" label="Total Stores"   value={stats.totalStores}  sub={`${stats.storeBreakdown?.find(s=>s._id==="active")?.count||0} active`} color={C}/>
        <StatCard icon="📦" label="Total Orders"   value={(stats.totalOrders ?? 0).toLocaleString()}  color={C}/>
        <StatCard icon="💰" label="Platform GMV"   value={fmtCurrency(stats.totalRevenue)} color={C}/>
        <StatCard icon="💊" label="Products"       value={stats.totalProducts} color={C}/>
        <StatCard icon="👥" label="Users"          value={stats.totalUsers}  color={C}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:18,marginBottom:18}}>
        <Card>
          <SectionTitle>Monthly Revenue Trend</SectionTitle>
          <MiniBarChart data={monthlyData} color={C}/>
        </Card>
        <Card>
          <SectionTitle>Stores by Status</SectionTitle>
          <DonutChart
            data={(stats.storeBreakdown||[]).map(r=>({
              label: r._id,
              value: r.count,
              color: r._id==="active"?"#10B981":r._id==="suspended"?"#EF4444":"#F59E0B"
            }))}
          />
          <div style={{marginTop:16,borderTop:"1px solid #F1F5F9",paddingTop:14}}>
            <div style={{fontWeight:700,fontSize:13,marginBottom:12}}>Top Cities</div>
            <HBarChart
              color={C}
              data={(stats.cityBreakdown||[]).slice(0,5).map(c=>({label:`📍 ${c._id}`, value:c.count}))}
              valueFormatter={v=>`${v} stores`}
            />
          </div>
        </Card>
      </div>
      <Card>
        <SectionTitle>Recent Orders</SectionTitle>
        <DataTable
          cols={["Order No","Store","Amount","Payment","Status","Date"]}
          rows={orders}
          renderRow={r=>[
            <td key="on" style={{padding:"11px 16px",fontWeight:800,color:C}}>{r.orderNo}</td>,
            <td key="st" style={{padding:"11px 16px"}}>{r.store?.name}</td>,
            <td key="am" style={{padding:"11px 16px",fontWeight:700}}>{fmtCurrency(r.totalAmount)}</td>,
            <td key="ps" style={{padding:"11px 16px"}}><Badge status={r.paymentStatus}/></td>,
            <td key="ss" style={{padding:"11px 16px"}}><Badge status={r.status}/></td>,
            <td key="dt" style={{padding:"11px 16px",color:"#94A3B8",fontSize:12}}>{fmtDate(r.createdAt)}</td>,
          ]}
        />
      </Card>
    </div>
  );
}

// ── Stores Tab
function Stores() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [form, handleChange, resetForm] = useForm({name:"",city:"",gstin:"",phone:"",email:"",address:""});

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await storeAPI.getAll({ search });
      setStores(Array.isArray(data.data) ? data.data : []);
    } catch { toast.error("Failed to load stores"); }
    finally { setLoading(false); }
  }, [search]);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await storeAPI.create(form);
      toast.success("Store created!"); setShowModal(false); resetForm(); load();
    } catch (err) { toast.error(err.response?.data?.message || "Failed"); }
  };

  const handleStatus = async (id, status) => {
    try { await storeAPI.updateStatus(id, status); toast.success(`Store ${status}`); load(); }
    catch { toast.error("Failed to update status"); }
  };

  return (
    <Card>
      <SectionTitle action={
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <input value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search stores..." style={{padding:"7px 12px",border:"1.5px solid #E2E8F0",
            borderRadius:10,fontSize:13,fontFamily:"inherit",outline:"none"}}/>
          <Btn color={C} onClick={()=>setShowModal(true)}>+ Add Store</Btn>
        </div>
      }>All Medical Stores</SectionTitle>

      <DataTable loading={loading}
        cols={["Store","Owner","City","GSTIN","Orders","Revenue","Status","Actions"]}
        rows={stores}
        renderRow={r=>[
          <td key="n" style={{padding:"12px 16px",fontWeight:800,color:"#0F172A"}}>{r.name}</td>,
          <td key="o" style={{padding:"12px 16px",color:"#475569"}}>{r.owner?.name||"—"}</td>,
          <td key="c" style={{padding:"12px 16px",color:"#64748B"}}>📍{r.city}</td>,
          <td key="g" style={{padding:"12px 16px",fontFamily:"monospace",fontSize:11,color:"#94A3B8"}}>{r.gstin}</td>,
          <td key="or" style={{padding:"12px 16px",fontWeight:700}}>{r.totalOrders||0}</td>,
          <td key="rv" style={{padding:"12px 16px",fontWeight:800,color:"#10B981"}}>{fmtCurrency(r.totalRevenue||0)}</td>,
          <td key="st" style={{padding:"12px 16px"}}><Badge status={r.status}/></td>,
          <td key="ac" style={{padding:"12px 16px",display:"flex",gap:6}}>
            {r.status==="pending"   && <Btn small color="#10B981" onClick={()=>handleStatus(r._id,"active")}>Approve</Btn>}
            {r.status==="active"    && <Btn small color="#EF4444" outline onClick={()=>handleStatus(r._id,"suspended")}>Suspend</Btn>}
            {r.status==="suspended" && <Btn small color="#10B981" onClick={()=>handleStatus(r._id,"active")}>Restore</Btn>}
          </td>,
        ]}
      />

      <Modal open={showModal} onClose={()=>setShowModal(false)} title="Add New Store">
        <form onSubmit={handleCreate}>
          <Input label="Store Name" name="name" value={form.name} onChange={handleChange} required/>
          <Input label="City" name="city" value={form.city} onChange={handleChange} required/>
          <Input label="GSTIN" name="gstin" value={form.gstin} onChange={handleChange} required/>
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange}/>
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange}/>
          <Input label="Address" name="address" value={form.address} onChange={handleChange}/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
            <Btn outline color="#64748B" onClick={()=>setShowModal(false)}>Cancel</Btn>
            <Btn type="submit" color={C}>Create Store</Btn>
          </div>
        </form>
      </Modal>
    </Card>
  );
}

// ── Products Tab
function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [form, handleChange, resetForm, setForm] = useForm({
    name:"",category:"",stock:0,b2bPrice:"",mrp:"",supplier:"",expiryDate:"",batchNo:""
  });

  const load = async () => {
    setLoading(true);
    try { const {data} = await productAPI.getAll(); setProducts(Array.isArray(data.data) ? data.data : []); }
    catch { toast.error("Failed to load products"); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); },[]);

  const openAdd = () => { resetForm(); setEditItem(null); setShowModal(true); };
  const openEdit = (p) => {
    setForm({ name:p.name, category:p.category, stock:p.stock, b2bPrice:p.b2bPrice,
      mrp:p.mrp, supplier:p.supplier, batchNo:p.batchNo,
      expiryDate: p.expiryDate ? p.expiryDate.slice(0,10) : "" });
    setEditItem(p); setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editItem) { await productAPI.update(editItem._id, form); toast.success("Updated!"); }
      else { await productAPI.create(form); toast.success("Product added!"); }
      setShowModal(false); load();
    } catch (err) { toast.error(err.response?.data?.message||"Failed"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try { await productAPI.remove(id); toast.success("Deleted"); load(); }
    catch { toast.error("Failed to delete"); }
  };

  return (
    <Card>
      <SectionTitle action={<Btn color={C} onClick={openAdd}>+ Add Product</Btn>}>Product Catalog</SectionTitle>
      <DataTable loading={loading}
        cols={["Medicine","Category","Stock","B2B Price","MRP","Supplier","Expiry","Status","Actions"]}
        rows={products}
        renderRow={r=>[
          <td key="n" style={{padding:"11px 16px",fontWeight:800}}>{r.name}</td>,
          <td key="c" style={{padding:"11px 16px",color:"#64748B"}}>{r.category}</td>,
          <td key="s" style={{padding:"11px 16px",fontWeight:700}}>{r.stock?.toLocaleString()}</td>,
          <td key="p" style={{padding:"11px 16px",fontWeight:700,color:"#0369A1"}}>₹{r.b2bPrice}</td>,
          <td key="m" style={{padding:"11px 16px",color:"#64748B"}}>₹{r.mrp}</td>,
          <td key="su" style={{padding:"11px 16px",color:"#475569"}}>{r.supplier}</td>,
          <td key="e" style={{padding:"11px 16px",fontSize:12,color:"#94A3B8"}}>{fmtDate(r.expiryDate)}</td>,
          <td key="st" style={{padding:"11px 16px"}}><Badge status={r.status}/></td>,
          <td key="ac" style={{padding:"11px 16px",display:"flex",gap:6}}>
            <Btn small color={C} outline onClick={()=>openEdit(r)}>Edit</Btn>
            <Btn small color="#EF4444" outline onClick={()=>handleDelete(r._id)}>Del</Btn>
          </td>,
        ]}
      />
      <Modal open={showModal} onClose={()=>setShowModal(false)} title={editItem?"Edit Product":"Add Product"}>
        <form onSubmit={handleSubmit}>
          <Input label="Medicine Name" name="name" value={form.name} onChange={handleChange} required/>
          <Input label="Category" name="category" value={form.category} onChange={handleChange} required/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label="Stock" name="stock" type="number" value={form.stock} onChange={handleChange} required/>
            <Input label="Batch No" name="batchNo" value={form.batchNo} onChange={handleChange} required/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <Input label="B2B Price (₹)" name="b2bPrice" type="number" step="0.01" value={form.b2bPrice} onChange={handleChange} required/>
            <Input label="MRP (₹)" name="mrp" type="number" step="0.01" value={form.mrp} onChange={handleChange} required/>
          </div>
          <Input label="Supplier" name="supplier" value={form.supplier} onChange={handleChange} required/>
          <Input label="Expiry Date" name="expiryDate" type="date" value={form.expiryDate} onChange={handleChange} required/>
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
            <Btn outline color="#64748B" onClick={()=>setShowModal(false)}>Cancel</Btn>
            <Btn type="submit" color={C}>{editItem?"Update":"Add Product"}</Btn>
          </div>
        </form>
      </Modal>
    </Card>
  );
}

// ── Orders Tab
function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    setLoading(true);
    orderAPI.getAll({ status: statusFilter || undefined })
      .then(({data}) => setOrders(Array.isArray(data.data) ? data.data : []))
      .catch(() => toast.error("Failed to load orders"))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const handleStatus = async (id, status) => {
    try { await orderAPI.updateStatus(id, status); toast.success("Status updated");
      setOrders(prev => prev.map(o => o._id===id ? {...o, status} : o));
    } catch { toast.error("Failed"); }
  };

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:20}}>
        {["","pending","processing","shipped","delivered","cancelled"].map(s => (
          <button key={s} onClick={()=>setStatusFilter(s)} style={{
            padding:"8px 12px", borderRadius:10, border:"1.5px solid",
            borderColor: statusFilter===s ? C : "#E2E8F0",
            background: statusFilter===s ? C : "#fff",
            color: statusFilter===s ? "#fff" : "#64748B",
            fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:"inherit", textTransform:"capitalize"
          }}>{s||"All Orders"}</button>
        ))}
      </div>
      <Card>
        <DataTable loading={loading}
          cols={["Order No","Store","Items","Amount","Payment","Status","Date","Action"]}
          rows={orders}
          renderRow={r=>[
            <td key="on" style={{padding:"12px 16px",fontWeight:800,color:C}}>{r.orderNo}</td>,
            <td key="st" style={{padding:"12px 16px"}}>{r.store?.name}</td>,
            <td key="it" style={{padding:"12px 16px"}}>{r.items?.length} items</td>,
            <td key="am" style={{padding:"12px 16px",fontWeight:700}}>{fmtCurrency(r.totalAmount)}</td>,
            <td key="ps" style={{padding:"12px 16px"}}><Badge status={r.paymentStatus}/></td>,
            <td key="ss" style={{padding:"12px 16px"}}><Badge status={r.status}/></td>,
            <td key="dt" style={{padding:"12px 16px",color:"#94A3B8",fontSize:12}}>{fmtDate(r.createdAt)}</td>,
            <td key="ac" style={{padding:"12px 16px"}}>
              {r.status==="pending" && <Btn small color="#6D28D9" onClick={()=>handleStatus(r._id,"processing")}>Process</Btn>}
              {r.status==="processing" && <Btn small color="#1D4ED8" onClick={()=>handleStatus(r._id,"shipped")}>Ship</Btn>}
              {r.status==="shipped" && <Btn small color="#10B981" onClick={()=>handleStatus(r._id,"delivered")}>Deliver</Btn>}
            </td>,
          ]}
        />
      </Card>
    </div>
  );
}

// ── Users Tab
function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [stores, setStores] = useState([]);
  const [form, handleChange, resetForm] = useForm({name:"",email:"",password:"Password@123",role:"store_owner",phone:"",store:"",company:""});

  const load = async () => {
    setLoading(true);
    try {
      const [u, s] = await Promise.all([userAPI.getAll(), storeAPI.getAll()]);
      setUsers(Array.isArray(u.data.data) ? u.data.data : []); setStores(Array.isArray(s.data.data) ? s.data.data : []);
    } catch { toast.error("Failed"); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ load(); },[]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await userAPI.create(form); toast.success("User created!"); setShowModal(false); resetForm(); load();
    } catch (err) { toast.error(err.response?.data?.message||"Failed"); }
  };

  const handleToggle = async (id) => {
    try { await userAPI.toggle(id); toast.success("Status toggled"); load(); }
    catch { toast.error("Failed"); }
  };

  return (
    <div>
      <Card style={{marginBottom:18}}>
        <SectionTitle action={<Btn color={C} onClick={()=>setShowModal(true)}>+ Invite User</Btn>}>Users</SectionTitle>
        <DataTable loading={loading}
          cols={["Name","Email","Role","Store/Company","Active","Actions"]}
          rows={users}
          renderRow={r=>{
            const rm = ROLE_META[r.role]||{};
            return [
              <td key="n" style={{padding:"12px 16px",fontWeight:800}}>{r.name}</td>,
              <td key="e" style={{padding:"12px 16px",color:"#64748B",fontSize:12}}>{r.email}</td>,
              <td key="r" style={{padding:"12px 16px"}}>
                <span style={{background:rm.lightBg,color:rm.color,padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:700}}>{rm.icon} {rm.label}</span>
              </td>,
              <td key="s" style={{padding:"12px 16px",color:"#475569"}}>{r.store?.name || r.company || "—"}</td>,
              <td key="a" style={{padding:"12px 16px"}}><Badge status={r.isActive?"active":"suspended"} label={r.isActive?"Active":"Inactive"}/></td>,
              <td key="ac" style={{padding:"12px 16px"}}>
                <Btn small color={r.isActive?"#EF4444":"#10B981"} outline onClick={()=>handleToggle(r._id)}>
                  {r.isActive?"Deactivate":"Activate"}
                </Btn>
              </td>,
            ];
          }}
        />
      </Card>

      {/* Permissions Matrix */}
      <Card>
        <SectionTitle>Role Permissions Matrix</SectionTitle>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead>
              <tr style={{background:"#F8FAFC"}}>
                {["Permission","Super Admin","Store Owner","Pharmacist","Distributor"].map(h=>(
                  <th key={h} style={{padding:"9px 14px",textAlign:"left",color:"#64748B",fontWeight:600,borderBottom:"1px solid #E2E8F0"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Manage All Stores","✅","❌","❌","❌"],
                ["Product Catalog","✅","View","❌","✅"],
                ["Place B2B Orders","✅","✅","❌","❌"],
                ["View Analytics","✅","Own Store","❌","Own Data"],
                ["Staff Management","✅","✅","❌","❌"],
                ["User & Role Mgmt","✅","❌","❌","❌"],
                ["Inventory Control","✅","✅","View","✅"],
                ["Dispatch Orders","❌","❌","❌","✅"],
                ["Prescriptions","❌","❌","✅","❌"],
              ].map((row,i)=>(
                <tr key={i} style={{borderBottom:"1px solid #F8FAFC",background:i%2?"#FAFCFF":"#fff"}}>
                  {row.map((cell,j)=>(
                    <td key={j} style={{padding:"9px 14px",color:j===0?"#334155":cell==="✅"?"#10B981":cell==="❌"?"#EF4444":"#64748B",fontWeight:j===0?600:700}}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Modal open={showModal} onClose={()=>setShowModal(false)} title="Create User">
        <form onSubmit={handleCreate}>
          <Input label="Full Name" name="name" value={form.name} onChange={handleChange} required/>
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required/>
          <Input label="Password" name="password" type="password" value={form.password} onChange={handleChange} required/>
          <Input label="Phone" name="phone" value={form.phone} onChange={handleChange}/>
          <Select label="Role" name="role" value={form.role} onChange={handleChange}>
            <option value="store_owner">Store Owner</option>
            <option value="pharmacist">Pharmacist</option>
            <option value="distributor">Distributor</option>
            <option value="super_admin">Super Admin</option>
          </Select>
          {(form.role==="store_owner"||form.role==="pharmacist") && (
            <Select label="Assign Store" name="store" value={form.store} onChange={handleChange}>
              <option value="">Select store...</option>
              {stores.map(s=><option key={s._id} value={s._id}>{s.name}</option>)}
            </Select>
          )}
          {form.role==="distributor" && (
            <Input label="Company Name" name="company" value={form.company} onChange={handleChange}/>
          )}
          <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginTop:8}}>
            <Btn outline color="#64748B" onClick={()=>setShowModal(false)}>Cancel</Btn>
            <Btn type="submit" color={C}>Create User</Btn>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default function SuperAdminDashboard() {
  const [tab, setTab] = useState("overview");
  return (
    <div>
      <TabBar tabs={TABS} active={tab} onChange={setTab} color={C}/>
      {tab==="overview" && <Overview/>}
      {tab==="stores"   && <Stores/>}
      {tab==="products" && <Products/>}
      {tab==="orders"   && <Orders/>}
      {tab==="users"    && <Users/>}
    </div>
  );
}
