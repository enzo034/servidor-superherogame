import User from '../models/User.model.js';
import catchError from '../utils/genericError.js';

export const getActualUser = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);

        const userResponse = {
            _id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            favoritos: user.favoritos,
            equipos: user.equipos,
            historial: user.historial
        }

        return res.status(200).json({ userResponse });
    } catch (error) {
        catchError(error);
        return;
    }
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        return res.status(200).json({ users });
    } catch (error) {
        catchError(error);
        return;
    }
}

export const updateUser = async (req, res) => {
    const userId = req.userId;

    try {
        const updatedUser = await User.findByIdAndUpdate(userId, req.body, { new: true });

        return res.status(200).json({
            message: "El usuario se actualizó correctamente",
            user: updatedUser
        });
    } catch (error) {
        catchError(error);
        return;
    }
}

export const favoritosUser = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);

        if (user.favoritos.length < 1) {
            return res.status(204).send();
        }

        return res.status(200).json({
            message: "Devolución exitosa",
            listaFavoritos: user.favoritos
        });
    } catch (error) {
        catchError(error);
        return;
    }
}

export const equipoUser = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);

        if (user.equipos.length < 1) {
            return res.status(204).send();
        }

        return res.status(200).json({
            message: "Devolución exitosa",
            listaEquipo: user.equipos
        });
    } catch (error) {
        catchError(error);
        return;
    }
}

export const agregarFavorito = async (req, res) => {
    try {
        const userId = req.userId;

        const heroeId = req.params.heroeId;

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId, favoritos: { $ne: heroeId } },
            { $push: { favoritos: heroeId } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(400).json({
                message: "El héroe ya está en la lista de favoritos"
            });
        }

        res.status(200).json({
            message: "El heroe fué agregado a favoritos",
            updatedUser
        })
    } catch (error) {
        catchError(error);
        return;
    }
}

export const eliminarFavorito = async (req, res) => {
    try {
        const userId = req.userId;

        const heroeId = req.params.heroeId;

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId, favoritos: heroeId },
            { $pull: { favoritos: heroeId } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                message: "El héroe no está en la lista de favoritos"
            });
        }

        res.status(200).json({
            message: "El heroe fué eliminado de favoritos",
            updatedUser
        })
    } catch (error) {
        catchError(error);
        return;
    }
}