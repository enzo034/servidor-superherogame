import app from './app.js'
import { PORT } from './config.js';

import { connectDB } from './db.js';

connectDB();

app.get("/", (req, res) => {
    const htmlResponse = `
      <html>
        <head>
          <title>NodeJs y Express en Vercel</title>
        </head>
        <body>
          <h1>Soy un proyecto Back end en vercel</h1>
        </body>
      </html>
    `;
    res.send(htmlResponse);
  });

app.listen(PORT);

console.log("Servidor escuchando en el puerto", PORT);
