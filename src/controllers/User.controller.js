import User from '../models/User.model.js';

export const getActualUser = async (req, res) => {
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

    return res.status(200).json({userResponse});
}

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        return res.status(200).json({ users });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Hubo un error al obtener los usuarios",
            error: error.message
        });
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
        console.log(error);
        return res.status(500).json({
            message: "Hubo un error al actualizar el usuario",
            error: error.message
        });
    }
}

export const favoritosUser = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);

        if(user.favoritos.length < 1){
            return res.status(204);
        }

        return res.status(200).json({
            message: "Devolución exitosa",
            listaFavoritos: user.favoritos
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Hubo un error al intentar devolver los favoritos",
            error: error.message
        });
    }
}