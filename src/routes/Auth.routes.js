import { Router } from 'express';

//Controllers
import { signUp, signIn, requestPasswordRecovery, resetPassword, confirmEmail, sendConfirmationEmail } from '../controllers/Auth.controller.js';

//middlewares
import { verificarEmailDuplicado } from '../middlewares/verificarEmail.js';
import { validarDatos } from '../middlewares/validarDatos.js';
import { limiter, rLimiter } from '../middlewares/limiter.js';
import { validarToken } from '../middlewares/validarToken.js'

const router = Router();

router.post('/signup', [verificarEmailDuplicado, validarDatos, limiter], signUp);
router.get('/confirmemail/:token', confirmEmail);
router.post('/requestConfirmationEmail', [validarToken, rLimiter], sendConfirmationEmail);
router.post('/signin', limiter, signIn);

router.post('/recoverPassword', rLimiter, requestPasswordRecovery);

router.post('/resetPassword/:token', resetPassword);

export default router;
