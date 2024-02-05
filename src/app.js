import express from 'express';

//CORS / middlewares
import cors from 'cors';
import helmet from 'helmet';

//rutas
import authRoutes from './routes/Auth.routes.js';
import peleaRoutes from './routes/Pelea.routes.js';
import userRoutes from './routes/User.routes.js';

//Borrar tokens / mails de recordatorio / cuentas sin confirmar
import deleteOldRecoveryTokens from './utils/deleteOldRecoveryTokens.js';
import sendReminders from './utils/reminderScheduler.js';
import { deleteUnconfirmedUsers } from './utils/removeUnconfirmedAccounts.js';
deleteOldRecoveryTokens();
setInterval(sendReminders, 7 * 24 * 60 * 60 * 1000); //Envia un recordatorio para recuperar los email cada una semana
setInterval(deleteUnconfirmedUsers, 7 * 24 * 60 * 60 * 1000); // Elimina aquellas cuentas que no fueron confirmadas en dos semanas

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/pelea', peleaRoutes);
app.use('/api/user', userRoutes);

export default app;
