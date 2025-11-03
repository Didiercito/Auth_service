import express, { Response } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import Authroutes from './infrastructure/api/routes/auth.routes';
import PasswordRoutes from './infrastructure/api/routes/password.routes'
import permissonRoutes from './infrastructure/api/routes/permission.routes'
import RoleRoutes from './infrastructure/api/routes/role.routes'
import VerificationRoutes from './infrastructure/api/routes/verification.routes'

config();

const app = express();
app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (res: Response) => {
  res.json({
    success: true,
    service: 'User Service',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/v1/auth', Authroutes);
app.use('/api/v1/password', PasswordRoutes)
app.use('/api/v1/permission', permissonRoutes)
app.use('/api/v1/role', RoleRoutes)
app.use('/api/v1/verification', VerificationRoutes)

export default app;