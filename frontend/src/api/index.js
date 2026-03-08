import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mc_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("mc_token");
      localStorage.removeItem("mc_user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── Auth
export const authAPI = {
  login:    (data) => api.post("/auth/login", data),
  getMe:    ()     => api.get("/auth/me"),
  register: (data) => api.post("/auth/register", data),
};

// ── Dashboard
export const dashAPI = {
  superAdmin:  () => api.get("/dashboard/super-admin"),
  storeOwner:  () => api.get("/dashboard/store-owner"),
  pharmacist:  () => api.get("/dashboard/pharmacist"),
  distributor: () => api.get("/dashboard/distributor"),
};

// ── Stores
export const storeAPI = {
  getAll:       (params) => api.get("/stores", { params }),
  getOne:       (id)     => api.get(`/stores/${id}`),
  create:       (data)   => api.post("/stores", data),
  update:       (id, d)  => api.put(`/stores/${id}`, d),
  updateStatus: (id, s)  => api.patch(`/stores/${id}/status`, { status: s }),
  remove:       (id)     => api.delete(`/stores/${id}`),
};

// ── Products
export const productAPI = {
  getAll:       (params) => api.get("/products", { params }),
  getOne:       (id)     => api.get(`/products/${id}`),
  getCategories:()       => api.get("/products/categories"),
  create:       (data)   => api.post("/products", data),
  update:       (id, d)  => api.put(`/products/${id}`, d),
  remove:       (id)     => api.delete(`/products/${id}`),
};

// ── Orders
export const orderAPI = {
  getAll:       (params) => api.get("/orders", { params }),
  getOne:       (id)     => api.get(`/orders/${id}`),
  create:       (data)   => api.post("/orders", data),
  updateStatus: (id, s)  => api.patch(`/orders/${id}/status`, { status: s }),
};

// ── Staff
export const staffAPI = {
  getAll:  ()       => api.get("/staff"),
  create:  (data)   => api.post("/staff", data),
  update:  (id, d)  => api.put(`/staff/${id}`, d),
  remove:  (id)     => api.delete(`/staff/${id}`),
};

// ── Prescriptions
export const rxAPI = {
  getAll:  (params) => api.get("/prescriptions", { params }),
  create:  (data)   => api.post("/prescriptions", data),
  verify:  (id, d)  => api.patch(`/prescriptions/${id}/verify`, d),
};

// ── Inventory
export const inventoryAPI = {
  getAlerts:   () => api.get("/inventory/alerts"),
  updateStock: (id, stock) => api.patch(`/inventory/${id}/stock`, { stock }),
};

// ── Users
export const userAPI = {
  getAll:      (params) => api.get("/users", { params }),
  create:      (data)   => api.post("/users", data),
  update:      (id, d)  => api.put(`/users/${id}`, d),
  toggle:      (id)     => api.patch(`/users/${id}/toggle`),
};

export default api;
