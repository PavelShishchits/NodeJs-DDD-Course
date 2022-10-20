'use strict';
const http = require('node:http');
const { Buffer } = require('node:buffer');

const HEADERS = {
    'X-XSS-Protection': '1; mode=block',
    'X-Content-Type-Options': 'nosniff',
    'Strict-Transport-Security': 'max-age=31536000; includeSubdomains; preload',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json; charset=UTF-8',
};

// вычитывает из сокета все буферы, склеить их, и распарсить в JSON
const receiveArgs = async (req) => {
    const buffers = [];
    // req реализует протокол асинхронной итерации (async iterable)
    for await (const chunk of req) {
        buffers.push(chunk);
    }
    const data = Buffer.concat(buffers).toString();
    return JSON.parse(data);
};

module.exports = ({ logger, port }) => (routing) => {
    // Front controller pattern (единая точка входа для всех запросов)
    http.createServer(async (req, res) => {
        res.writeHead(200, HEADERS);
        if (req.method !== 'POST') return res.end('Not found');

        const { url, socket } = req;

        const [name, method] = url.substring(1).split('/');

        const entity = routing[name];
        if (!entity) return res.end('Not found');

        const handler = entity[method];
        if (!handler) return res.end('Not found');

        const { data: args } = await receiveArgs(req);

        logger.dir({
            url,
            name,
            method,
            args,
        });

        const result = await handler(...args);
        res.end(JSON.stringify(result.rows));
    }).listen(port);

    logger.log(`Api Server running on PORT ${port}`);
}