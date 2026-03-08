const express       = require('express');
const cors          = require('cors');
const dotenv        = require('dotenv');
const helmet        = require('helmet');
const rateLimit     = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss           = require('xss-clean');
const compression   = require('compression');
const connectDB     = require('./config/db');

dotenv.config();
connectDB();
const app = express();

app.use(helmet());
app.use(compression());
app.use(cors({
  origin: [
    'http://localhost:3000',
     "https://medchain-b2b.web.app",
    process.env.FRONTEND_URL,
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());

// Rate limit — 10 attempts per 15 min on auth
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000, max: 10,
  message: { success: false, message: 'Too many attempts, try later' },
}));
// Rate limit — 100 req per 15 min on all other routes
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, max: 100,
  message: { success: false, message: 'Too many requests' },
}));

app.use('/api/auth',          require('./routes/auth.routes'));
app.use('/api/users',         require('./routes/user.routes'));
app.use('/api/stores',        require('./routes/store.routes'));
app.use('/api/products',      require('./routes/product.routes'));
app.use('/api/orders',        require('./routes/order.routes'));
app.use('/api/inventory',     require('./routes/inventory.routes'));
app.use('/api/staff',         require('./routes/staff.routes'));
app.use('/api/dashboard',     require('./routes/dashboard.routes'));
app.use('/api/prescriptions', require('./routes/prescription.routes'));
app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', message: 'MedChain API running' }));

app.use((req, res) =>
  res.status(404).json({ success: false, message: 'Route not found' }));

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Something went wrong' : err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`MedChain API on port ${PORT}`));
