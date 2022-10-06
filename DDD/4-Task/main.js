import config from './config.js';
let server = (await import(`./connections/${config.transport}.js`)).default;  
import staticServer from './staticServer.js';
import path from 'node:path';
import fs from 'node:fs/promises';

console.log(server);

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
    staticServer(config.staticFolder, config.staticServerPort);
    server(routing, config.serverPort);
};

initApp();