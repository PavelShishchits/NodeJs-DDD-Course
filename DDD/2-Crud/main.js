import http from 'node:http';
import recieveArgs from './recieveArgs.js';
import users from './db/users.js';

const PORT = 8000;

const crud = {
    get: 'read',
    post: 'create',
    put: 'update',
    delete: 'delete'
};

const routing = {
    user: users,
};

// Front controller pattern (единая точка входа для всех запросов)
const server = http.createServer(async (req, res) => {
    const { method, url, socket } = req;
    const [name, id] = url.substring(1).split('/');
    const entity = routing[name];
    if (!entity) return res.end('Not found');

    const procedure = crud[method.toLowerCase()];
    const handler = entity[procedure];
    if (!handler) return res.end('Not found');
    const src = handler.toString();
    const signature = src.substring(0, src.indexOf(')'));
    const args = [];

    if (signature.includes('(id')) args.push(id);
    if (signature.includes('{')) args.push(await recieveArgs(req));
    console.log(`${method} ${url} ${[...args]}`);
    const result = await handler(...args);
    res.end(JSON.stringify(result.rows));
});

server.listen(PORT);