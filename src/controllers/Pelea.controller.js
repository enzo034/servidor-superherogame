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
    
        let updateQuery;

        if (idGanador === idHeroe1) {
            updateQuery = {
                $push: { historial: savedPelea._id, equipos: idHeroe2 }
            };
        } else if(!req.body.isLast){
            updateQuery = {
                $push: { historial: savedPelea._id },
                $pull: { equipos: idHeroe1 }
            };
        } else {
            updateQuery = {
                $push: { historial: savedPelea._id }
            }
        }

        const actualUser = await User.findByIdAndUpdate(userId, updateQuery, { new: true });

        return res.status(200).json({
            message: "La pelea se guardó correctamente",
            actualUser
        })
    } catch (error) {
        catchError(error);
        return;
    }
}