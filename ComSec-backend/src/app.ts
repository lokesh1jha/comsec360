import express from 'express';
import dotenv from 'dotenv';
import accountUserRoutes from './routes/account-user.routes';
import adminRoutes from './routes/admin.routes';
import authRoutes from './routes/auth.routes';
import guestRoutes from './routes/guest.routes';
import multiUserRoutes from './routes/multi-user.routes';
import companyJobsRoutes from './routes/company-job.routes'
import shareHolderRoutes from './routes/shareholder.routes';
import directorRoutes from './routes/director.routes';
import { errorHandler } from './middlewares/error.middleware';
import cors from 'cors';

dotenv.config();

const app = express();

// Configure CORS
const corsOptions = {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3005/', 'http://localhost:3006/',  'http://3.75.90.214:3000', 'http://3.121.181.87:3000', 'http://3.75.221.168:3000', 'http://3.120.157.11:3000', "http://3.120.159.117:3000", 'http://3.67.98.48:3000'], // Allowed origins
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Enable cookies and credentials
};

// Apply CORS middleware
app.use(cors());

// Middleware
app.use(express.json());

// Health Check Route
app.use('/health', (req, res) => {
    res.status(200).json({ message: 'Server is healthy' });
});

// API Routes
app.use('/admin', adminRoutes);

app.use('/account-user', accountUserRoutes);

app.use("/auth", authRoutes)

app.use("/guest", guestRoutes);

app.use('/multi-user', multiUserRoutes);

app.use('/company-job', companyJobsRoutes)

app.use('/shareholder', shareHolderRoutes);

app.use('/director', directorRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;
