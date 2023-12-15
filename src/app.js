import express from 'express';


//CORS / middlewares
import cors from 'cors';
import { csp } from './middlewares/csp.js';
import { limiter } from './middlewares/limiter.js';

import helmet from 'helmet';

//rutas
import authRoutes from './routes/Auth.routes.js';
import peleaRoutes from './routes/Pelea.routes.js';
import userRoutes from './routes/User.routes.js';

const app = express();

app.use(helmet());
app.use(limiter);
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pelea', peleaRoutes);
app.use('/api/user', userRoutes);

export default app;
