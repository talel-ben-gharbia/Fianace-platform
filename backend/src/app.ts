import express from 'express';
import cors from 'cors';
import clerkRoutes from './routes/clerk.routes';
import incomeRouter from './routes/income.routes';
const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
  credentials: true
}));
app.use(express.json());
app.use('/api/clerk', clerkRoutes);
app.use('/api', incomeRouter);
export default app;