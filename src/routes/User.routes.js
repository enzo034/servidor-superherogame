import { Router } from 'express';

//Middleware
import { validarToken } from '../middlewares/validarToken.js'

//Controllers
import { updateUser, getUsers, favoritosUser } from '../controllers/User.controller.js';

const router = Router();

router.get('/getUsers',validarToken, getUsers);
router.get('/favoritos', validarToken, favoritosUser);
router.put('/update', validarToken, updateUser);

export default router;