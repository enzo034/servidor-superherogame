import Joi from 'joi'

const schemaActualizacionUsuario = Joi.object({
    nombre: Joi.string().pattern(/^[a-zA-Z]+$/).min(4).max(15),
    apellido: Joi.string().pattern(/^[a-zA-Z]+$/).min(4).max(15),
    email: Joi.string().email().min(5)
}).min(1); // Al menos un campo debe estar presente en la solicitud

export const validarActualizacionUsuario = async (req, res, next) => {
    const { nombre, apellido, email } = req.body;

    const validatorResult = schemaActualizacionUsuario.validate({ nombre, apellido, email }, { abortEarly: false });

    if (validatorResult.error) {
        return res.status(400).json({
            message: `Uno de los campos tiene un error`,
            error: validatorResult.error.details
        });
    }

    if(req.body.password){
        return res.status(405).json({message: "Para cambiar la contraseña es necesario utilizar el endpoint designado para ello."});
    }

    next();
};

const schemaActualizacionPassword = Joi.object({
    newPassword: Joi.string().min(8).max(24)
})

export const validarActualizacionPassword = async (req, res, next) => {
    const { newPassword } = req.body;

    const validatorResult = schemaActualizacionPassword.validate({newPassword});

    if(validatorResult.error) {
        return res.status(400).json({
            message: "La contraseña tiene un error",
            error: validatorResult.error.details
        })
    }

    next();
}