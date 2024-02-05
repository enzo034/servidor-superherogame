import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import { SECRET_KEY, CURRENT_URL, NM_EMAIL } from '../config.js';
import catchError from '../utils/genericError.js';
import RecoveryToken from '../models/Token.model.js'
import { transporter } from '../utils/transporterMail.js';
import bcrypt from 'bcrypt'
import crypto from 'crypto';

export const signUp = async (req, res) => {
    try {
        const { nombre, apellido, email, password } = req.body;

        // Verificar si el correo electrónico ya está registrado
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
        }

        // Crear un nuevo usuario
        const newUser = new User({
            nombre,
            apellido,
            email,
            password: await User.encryptPassword(password),
            equipos: chooseFirstHeroes()
        });

        // Guardar el nuevo usuario en la base de datos
        await newUser.save();

        // Crear y enviar token de confirmación por correo electrónico
        const confirmationToken = crypto.randomBytes(20).toString('hex');
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1);

        await RecoveryToken.create({ email, token: confirmationToken, expiry });

        const confirmationLink = `${CURRENT_URL}/confirmemail/${confirmationToken}`;

        const mailOptions = {
            from: NM_EMAIL,
            to: email,
            subject: 'Confirmación de correo electrónico',
            html: `
                <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <p style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
                    Hola ${nombre},
                    </p>    
                    <p>Gracias por registrarte en SHG. Para confirmar tu correo electrónico, haz clic en el siguiente enlace:</p>
                    <a href="${confirmationLink}" style="color: #007bff; text-decoration: none;">${confirmationLink}</a>
                    <p>Este enlace expirará en una hora.</p>
                    <p>Si no has registrado esta cuenta, puedes ignorar este correo.</p>
                    <p>Saludos,</p>
                    <p>SHG</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Usuario registrado con éxito. Se ha enviado un correo electrónico de confirmación.' });
    } catch (error) {
        catchError(error);
        return res.status(500).json({ message: 'Error al registrar usuario' });
    }
};


const chooseFirstHeroes = () => {
    const heroesId = new Set(); //En la estructura set no puede haber datos repetidos
    const totalHeroes = 731; // Cantidad total de héroes

    while (heroesId.size < 5) {
        const randomId = Math.floor(Math.random() * totalHeroes) + 1;
        heroesId.add(randomId);
    }

    return Array.from(heroesId);
};

export const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const confirmationToken = await RecoveryToken.findOne({ token });

        if (!confirmationToken || confirmationToken.expiry < new Date()) {
            return res.status(400).json({ message: 'Enlace de confirmación inválido o vencido' });
        }

        // Marcas el correo electrónico como confirmado
        const user = await User.findOneAndUpdate({ email: confirmationToken.email }, { confirmado: true });

        await RecoveryToken.deleteOne({ token });

        res.json({ message: 'Correo electrónico confirmado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al confirmar el correo electrónico' });
    }
};

export const sendConfirmationEmail = async (req, res) => {
    try {
        const { email } = req.body;

        // Verificar si el correo electrónico ya está registrado
        const existingToken = await RecoveryToken.findOne({ email });
        if (existingToken) {
            return res.status(400).json({ message: 'Ya se ha enviado un correo de confirmación para este correo electrónico' });
        }

        // Crear y enviar token de confirmación por correo electrónico
        const confirmationToken = crypto.randomBytes(20).toString('hex');
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1);

        await RecoveryToken.create({ email, token: confirmationToken, expiry });

        const confirmationLink = `${CURRENT_URL}/confirmemail/${confirmationToken}`;

        const mailOptions = {
            from: NM_EMAIL,
            to: email,
            subject: 'Confirmación de correo electrónico',
            html: `
                <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <p style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
                    Hola,
                    </p>    
                    <p>Gracias por utilizar SHG. Para confirmar tu correo electrónico, haz clic en el siguiente enlace:</p>
                    <a href="${confirmationLink}" style="color: #007bff; text-decoration: none;">${confirmationLink}</a>
                    <p>Este enlace expirará en una hora.</p>
                    <p>Si no has registrado esta cuenta, puedes ignorar este correo.</p>
                    <p>Saludos,</p>
                    <p>SHG</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ message: 'Se ha enviado un correo electrónico de confirmación.' });
    } catch (error) {
        catchError(error);
        return res.status(500).json({ message: 'Error al enviar el correo de confirmación' });
    }
};

export const signIn = async (req, res) => {
    try {
        const userFound = await User.findOne({ email: req.body.email });

        if (!userFound) {
            return res.status(400).json({ token: null, message: "Email no encontrado" });
        }

        const matchPassword = await User.comparePassword(req.body.password, userFound.password);

        if (!matchPassword) {
            return res.status(401).json({ token: null, message: "Contraseña incorrecta" });
        }

        const token = jwt.sign({ id: userFound._id }, SECRET_KEY, {
            expiresIn: 604800 //1 semana!!
        })

        return res.status(200).json({ token });
    } catch (error) {
        catchError(error);
        return;
    }
}

export const requestPasswordRecovery = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Correo electrónico no encontrado' });
        }

        const token = crypto.randomBytes(20).toString('hex'); // Genera un token aleatorio
        const expiry = new Date();
        expiry.setHours(expiry.getHours() + 1);

        await RecoveryToken.create({ email, token, expiry });

        const recoveryLink = `${CURRENT_URL}/resetpassword/${token}`;
        const mailOptions = {
            from: NM_EMAIL,
            to: email,
            subject: 'Recuperación de contraseña',
            html: `
                <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <p style="font-family: Arial, sans-serif; margin: 0; padding: 0;">
                    Hola,
                    </p>    
                    <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                    <a href="${recoveryLink}" style="color: #007bff; text-decoration: none;">${recoveryLink}</a>
                    <p>Este enlace expirará en una hora.</p>
                    <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo.</p>
                    <p>Saludos,</p>
                    <p>SHG</p>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: 'Se ha enviado un correo electrónico con las instrucciones de recuperación de contraseña' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al solicitar la recuperación de contraseña' });
    }
}


export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const recoveryToken = await RecoveryToken.findOne({ token });

        if (!recoveryToken || recoveryToken.expiry < new Date()) {
            return res.status(400).json({ message: 'Enlace de recuperación inválido o vencido' });
        }

        const user = await User.findOne({ email: recoveryToken.email });
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        await RecoveryToken.deleteOne({ token });

        res.json({ message: 'Contraseña restablecida exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al restablecer la contraseña' });
    }
}