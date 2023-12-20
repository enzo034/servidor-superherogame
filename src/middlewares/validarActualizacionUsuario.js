import Joi from 'joi'

const schemaActualizacionUsuario = Joi.object({
    nombre: Joi.string().pattern(/^[a-zA-Z]+$/).min(4).max(15),
    apellido: Joi.string().pattern(/^[a-zA-Z]+$/).min(4).max(15),
    email: Joi.string().email().min(5),
    password: Joi.string().min(8).max(24)
}).min(1); // Al menos un campo debe estar presente en la solicitud

export const validarActualizacionUsuario = async (req, res, next) => {
    const { nombre, apellido, email, password } = req.body;

    const validatorResult = schemaActualizacionUsuario.validate({ nombre, apellido, email, password }, { abortEarly: false });

    if (validatorResult.error) {
        return res.status(400).json({
            message: `Uno de los campos tiene un error`,
            error: validatorResult.error.details
        });
    }

    if(password){
        req.body.password = await User.encryptPassword(password);
    }

    next();
};