import express from 'express';

//CORS / middlewares
import cors from 'cors';
import helmet from 'helmet';

//rutas
import authRoutes from './routes/Auth.routes.js';
import peleaRoutes from './routes/Pelea.routes.js';
import userRoutes from './routes/User.routes.js';

//Borrar tokens
import deleteOldRecoveryTokens from './utils/deleteOldRecoveryTokens.js';
deleteOldRecoveryTokens();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pelea', peleaRoutes);
app.use('/api/user', userRoutes);

export default app;
