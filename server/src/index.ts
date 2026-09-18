import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import saleRoutes from './routes/saleRoutes';
import reportRoutes from './routes/reportRoutes';
import chatRoutes from './routes/chatRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import toolRoutes from './routes/toolRoutes';
import aiRoutes from './routes/aiRoutes';
import notificationRoutes from './routes/notificationRoutes';
import complaintRoutes from './routes/complaintRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sales', saleRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/complaints', complaintRoutes);

import { prisma } from './prisma';
import { seedDatabase } from './seed';

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'FarmerInventory Backend', timestamp: new Date() });
});

app.listen(PORT, async () => {
  console.log(`🌾 FarmerInventory Server running on port ${PORT}`);
  try {
    const productCount = await prisma.product.count();
    if (productCount === 0) {
      console.log('🌱 Cloud database is empty. Auto-seeding initial harvest demo data...');
      await seedDatabase(false);
      console.log('✅ Initial seed completed successfully!');
    }
  } catch (error) {
    console.error('Database connection/sync warning:', error);
  }
});
