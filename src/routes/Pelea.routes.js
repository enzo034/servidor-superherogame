import { Router } from 'express'

//Controllers
import { agregarPelea, getPeleasByUser } from '../controllers/Pelea.controller.js';

//Middlewares
import { validarToken } from '../middlewares/validarToken.js';
import { mLimiter } from '../middlewares/limiter.js';

const router = Router();

router.use(mLimiter);

router.get('/getPeleas', validarToken, getPeleasByUser);
router.post('/agregar', validarToken, agregarPelea);

export default router;