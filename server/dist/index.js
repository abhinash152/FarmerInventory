"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const saleRoutes_1 = __importDefault(require("./routes/saleRoutes"));
const reportRoutes_1 = __importDefault(require("./routes/reportRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const feedbackRoutes_1 = __importDefault(require("./routes/feedbackRoutes"));
const toolRoutes_1 = __importDefault(require("./routes/toolRoutes"));
const aiRoutes_1 = __importDefault(require("./routes/aiRoutes"));
const notificationRoutes_1 = __importDefault(require("./routes/notificationRoutes"));
const complaintRoutes_1 = __importDefault(require("./routes/complaintRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)({ origin: true, credentials: true }));
app.use(express_1.default.json({ limit: '10mb' }));
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/products', productRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/sales', saleRoutes_1.default);
app.use('/api/reports', reportRoutes_1.default);
app.use('/api/chat', chatRoutes_1.default);
app.use('/api/feedback', feedbackRoutes_1.default);
app.use('/api/tools', toolRoutes_1.default);
app.use('/api/ai', aiRoutes_1.default);
app.use('/api/notifications', notificationRoutes_1.default);
app.use('/api/complaints', complaintRoutes_1.default);
const prisma_1 = require("./prisma");
const seed_1 = require("./seed");
// Root status & landing page
app.get('/', (req, res) => {
    if (req.accepts('html')) {
        res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FarmerInventory Backend API</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
    body {
      min-height: 100vh;
      background: radial-gradient(circle at 50% 20%, #1e293b 0%, #0f172a 100%);
      color: #f8fafc;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .card {
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(16px);
      padding: 2.5rem;
      border-radius: 1.5rem;
      max-width: 520px;
      width: 100%;
      box-shadow: 0 20px 40px -15px rgba(0,0,0,0.5);
      text-align: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(34, 197, 94, 0.15);
      border: 1px solid rgba(34, 197, 94, 0.3);
      color: #4ade80;
      padding: 0.375rem 0.875rem;
      border-radius: 9999px;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 1.25rem;
    }
    .pulse {
      width: 8px;
      height: 8px;
      background: #4ade80;
      border-radius: 50%;
      box-shadow: 0 0 10px #4ade80;
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.85); }
    }
    h1 {
      font-size: 1.75rem;
      font-weight: 700;
      letter-spacing: -0.025em;
      margin-bottom: 0.5rem;
      color: #ffffff;
    }
    p {
      color: #94a3b8;
      font-size: 0.95rem;
      line-height: 1.5;
      margin-bottom: 1.75rem;
    }
    .links {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .btn {
      display: inline-block;
      width: 100%;
      padding: 0.875rem 1.25rem;
      border-radius: 0.75rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      font-size: 0.95rem;
    }
    .btn-primary {
      background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
      color: white;
      box-shadow: 0 4px 14px rgba(22, 163, 74, 0.35);
    }
    .btn-primary:hover {
      background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
      transform: translateY(-1px);
    }
    .btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      color: #cbd5e1;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }
    .footer {
      margin-top: 1.75rem;
      font-size: 0.75rem;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <div class="pulse"></div>
      Backend API Active
    </div>
    <h1>🌾 FarmerInventory API</h1>
    <p>The Express.js REST API service is online, connected to PostgreSQL, and serving requests.</p>
    <div class="links">
      <a href="https://farmer-inventory.vercel.app" class="btn btn-primary" target="_blank" rel="noopener noreferrer">Launch FarmerInventory Web App &rarr;</a>
      <a href="/api/health" class="btn btn-secondary">Check /api/health Status</a>
    </div>
    <div class="footer">FarmerInventory &copy; 2026 &bull; Direct Connection &bull; Fresh Product &bull; Zero Middleman</div>
  </div>
</body>
</html>`);
    }
    else {
        res.json({
            status: 'ok',
            service: 'FarmerInventory Backend',
            version: '1.0.0',
            frontend: 'https://farmer-inventory.vercel.app',
            health: '/api/health',
            timestamp: new Date()
        });
    }
});
// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'FarmerInventory Backend', timestamp: new Date() });
});
app.listen(Number(PORT), '0.0.0.0', async () => {
    console.log(`🌾 FarmerInventory Server running on 0.0.0.0:${PORT}`);
    try {
        const productCount = await prisma_1.prisma.product.count();
        if (productCount === 0) {
            console.log('🌱 Cloud database is empty. Auto-seeding initial harvest demo data...');
            await (0, seed_1.seedDatabase)(true);
            console.log('✅ Initial seed completed successfully!');
        }
    }
    catch (error) {
        console.error('Database connection/sync warning:', error);
    }
});
