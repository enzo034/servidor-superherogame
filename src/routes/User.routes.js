import { Router } from 'express';

//Middleware
import { validarToken } from '../middlewares/validarToken.js'
import { validarActualizacionUsuario, validarActualizacionPassword } from '../middlewares/validarActualizacionUsuario.js';
import { limiter, mLimiter, smLimiter } from '../middlewares/limiter.js';
import { verificarEmailDuplicado } from '../middlewares/verificarEmail.js';

//Controllers
import { updateUser, getUsers, favoritosUser, getActualUser, agregarFavorito, eliminarFavorito, equipoUser, validarUsuario, updatePassword } from '../controllers/User.controller.js';


const router = Router();

router.get('/getActualUser', [validarToken, limiter], getActualUser);
router.get('/getUsers', [validarToken, mLimiter], getUsers);
router.get('/favoritos', [validarToken, mLimiter], favoritosUser);
router.get('/equipo', [validarToken, mLimiter], equipoUser);

router.post('/validarUsuario', validarToken, validarUsuario);

router.put('/agregarFavorito/:heroeId', [validarToken, smLimiter], agregarFavorito);
router.put('/update', [validarToken, validarActualizacionUsuario, verificarEmailDuplicado, limiter], updateUser);
router.put('/updatePassword', [validarToken, validarActualizacionPassword, limiter], updatePassword);

router.delete('/eliminarFavorito/:heroeId', [validarToken, smLimiter], eliminarFavorito);

export default router;