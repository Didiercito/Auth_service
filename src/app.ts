import express, { Request, Response } from 'express'; 
import cors from 'cors';
import Authroutes from './infrastructure/api/routes/auth.routes';
import PasswordRoutes from './infrastructure/api/routes/password.routes';
import permissonRoutes from './infrastructure/api/routes/permission.routes';
import RoleRoutes from './infrastructure/api/routes/role.routes';
import VerificationRoutes from './infrastructure/api/routes/verification.routes';
import userRoutes from './infrastructure/api/routes/user.routes';
import skillRoutes from './infrastructure/api/routes/skill.routes';
import availabilityRoutes from './infrastructure/api/routes/availability.routes';
import scheduleRoutes from './infrastructure/api/routes/schedule.routes';
import reputationRoutes from './infrastructure/api/routes/reputation.routes';

const app = express();
app.use(cors({ origin: '*' }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get('/health', (_req: Request, res: Response) => { 
  res.json({
    success: true,
    service: 'Auth-User Service',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/api/v1/auth', Authroutes);
app.use('/api/v1/password', PasswordRoutes);
app.use('/api/v1/permission', permissonRoutes);
app.use('/api/v1/role', RoleRoutes);
app.use('/api/v1/verification', VerificationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/reputation', reputationRoutes);


export default app;