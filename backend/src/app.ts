import express from 'express';
import cors from 'cors';
import clerkRoutes from './routes/clerk.routes';
import incomeRouter from './routes/income.routes';
import expenseRouter from './routes/expense.routes';
import transactionRouter from './routes/transaction.routes';
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
app.use('/api', expenseRouter);
app.use('/api',transactionRouter)
export default app;