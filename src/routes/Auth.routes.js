import { Router } from 'express';

//Controllers
import { signUp, signIn, requestPasswordRecovery, resetPassword } from '../controllers/Auth.controller.js';

//middlewares
import { verificarEmailDuplicado } from '../middlewares/verificarEmail.js';
import { validarDatos } from '../middlewares/validarDatos.js';
import { limiter } from '../middlewares/limiter.js';
import rateLimit from 'express-rate-limit';

const router = Router();

router.post('/signup', [verificarEmailDuplicado, validarDatos, limiter], signUp);
router.post('/signin', limiter,signIn);

router.post('/recoverPassword', rateLimit({
    windowMs: 60000,
    max: 1,
    message: "Solo puedes recibir un mail cada un minuto."
})
,requestPasswordRecovery);

router.post('/resetPassword/:token', resetPassword);

export default router;
