const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

const User    = require("../models/User");
const Store   = require("../models/Store");
const Product = require("../models/Product");
const Order   = require("../models/Order");
const Staff   = require("../models/Staff");
const Prescription = require("../models/Prescription");

const seed = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("🌱 Seeding database...");

  await Promise.all([User, Store, Product, Order, Staff, Prescription].map(M => M.deleteMany({})));

  // ── Stores
  const stores = await Store.insertMany([
    { name:"Apollo Medical Store", city:"Mumbai",  gstin:"27AADCA1234B1Z5", phone:"022-11112222", email:"apollo@med.in",   status:"active",   joinedAt: new Date("2024-01-15") },
    { name:"Lifeline Pharmacy",    city:"Pune",    gstin:"27AADCB2345C2Z6", phone:"020-22223333", email:"lifeline@med.in", status:"active",   joinedAt: new Date("2024-03-10") },
    { name:"MedPlus Chennai",      city:"Chennai", gstin:"33AADCC3456D3Z7", phone:"044-33334444", email:"medplus@med.in",  status:"pending",  joinedAt: new Date("2026-02-01") },
    { name:"CureWell Delhi",       city:"Delhi",   gstin:"07AADCD4567E4Z8", phone:"011-44445555", email:"curewell@med.in", status:"active",   joinedAt: new Date("2023-11-20") },
    { name:"Sanjeevani Pharma",    city:"Nagpur",  gstin:"27AADCE5678F5Z9", phone:"0712-55556666",email:"sanji@med.in",    status:"suspended",joinedAt: new Date("2024-08-05") },
  ]);

  // ── Users
  const pw = await bcrypt.hash("Password@123", 10);
  const users = await User.insertMany([
    { name:"Rajesh Kumar",    email:"admin@medchain.in",    password:pw, role:"super_admin", phone:"9820011111", store: null },
    { name:"Dr. Priya Sharma",email:"priya@apollomed.in",  password:pw, role:"store_owner", phone:"9820022222", store: stores[0]._id },
    { name:"Kavita Rao",      email:"kavita@lifeline.in",  password:pw, role:"pharmacist",  phone:"9820033333", store: stores[1]._id },
    { name:"Sunita Patel",    email:"sunita@healthdist.in",password:pw, role:"distributor", phone:"9820044444", store: null,
      company:"HealthFirst Distributors", companyGstin:"27AADCF6789G6Z0" },
  ]);

  // ── Products
  const products = await Product.insertMany([
    { name:"Paracetamol 500mg",  category:"Analgesic",    stock:5400, b2bPrice:2.5,  mrp:3.0,  supplier:"Sun Pharma",  expiryDate:new Date("2026-12-31"), batchNo:"SP2024A", status:"in_stock"    },
    { name:"Amoxicillin 250mg",  category:"Antibiotic",   stock:820,  b2bPrice:8.0,  mrp:10.0, supplier:"Cipla",       expiryDate:new Date("2026-06-30"), batchNo:"CP2024B", status:"low_stock"   },
    { name:"Metformin 500mg",    category:"Antidiabetic", stock:3200, b2bPrice:3.2,  mrp:4.0,  supplier:"Dr. Reddy's", expiryDate:new Date("2026-09-30"), batchNo:"DR2024C", status:"in_stock"    },
    { name:"Atorvastatin 10mg",  category:"Cardiac",      stock:120,  b2bPrice:12.0, mrp:15.0, supplier:"Lupin",       expiryDate:new Date("2026-03-31"), batchNo:"LU2024D", status:"low_stock"   },
    { name:"Azithromycin 500mg", category:"Antibiotic",   stock:0,    b2bPrice:15.0, mrp:18.0, supplier:"Zydus",       expiryDate:new Date("2026-07-31"), batchNo:"ZY2024E", status:"out_of_stock"},
    { name:"Pantoprazole 40mg",  category:"GI",           stock:2100, b2bPrice:4.5,  mrp:6.0,  supplier:"Cadila",      expiryDate:new Date("2026-10-31"), batchNo:"CA2024F", status:"in_stock"    },
    { name:"Cetirizine 10mg",    category:"Antihistamine",stock:1800, b2bPrice:1.8,  mrp:2.5,  supplier:"Sun Pharma",  expiryDate:new Date("2026-11-30"), batchNo:"SP2024G", status:"in_stock"    },
    { name:"Amlodipine 5mg",     category:"Cardiac",      stock:90,   b2bPrice:6.0,  mrp:8.0,  supplier:"Torrent",     expiryDate:new Date("2026-04-30"), batchNo:"TO2024H", status:"low_stock"   },
  ]);

  // ── Orders
  const statuses = ["delivered","processing","shipped","pending","delivered","cancelled","delivered"];
  const payments = ["paid","paid","paid","pending","paid","refunded","paid"];
  const orderDates = [
    new Date("2026-03-02"),new Date("2026-03-02"),new Date("2026-03-01"),
    new Date("2026-03-01"),new Date("2026-02-28"),new Date("2026-02-27"),new Date("2026-02-26"),
  ];
  const storeIdx = [0,3,1,0,3,4,1];
  const itemCounts = [12,8,20,5,15,9,22];
  const amounts = [18400,9200,32000,6500,21800,14200,38000];

  await Order.insertMany(storeIdx.map((si,i) => ({
    orderNo: `ORD-${2841-i}`,
    store: stores[si]._id,
    items: Array.from({length: Math.min(itemCounts[i],3)}, (_,k) => ({
      product: products[k % products.length]._id,
      quantity: Math.ceil(itemCounts[i] / 3),
      unitPrice: products[k % products.length].b2bPrice,
    })),
    totalAmount: amounts[i],
    status: statuses[i],
    paymentStatus: payments[i],
    createdAt: orderDates[i],
  })));

  // ── Staff
  await Staff.insertMany([
    { name:"Kavita Rao",   role:"Senior Pharmacist", shift:"Morning", status:"on_duty",  store:stores[0]._id, joinedAt:new Date("2024-01-10"), monthlySales:42000 },
    { name:"Deepak More",  role:"Pharmacist",        shift:"Evening", status:"off_duty", store:stores[0]._id, joinedAt:new Date("2024-04-05"), monthlySales:31000 },
    { name:"Sonal Joshi",  role:"Billing Clerk",     shift:"Morning", status:"on_duty",  store:stores[0]._id, joinedAt:new Date("2024-06-15"), monthlySales:0     },
    { name:"Raju Kamble",  role:"Store Assistant",   shift:"Night",   status:"on_duty",  store:stores[0]._id, joinedAt:new Date("2024-09-20"), monthlySales:0     },
  ]);

  // ── Prescriptions
  await Prescription.insertMany([
    { patientName:"Ramesh K.", medicine:"Amoxicillin 250mg",   doctor:"Dr. Shah",  store:stores[1]._id, status:"pending",  quantity:10 },
    { patientName:"Sunita D.", medicine:"Metformin 500mg",     doctor:"Dr. Joshi", store:stores[1]._id, status:"pending",  quantity:30 },
    { patientName:"Arjun P.",  medicine:"Atorvastatin 10mg",   doctor:"Dr. Mehta", store:stores[1]._id, status:"approved", quantity:15 },
    { patientName:"Meena S.",  medicine:"Paracetamol 500mg",   doctor:"Dr. Nair",  store:stores[1]._id, status:"pending",  quantity:20 },
    { patientName:"Ravi T.",   medicine:"Azithromycin 500mg",  doctor:"Dr. Kumar", store:stores[1]._id, status:"rejected", quantity:5  },
  ]);

  console.log("✅ Seeding complete!");
  console.log("\n📋 Login Credentials:");
  console.log("  Super Admin  → admin@medchain.in   / Password@123");
  console.log("  Store Owner  → priya@apollomed.in  / Password@123");
  console.log("  Pharmacist   → kavita@lifeline.in  / Password@123");
  console.log("  Distributor  → sunita@healthdist.in / Password@123");
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
