// deleteOldRecoveryTokens.js

import RecoveryToken from '../models/Token.model.js';

const deleteOldRecoveryTokens = () => {
    setInterval(async () => {
        try {
            await RecoveryToken.deleteMany({ expiry: { $lt: new Date() } });
            console.log('Tokens vencidos eliminados.');
        } catch (error) {
            console.error('Error al eliminar tokens vencidos:', error);
        }
    }, 24 * 60 * 60 * 1000); // Ejecutar cada 24 horas.
};

export default deleteOldRecoveryTokens;
