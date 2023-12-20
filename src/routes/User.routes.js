import { Router } from 'express';

//Middleware
import { validarToken } from '../middlewares/validarToken.js'
import { validarActualizacionUsuario } from '../middlewares/validarActualizacionUsuario.js';
import { limiter, mLimiter, smLimiter } from '../middlewares/limiter.js';

//Controllers
import { updateUser, getUsers, favoritosUser, getActualUser, agregarFavorito, eliminarFavorito, equipoUser } from '../controllers/User.controller.js';


const router = Router();

router.get('/getActualUser', [validarToken, limiter], getActualUser);
router.get('/getUsers', [validarToken, mLimiter], getUsers);
router.get('/favoritos', [validarToken, mLimiter], favoritosUser);
router.get('/equipo', [validarToken, mLimiter], equipoUser);

router.put('/agregarFavorito/:heroeId', [validarToken, smLimiter], agregarFavorito);

router.delete('/eliminarFavorito/:heroeId', [validarToken, smLimiter], eliminarFavorito);

router.put('/update', [validarToken, validarActualizacionUsuario, limiter], updateUser);



export default router;