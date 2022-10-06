import http from 'node:http';
import pg from 'pg';
import recieveArgs from './recieveArgs.js';
import hash from './hash.js';

const PORT = 8000;

// toDo get values from .env
const pool = new pg.Pool({
    host: '127.0.0.1',
    port: 5432,
    database: 'example',
    user: 'marcus',
    password: 'marcus',
});

const routing = {
    user: {
        get(id) {
            if (!id) return pool.query('SELECT id, login FROM users');
            const sql = 'SELECT id, login FROM users WHERE id = $1';
            return pool.query(sql, [id]);
        },
        
        // toDo why doesn't return value???
        async post({ login, password }) {
            const sql = 'INSERT INTO users (login, password) VALUES ($1, $2)';
            const passwordHash = await hash(password);
            return pool.query(sql, [login, passwordHash]);
        },

        async put(id, { login, password }) {
            const sql = 'UPDATE users SET login = $1, password = $2 WHERE id = $3';
            const passwordHash = await hash(password);
            return pool.query(sql, [login, passwordHash, id]);
        },

        delete(id) {
            const sql = 'DELETE FROM users WHERE id = $1';
            return pool.query(sql, [id]);
        },
    },
};

// Front controller pattern (единая точка входа для всех запросов)
const server = http.createServer(async (req, res) => {
    const { method, url, socket } = req;
    const [name, id] = url.substring(1).split('/');
    const entity = routing[name];

    if (!entity) return res.end('Not found');

    const handler = entity[method.toLowerCase()];
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