import { Router } from 'express';

//Middleware
import { validarToken } from '../middlewares/validarToken.js'
import { validarActualizacionUsuario } from '../middlewares/validarActualizacionUsuario.js';

//Controllers
import { updateUser, getUsers, favoritosUser, getActualUser, agregarFavorito, eliminarFavorito } from '../controllers/User.controller.js';


const router = Router();

router.get('/getActualUser', validarToken, getActualUser);
router.get('/getUsers',validarToken, getUsers);
router.get('/favoritos', validarToken, favoritosUser);

router.post('/agregarFavorito', validarToken, agregarFavorito);

router.delete('/eliminarFavorito', validarToken, eliminarFavorito);

router.put('/update', [validarToken, validarActualizacionUsuario], updateUser);



export default router;