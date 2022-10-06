import server from './connections/https.js';
import staticServer from './staticServer.js';
import path from 'node:path';
import fs from 'node:fs/promises';

const PORT = 8000;
const STATIC_SERVER_PORT = 8001;

const apiPath = path.join(process.cwd(), './api');

const routing = {};

const initApp = async () => {
    const files = await fs.readdir(apiPath);
    for (const fileName of files) {
        if (!fileName.endsWith('.js')) continue;
        const filePath = path.join(apiPath, fileName);
        const apiName = path.basename(filePath, '.js');
        routing[apiName] = (await import(filePath)).default;
    }
    staticServer('./static', STATIC_SERVER_PORT);
    server(routing, PORT);
};

initApp();