import jsonServerMiddleware from './json-server-middleware.js';
import jsonServer from 'json-server';

const server = jsonServer.create();
const router = jsonServer.router('db.json');

// Apply the middleware before the router
server.use(jsonServerMiddleware);
server.use(router);

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`JSON Server running on port ${PORT}`);
});
