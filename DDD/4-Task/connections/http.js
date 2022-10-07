import http from 'node:http';
import { crudMap } from '../methodsMap.js';
import { Buffer } from 'node:buffer';
import logger from '../logger.js';

// вычитывает из сокета все буферы, склеить их, и распарсить в JSON
const recieveArgs = async (req) => {
    const buffers = [];
    // req реализует протокол асинхронной итерации (async iterable)
    for await (const chunk of req) {
        buffers.push(chunk);
    };
    const data = Buffer.concat(buffers).toString();
    return JSON.parse(data);
};

const setCorsHeaders = (res) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8001');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, PUT, DELETE');
    res.setHeader('Access-Control-Max-Age', 2592000); 
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const server = (routing, port) => {
    // Front controller pattern (единая точка входа для всех запросов)
    http.createServer(async (req, res) => {
        setCorsHeaders(res);

        const { method, url, socket } = req;

        const [name, id] = url.substring(1).split('/');
        const entity = routing[name];
        if (!entity) return res.end('Not found');
        
        const procedure = crudMap[method.toLowerCase()];
        const handler = entity[procedure];
        if (!handler) return res.end('Not found');

        const src = handler.toString();
        const signature = src.substring(0, src.indexOf(')'));
        const args = [];

        if (signature.includes('(id')) args.push(id);
        if (signature.includes('{')) args.push(await recieveArgs(req));

        logger.dir({
            socket,
            method,
            url,
            args,
        });
    
        const result = await handler(...args);
        res.end(JSON.stringify(result.rows));
    }).listen(port);

    console.log(`Listen on PORT ${port}`);
}

export default server;