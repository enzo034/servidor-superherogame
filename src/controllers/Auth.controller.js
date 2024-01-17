import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config.js';
import catchError from '../utils/genericError.js';

export const signUp = async (req, res) => {
    try {
        const { nombre, apellido, email, password, } = req.body;

        const newUser = new User({
            nombre,
            apellido,
            email,
            password: await User.encryptPassword(password),
            equipos: chooseFirstHeroes()
        })

        await newUser.save();

        return res.status(200).json({ message: "Usuario registrado con éxito" });
    } catch (error) {
        catchError(error);
        return;
    }
}

const chooseFirstHeroes = () => {
    const heroesId = new Set(); //En la estructura set no puede haber datos repetidos
    const totalHeroes = 731; // Cantidad total de héroes

    while (heroesId.size < 5) {
        const randomId = Math.floor(Math.random() * totalHeroes) + 1;
        heroesId.add(randomId);
    }

    return Array.from(heroesId);
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