import { Router } from 'express'
import { agregarPelea, getPeleasByUser } from '../controllers/Pelea.controller.js';
import { validarToken } from '../middlewares/validarToken.js';

const router = Router();

router.get('/getPeleas', validarToken, getPeleasByUser);
router.post('/agregar', validarToken, agregarPelea);

export default router;