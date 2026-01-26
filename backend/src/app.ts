import express from 'express';
import cors from 'cors';
import clerkRoutes from './routes/clerk.routes';
const app = express();

app.use(cors({origin: 'http://localhost:3000'  }));
app.use(express.json());
app.use('/api/clerk', clerkRoutes);
export default app;