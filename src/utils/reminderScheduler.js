import User from '../models/User.model.js'
import { transporter } from '../utils/transporterMail.js';

const sendReminders = async () => {
    try {
        const updateResult = await User.updateMany(
            { reminderCount: { $lt: 2 }, confirmado: false },
            { $inc: { reminderCount: 1 } }
        );

        // Verifica si hubo actualizaciones
        if (updateResult.modifiedCount > 0) {
            // Obtiene los usuarios actualizados y envía recordatorios
            const users = await User.find({
                reminderCount: { $lt: 3 },
                confirmado: false,
            });

            // Envía un correo electrónico a cada usuario
            for (const user of users) {
                const mailOptions = {
                    from: 'enzo03453@gmail.com',
                    to: user.email,
                    subject: 'Recordatorio para confirmar correo electrónico',
                    text: `Por favor, confirma tu correo electrónico. Si no lo hacés dentro de ${2 - user.reminderCount} semanas, va a ser eliminada de la base de datos`,
                };

                await transporter.sendMail(mailOptions);
            }

            console.log(users.length + ' recordatorios enviados correctamente.');
        } else {
            console.log('No hay usuarios que cumplan con los criterios para recibir recordatorios.');
        }
    } catch (error) {
        console.error('Error al enviar recordatorios:', error.message);
    }
};

export default sendReminders;