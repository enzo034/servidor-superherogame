import { Router } from 'express';

//Middleware
import { validarToken } from '../middlewares/validarToken.js'

//Controllers
import { updateUser } from '../controllers/User.controller.js';

const router = Router();

router.put('/update', validarToken, updateUser);

export default router;