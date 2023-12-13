import express from 'express';

//CORS
import cors from 'cors';

//rutas
import authRoutes from './routes/Auth.routes.js';
import peleaRoutes from './routes/Pelea.routes.js';
import userRoutes from './routes/User.routes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pelea', peleaRoutes);
app.use('/api/user', userRoutes);

export default app;
