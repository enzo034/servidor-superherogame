import { Schema, model } from "mongoose";
import bcrypt from 'bcrypt'

const userSchema = new Schema({
    nombre: {
        type: String,
    },
    apellido: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    favoritos: [Number],
    equipos: [Number],
    historial: [{
        ref: 'Pelea',
        type: Schema.Types.ObjectId,
    }],
    confirmado: {
        type: Boolean,
        default: false,
    },
    reminderCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    versionKey: false
});

userSchema.statics.encryptPassword = async (password) => { //Función estática para encriptar la contraseña 
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

userSchema.statics.comparePassword = async (receivedPassword, password) => { //Función para comprobar si la contraseña del body es correcta
    return await bcrypt.compare(receivedPassword, password);
}

userSchema.pre('remove', async function (next) { //Middleware para cuando se elimina un usuario, borrar tambien su historial asociado de peleas.
    await Pelea.deleteMany({ _id: { $in: this.historial } });
    next();
});

export default model('User', userSchema);