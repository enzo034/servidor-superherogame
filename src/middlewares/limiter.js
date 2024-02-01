import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 30,
    message: "El limite de entradas en el mismo periodo de tiempo se excedió"
});

export const mLimiter = rateLimit({
    windowMs: 10000,
    max: 2,
    message: "El limite de entradas en el mismo periodo de tiempo se excedió"
});

export const smLimiter = rateLimit({
    windowMs: 500,
    max: 2,
    message: "El limite de entradas en el mismo periodo de tiempo se excedió"
});

