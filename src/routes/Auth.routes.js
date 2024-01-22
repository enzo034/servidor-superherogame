import { Router } from 'express';

//Controllers
import { signUp, signIn, requestPasswordRecovery, resetPassword } from '../controllers/Auth.controller.js';

//middlewares
import { verificarEmailDuplicado } from '../middlewares/verificarEmail.js';
import { validarDatos } from '../middlewares/validarDatos.js';
import { limiter } from '../middlewares/limiter.js';

const router = Router();

router.use(limiter);

router.post('/signup', [verificarEmailDuplicado, validarDatos], signUp);
router.post('/signin', signIn);
router.post('/recoverPassword', requestPasswordRecovery);
router.post('/resetPassword/:token', resetPassword);

export default router;
