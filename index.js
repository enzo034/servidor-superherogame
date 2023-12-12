import app from './src/app.js'
import { PORT } from './src/config.js';

import { connectDB } from './src/db.js';

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
