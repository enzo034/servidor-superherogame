import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from './routes/Auth.routes.js';
import peleaRoutes from './routes/Pelea.routes.js';
import userRoutes from './routes/User.routes.js';

const app = express();

const allowedOrigins = ['http://localhost:4200'];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir peticiones desde el mismo servidor
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true
}));

app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pelea', peleaRoutes);
app.use('/api/user', userRoutes);

export default app;