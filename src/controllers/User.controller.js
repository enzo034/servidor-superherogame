import User from '../models/User.model.js';

export const getUsers = async (req, res) => {
    const users = await User.find();

    return res.status(200).json({ users });
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
        return res.status(500).json({
            message: "Hubo un error al actualizar el usuario",
            error: error.message
        });
    }
}