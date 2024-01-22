import { Schema, model } from 'mongoose';

const recoveryTokenSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    expiry: {
        type: Date,
        required: true,
    },
});

export default model('RecoveryToken', recoveryTokenSchema); 