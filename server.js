// Servidor estático mínimo (sin dependencias) para servir el CRM en Railway.
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const ROOT = __dirname;

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let archivo = path.join(ROOT, url === '/' ? 'index.html' : url);

  // Evita salir del directorio del proyecto.
  if (!archivo.startsWith(ROOT)) {
    res.writeHead(403).end('Prohibido');
    return;
  }

  fs.readFile(archivo, (err, data) => {
    if (err) {
      // Cualquier ruta desconocida cae al index (app de una sola página).
      fs.readFile(path.join(ROOT, 'index.html'), (err2, home) => {
        if (err2) {
          res.writeHead(404).end('No encontrado');
        } else {
          res.writeHead(200, { 'Content-Type': TIPOS['.html'] }).end(home);
        }
      });
      return;
    }
    const tipo = TIPOS[path.extname(archivo).toLowerCase()] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': tipo }).end(data);
  });
}).listen(PORT, () => {
  console.log(`CRM escuchando en el puerto ${PORT}`);
});
