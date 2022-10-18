import config from './config.js';
import staticServer from './staticServer.js';
import path from 'node:path';
import fs from 'node:fs/promises';
const server = (await import(`./transport/${config.transport}.js`)).default;

const apiPath = path.join(process.cwd(), config.api.path);
const routing = {};

const initApp = async () => {
    const files = await fs.readdir(apiPath);
    for (const fileName of files) {
        if (!fileName.endsWith('.js')) continue;
        const filePath = path.join(apiPath, fileName);
        const apiName = path.basename(filePath, '.js');
        routing[apiName] = (await import(filePath)).default;
    }
    staticServer(config.static.path, config.static.port);
    server(routing, config.api.port);
};

void initApp();