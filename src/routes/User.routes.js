import { Router } from 'express';

//Middleware
import { validarToken } from '../middlewares/validarToken.js'

//Controllers
import { updateUser, getUsers } from '../controllers/User.controller.js';

const router = Router();

router.get('/getUsers', getUsers);
router.put('/update', validarToken, updateUser);

export default router;