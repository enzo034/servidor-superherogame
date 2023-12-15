
//Asegura que solo los recursos del mismo origen sean permitidos. (Content Security Policy)
export const csp = ((req, res, next) => {
    res.setHeader('Content-Security-Policy', "default-src 'self'");
    next();
  });