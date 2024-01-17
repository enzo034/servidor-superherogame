import User from '../models/User.model.js';
import Pelea from '../models/Pelea.model.js';
import catchError from '../utils/genericError.js';

export const getPeleasByUser = async (req, res) => {
    try {
        const userId = req.userId;

        const user = await User.findById(userId);

        if (user.historial.length < 1) {
            return res.status(204).send();
        }

        const historialCompleto = await Pelea.find({ _id: { $in: user.historial } });

        return res.status(200).json({
            message: "La petición fué completada exitosamente",
            historialCompleto,
        });
    } catch (error) {
        catchError(error);
        return;
    }
}

export const agregarPelea = async (req, res) => { 
    try {
        const { idHeroe1, idHeroe2, idGanador, fechaPelea } = req.body;
        const userId = req.userId;

        const newPelea = new Pelea({
            idHeroe1,
            idHeroe2,
            idGanador,
            fechaPelea
        })

        const savedPelea = await newPelea.save();

        let user = User.findById(userId);
    
        let updateQuery;

        if (idGanador === idHeroe1) {
            user.historial.push(savedPelea._id);
            user.equipos.push(idHeroe2);
        } else if(user.equipos.length === 1){
            user.historial.push(savedPelea._id);
        } else {
            user.historial.push(savedPelea._id);
            user.historial.pull(idHeroe1);
        }

        await user.save();

        return res.status(200).json({
            message: "La pelea se guardó correctamente",
            user
        })
    } catch (error) {
        catchError(error);
        return;
    }
}