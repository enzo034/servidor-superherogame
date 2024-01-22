import dotenv from 'dotenv'

dotenv.config();

export const PORT = process.env.PORT || 3000;

export const DB_URI = process.env.DB_URI;

export const SECRET_KEY = process.env.SECRET_KEY;

export const CURRENT_URL = process.env.CURRENT_URL;

export const NM_EMAIL = process.env.NM_EMAIL;

export const NM_PASSWORD = process.env.NM_PASSWORD;