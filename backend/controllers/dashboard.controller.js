const Store   = require("../models/Store");
const Product = require("../models/Product");
const Order   = require("../models/Order");
const Staff   = require("../models/Staff");
const Prescription = require("../models/Prescription");
const User    = require("../models/User");

// Super Admin dashboard stats
exports.superAdminStats = async (req, res, next) => {
  try {
    const [totalStores, totalOrders, totalProducts, totalUsers] = await Promise.all([
      Store.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments(),
    ]);

    const storeBreakdown = await Store.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const monthlyRevenue = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 8 }
    ]);

    const topStores = await Order.aggregate([
      { $group: { _id: "$store", totalRevenue: { $sum: "$totalAmount" }, totalOrders: { $sum: 1 } } },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      { $lookup: { from: "stores", localField: "_id", foreignField: "_id", as: "store" } },
      { $unwind: "$store" },
      { $project: { "store.name":1,"store.city":1, totalRevenue:1, totalOrders:1 } }
    ]);

    const orderStatusBreakdown = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const cityBreakdown = await Store.aggregate([
      { $group: { _id: "$city", count: { $sum: 1 } } },
      { $sort: { count: -1 } }, { $limit: 6 }
    ]);

    res.json({
      success: true,
      data: {
        totalStores, totalOrders, totalProducts, totalUsers,
        totalRevenue: revenueAgg[0]?.total || 0,
        storeBreakdown, monthlyRevenue, topStores, orderStatusBreakdown, cityBreakdown
      }
    });
  } catch (err) { next(err); }
};

// Store Owner dashboard stats
exports.storeOwnerStats = async (req, res, next) => {
  try {
    const storeId = req.user.store?._id || req.user.store;
    if (!storeId) return res.status(400).json({ success: false, message: "No store assigned" });

    const [totalOrders, staffCount] = await Promise.all([
      Order.countDocuments({ store: storeId }),
      Staff.countDocuments({ store: storeId }),
    ]);

    const revenueAgg = await Order.aggregate([
      { $match: { store: storeId, paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const monthlyRevenue = await Order.aggregate([
      { $match: { store: storeId, paymentStatus: "paid" } },
      { $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          revenue: { $sum: "$totalAmount" }, orders: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 8 }
    ]);

    const productStats = await Product.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const topProducts = await Order.aggregate([
      { $match: { store: storeId } },
      { $unwind: "$items" },
      { $group: { _id: "$items.product", totalQty: { $sum: "$items.quantity" }, totalRev: { $sum: { $multiply: ["$items.quantity","$items.unitPrice"] } } } },
      { $sort: { totalRev: -1 } }, { $limit: 5 },
      { $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "product" } },
      { $unwind: "$product" },
      { $project: { "product.name":1,"product.category":1, totalQty:1, totalRev:1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalOrders, staffCount,
        totalRevenue: revenueAgg[0]?.total || 0,
        monthlyRevenue, productStats, topProducts
      }
    });
  } catch (err) { next(err); }
};

// Pharmacist dashboard stats
exports.pharmacistStats = async (req, res, next) => {
  try {
    const storeId = req.user.store?._id || req.user.store;

    const [pendingRx, lowStock, outOfStock] = await Promise.all([
      Prescription.countDocuments({ store: storeId, status: "pending" }),
      Product.countDocuments({ status: "low_stock" }),
      Product.countDocuments({ status: "out_of_stock" }),
    ]);

    const thirtyDays = new Date();
    thirtyDays.setDate(thirtyDays.getDate() + 30);
    const expiringSoon = await Product.countDocuments({ expiryDate: { $lte: thirtyDays }, stock: { $gt: 0 } });

    const alertProducts = await Product.find({ status: { $in: ["low_stock","out_of_stock"] } }).limit(10);

    res.json({
      success: true,
      data: { pendingRx, lowStock, outOfStock, expiringSoon, alertProducts }
    });
  } catch (err) { next(err); }
};

// Distributor dashboard stats
exports.distributorStats = async (req, res, next) => {
  try {
    const [inTransit, pendingDispatch, totalClients] = await Promise.all([
      Order.countDocuments({ status: "shipped" }),
      Order.countDocuments({ status: "pending" }),
      Store.countDocuments({ status: "active" }),
    ]);

    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    const deliveryBreakdown = await Order.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const monthlyDispatch = await Order.aggregate([
      { $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          orders: { $sum: 1 }, revenue: { $sum: "$totalAmount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 8 }
    ]);

    res.json({
      success: true,
      data: {
        inTransit, pendingDispatch, totalClients,
        monthlyRevenue: revenueAgg[0]?.total || 0,
        deliveryBreakdown, monthlyDispatch
      }
    });
  } catch (err) { next(err); }
};
