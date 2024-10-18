import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectToDB } from './utils/mongoMemoryServer';
import authRoutes from './routes/authRoutes';
import caseRoutes from './routes/caseRoutes';
import franchiseRoutes from './routes/franchiseRoutes';
import floorPlanRoutes from './routes/floorPlanRoutes';
import chatbotRoutes from './routes/chatbotRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import licenseRoutes from './routes/licenseRoutes';

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/franchises', franchiseRoutes);
app.use('/api/floor-plans', floorPlanRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/license', licenseRoutes);

app.get('/', (req, res) => {
  res.send('Incident Management SaaS API - Copyright © 2023 Thor Tech Solutions LLC');
});

const startServer = async () => {
  try {
    await connectToDB();
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();