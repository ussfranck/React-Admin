import jsonServer from 'json-server';
import jsonServerMiddleware from './json-server-middleware.js';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Add CORS and other headers
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Expose-Headers', 'Content-Range');
  next();
});

server.use(jsonServerMiddleware);
server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server running on port ${PORT}`);
});