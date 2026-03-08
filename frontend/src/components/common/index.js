import { useState } from "react";

// ── Formatting helpers
export const fmtCurrency = (n) =>
  n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${Number(n || 0).toLocaleString("en-IN")}`;

export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";

// ── Status config
const STATUS_MAP = {
  active:      { bg:"#D1FAE5", color:"#065F46", label:"Active"      },
  pending:     { bg:"#FEF3C7", color:"#92400E", label:"Pending"     },
  suspended:   { bg:"#FEE2E2", color:"#991B1B", label:"Suspended"   },
  in_stock:    { bg:"#D1FAE5", color:"#065F46", label:"In Stock"    },
  low_stock:   { bg:"#FEF3C7", color:"#B45309", label:"Low Stock"   },
  out_of_stock:{ bg:"#FEE2E2", color:"#991B1B", label:"Out of Stock"},
  delivered:   { bg:"#D1FAE5", color:"#065F46", label:"Delivered"   },
  shipped:     { bg:"#DBEAFE", color:"#1D4ED8", label:"Shipped"     },
  processing:  { bg:"#EDE9FE", color:"#6D28D9", label:"Processing"  },
  cancelled:   { bg:"#FEE2E2", color:"#991B1B", label:"Cancelled"   },
  on_duty:     { bg:"#D1FAE5", color:"#065F46", label:"On Duty"     },
  off_duty:    { bg:"#F1F5F9", color:"#475569", label:"Off Duty"    },
  paid:        { bg:"#D1FAE5", color:"#065F46", label:"Paid"        },
  refunded:    { bg:"#FEE2E2", color:"#991B1B", label:"Refunded"    },
  approved:    { bg:"#D1FAE5", color:"#065F46", label:"Approved"    },
  rejected:    { bg:"#FEE2E2", color:"#991B1B", label:"Rejected"    },
};

export const ROLE_META = {
  super_admin: { label:"Super Admin",  icon:"👑", color:"#0EA5E9", lightBg:"#DBEAFE" },
  store_owner: { label:"Store Owner",  icon:"🏪", color:"#10B981", lightBg:"#D1FAE5" },
  pharmacist:  { label:"Pharmacist",   icon:"💊", color:"#F59E0B", lightBg:"#FEF3C7" },
  distributor: { label:"Distributor",  icon:"🚚", color:"#8B5CF6", lightBg:"#EDE9FE" },
};

export function Badge({ status, label }) {
  const s = STATUS_MAP[status] || { bg:"#F1F5F9", color:"#475569", label: status };
  return (
    <span style={{ background:s.bg, color:s.color, padding:"2px 10px", borderRadius:20,
      fontSize:11, fontWeight:700, whiteSpace:"nowrap", display:"inline-block" }}>
      {label || s.label}
    </span>
  );
}

export function Card({ children, style = {} }) {
  return (
    <div style={{ background:"#fff", borderRadius:18, border:"1px solid #E8EEF4",
      boxShadow:"0 2px 12px rgba(0,0,0,0.04)", padding:24, ...style }}>
      {children}
    </div>
  );
}

export function SectionTitle({ children, action }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
      <div style={{ fontWeight:800, fontSize:15, color:"#0F172A", letterSpacing:-0.3 }}>{children}</div>
      {action && <div>{action}</div>}
    </div>
  );
}

export function Btn({ children, color = "#0EA5E9", onClick, small, outline, type="button", disabled, style={} }) {
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{
      background: disabled ? "#E2E8F0" : outline ? "transparent" : color,
      color: disabled ? "#94A3B8" : outline ? color : "#fff",
      border: `1.5px solid ${disabled ? "#E2E8F0" : color}`,
      borderRadius:10, padding: small ? "5px 12px" : "9px 18px",
      fontWeight:700, fontSize: small ? 12 : 13,
      cursor: disabled ? "not-allowed" : "pointer",
      display:"inline-flex", gap:6, alignItems:"center",
      fontFamily:"inherit", transition:"opacity 0.15s", ...style,
    }}>{children}</button>
  );
}

export function TabBar({ tabs, active, onChange, color }) {
  return (
    <div style={{ display:"flex", gap:2, background:"#F1F5F9", padding:4,
      borderRadius:14, marginBottom:24, flexWrap:"wrap" }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => onChange(t.id)} style={{
          padding:"8px 16px", borderRadius:10, border:"none", cursor:"pointer",
          background: active === t.id ? color : "transparent",
          color: active === t.id ? "#fff" : "#64748B",
          fontWeight:700, fontSize:13, display:"flex", gap:6, alignItems:"center",
          transition:"all 0.18s", fontFamily:"inherit",
        }}>
          <span>{t.icon}</span> <span>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

export function StatCard({ icon, label, value, sub, color }) {
  return (
    <Card style={{ display:"flex", gap:16, alignItems:"center", padding:"18px 22px" }}>
      <div style={{ width:50, height:50, borderRadius:14, background:color+"1A",
        display:"flex", alignItems:"center", justifyContent:"center", fontSize:22, flexShrink:0 }}>
        {icon}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:22, fontWeight:900, color:"#0F172A", letterSpacing:-0.5, lineHeight:1 }}>{value}</div>
        <div style={{ fontSize:12, color:"#64748B", fontWeight:500, marginTop:2 }}>{label}</div>
        {sub && <div style={{ fontSize:11, color, fontWeight:600, marginTop:3 }}>{sub}</div>}
      </div>
    </Card>
  );
}

export function DataTable({ cols, rows = [], renderRow, loading, emptyMsg = "No records found" }) {
  return (
    <div style={{ overflowX:"auto", borderRadius:12, border:"1px solid #F1F5F9" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
        <thead>
          <tr style={{ background:"#F8FAFC" }}>
            {cols.map(c => (
              <th key={c} style={{ padding:"10px 16px", textAlign:"left", color:"#64748B",
                fontWeight:600, fontSize:12, borderBottom:"1px solid #E2E8F0", whiteSpace:"nowrap" }}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={cols.length} style={{ padding:32, textAlign:"center", color:"#94A3B8" }}>
              Loading...
            </td></tr>
          ) : rows.length === 0 ? (
            <tr><td colSpan={cols.length} style={{ padding:32, textAlign:"center", color:"#94A3B8" }}>
              {emptyMsg}
            </td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} style={{ borderBottom:"1px solid #F8FAFC" }}
              onMouseEnter={e => e.currentTarget.style.background = "#FAFCFF"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {renderRow(row, i)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:1000,
      display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}
      onClick={onClose}>
      <div style={{ background:"#fff", borderRadius:20, padding:32, maxWidth:520, width:"100%",
        maxHeight:"90vh", overflowY:"auto", boxShadow:"0 24px 64px rgba(0,0,0,0.18)" }}
        onClick={e => e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24 }}>
          <div style={{ fontWeight:800, fontSize:17, color:"#0F172A" }}>{title}</div>
          <button onClick={onClose} style={{ border:"none", background:"#F1F5F9", borderRadius:8,
            width:32, height:32, cursor:"pointer", fontSize:16, display:"flex", alignItems:"center", justifyContent:"center" }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Input({ label, ...props }) {
  return (
    <div style={{ marginBottom:16 }}>
      {label && <label style={{ display:"block", fontWeight:600, fontSize:13, color:"#334155", marginBottom:6 }}>{label}</label>}
      <input {...props} style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #E2E8F0",
        borderRadius:10, fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box",
        background:"#FAFCFF", ...(props.style||{}) }} />
    </div>
  );
}

export function Select({ label, children, ...props }) {
  return (
    <div style={{ marginBottom:16 }}>
      {label && <label style={{ display:"block", fontWeight:600, fontSize:13, color:"#334155", marginBottom:6 }}>{label}</label>}
      <select {...props} style={{ width:"100%", padding:"10px 14px", border:"1.5px solid #E2E8F0",
        borderRadius:10, fontSize:13, fontFamily:"inherit", outline:"none", boxSizing:"border-box",
        background:"#FAFCFF", ...(props.style||{}) }}>
        {children}
      </select>
    </div>
  );
}

export function Spinner() {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", padding:80 }}>
      <div style={{ width:40, height:40, border:"3px solid #E2E8F0", borderTop:"3px solid #0EA5E9",
        borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export function MiniBarChart({ data = [], color }) {
  const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  // Normalize data — handle both {month, val} and MongoDB {_id:{month}, revenue} shapes
  const normalized = data.map(d => ({
    label: d.month || (d._id?.month ? MONTHS[(d._id.month - 1)] : ""),
    value: d.val ?? d.revenue ?? 0,
  }));

  const maxVal = Math.max(...normalized.map(d => d.value), 1);
  const W = 420, H = 120, PAD = { top:12, right:8, bottom:28, left:48 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;
  const n = normalized.length;
  if (!n) return (
    <div style={{ height:120, display:"flex", alignItems:"center", justifyContent:"center", color:"#CBD5E1", fontSize:13 }}>
      No data yet
    </div>
  );

  const barW = Math.max(6, (chartW / n) * 0.55);
  const gap   = chartW / n;

  // Y-axis ticks
  const ticks = [0, 0.25, 0.5, 0.75, 1].map(t => ({
    y: PAD.top + chartH - t * chartH,
    label: t === 0 ? "0" : t >= 1
      ? (maxVal >= 100000 ? `₹${(maxVal/100000).toFixed(0)}L` : `₹${(maxVal/1000).toFixed(0)}k`)
      : (maxVal >= 100000 ? `₹${(maxVal*t/100000).toFixed(0)}L` : `₹${(maxVal*t/1000).toFixed(0)}k`),
  }));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width:"100%", height:"auto", display:"block" }}>
      {/* Grid lines */}
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={PAD.left} y1={t.y} x2={W - PAD.right} y2={t.y}
            stroke="#F1F5F9" strokeWidth="1" strokeDasharray={i===0?"none":"4 3"}/>
          <text x={PAD.left - 6} y={t.y + 4} textAnchor="end"
            style={{ fontSize:9, fill:"#94A3B8", fontFamily:"inherit" }}>{t.label}</text>
        </g>
      ))}

      {/* Bars */}
      {normalized.map((d, i) => {
        const barH = Math.max(3, (d.value / maxVal) * chartH);
        const x = PAD.left + i * gap + gap / 2 - barW / 2;
        const y = PAD.top + chartH - barH;
        const isLast = i === n - 1;
        return (
          <g key={i}>
            {/* Shadow bar */}
            <rect x={x+2} y={y+2} width={barW} height={barH} rx={4}
              fill={color} opacity={0.08}/>
            {/* Main bar */}
            <rect x={x} y={y} width={barW} height={barH} rx={4}
              fill={color} opacity={isLast ? 1 : 0.45}/>
            {/* Value label on last bar */}
            {isLast && d.value > 0 && (
              <text x={x + barW/2} y={y - 4} textAnchor="middle"
                style={{ fontSize:9, fill:color, fontWeight:700, fontFamily:"inherit" }}>
                {d.value >= 100000 ? `₹${(d.value/100000).toFixed(1)}L` : d.value >= 1000 ? `₹${(d.value/1000).toFixed(0)}k` : `₹${d.value}`}
              </text>
            )}
            {/* X-axis label */}
            <text x={x + barW/2} y={H - 6} textAnchor="middle"
              style={{ fontSize:9, fill:"#94A3B8", fontFamily:"inherit" }}>
              {d.label}
            </text>
          </g>
        );
      })}

      {/* X axis line */}
      <line x1={PAD.left} y1={PAD.top + chartH} x2={W - PAD.right} y2={PAD.top + chartH}
        stroke="#E2E8F0" strokeWidth="1"/>
    </svg>
  );
}

export function useForm(initial) {
  const [form, setForm] = useState(initial);
  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const reset = () => setForm(initial);
  return [form, handleChange, reset, setForm];
}


// ── Donut Chart
export function DonutChart({ data = [], size = 140 }) {
  if (!data.length) return (
    <div style={{ height:size, display:"flex", alignItems:"center", justifyContent:"center", color:"#CBD5E1", fontSize:12 }}>
      No data
    </div>
  );
  const total = data.reduce((s, d) => s + (d.value || 0), 0) || 1;
  const R = size / 2 - 14;
  const cx = size / 2, cy = size / 2;
  const stroke = R * 2 * Math.PI;
  let cumulative = 0;

  const slices = data.map(d => {
    const pct = (d.value || 0) / total;
    const offset = stroke - pct * stroke;
    const rotation = cumulative * 360 - 90;
    cumulative += pct;
    return { ...d, pct, offset, rotation };
  });

  return (
    <div style={{ display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
      <svg width={size} height={size} style={{ flexShrink:0 }}>
        {slices.map((s, i) => (
          <circle key={i}
            cx={cx} cy={cy} r={R}
            fill="transparent"
            stroke={s.color || "#0EA5E9"}
            strokeWidth={R * 0.52}
            strokeDasharray={`${stroke} ${stroke}`}
            strokeDashoffset={s.offset}
            transform={`rotate(${s.rotation} ${cx} ${cy})`}
            style={{ transition:"stroke-dashoffset 0.6s ease" }}
          />
        ))}
        {/* Center total */}
        <text x={cx} y={cy - 4} textAnchor="middle"
          style={{ fontSize:18, fontWeight:900, fill:"#0F172A", fontFamily:"inherit" }}>
          {total.toLocaleString()}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle"
          style={{ fontSize:9, fill:"#94A3B8", fontFamily:"inherit" }}>
          TOTAL
        </text>
      </svg>
      <div style={{ flex:1, minWidth:80 }}>
        {slices.map((s, i) => (
          <div key={i} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:6 }}>
            <div style={{ width:10, height:10, borderRadius:3, background:s.color, flexShrink:0 }}/>
            <span style={{ fontSize:12, color:"#475569", flex:1, textTransform:"capitalize" }}>{s.label}</span>
            <span style={{ fontSize:12, fontWeight:700, color:"#0F172A" }}>{s.value}</span>
            <span style={{ fontSize:10, color:"#94A3B8" }}>({(s.pct*100).toFixed(0)}%)</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Horizontal Bar Chart (for top stores/products)
export function HBarChart({ data = [], color = "#0EA5E9", valueFormatter }) {
  const max = Math.max(...data.map(d => d.value || 0), 1);
  const fmt = valueFormatter || (v => v.toLocaleString());
  return (
    <div>
      {data.map((d, i) => (
        <div key={i} style={{ marginBottom:12 }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
            <span style={{ fontSize:12, color:"#475569", fontWeight:600 }}>{d.label}</span>
            <span style={{ fontSize:12, fontWeight:800, color }}>{fmt(d.value)}</span>
          </div>
          <div style={{ height:8, background:"#F1F5F9", borderRadius:6, overflow:"hidden" }}>
            <div style={{
              height:8,
              width:`${(d.value/max)*100}%`,
              background:`linear-gradient(90deg,${color}90,${color})`,
              borderRadius:6,
              transition:"width 0.8s ease",
            }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

