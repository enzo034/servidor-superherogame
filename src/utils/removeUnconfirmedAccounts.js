import User from '../models/User.model.js';

export const deleteUnconfirmedUsers = async () => {
    try {
        // Elimina usuarios que no han confirmado después de dos recordatorios
        const result = await User.deleteMany({ confirmado: false , reminderCount: 2});
        console.log(`${result.deletedCount} usuarios eliminados.`);
    } catch (error) {
        console.error('Error al eliminar usuarios no confirmados:', error.message);
    }
};