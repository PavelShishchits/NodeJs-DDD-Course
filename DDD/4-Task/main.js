'use strict';
const path = require('node:path');
const fs = require('node:fs/promises');
const config = require('./config.js');
const staticServer = require('./staticServer.js');
const server = require(`./transport/${config.api.transport}.js`);

const apiPath = path.join(process.cwd(), config.api.path);
const routing = {};

const initApp = async () => {
    const files = await fs.readdir(apiPath);
    for (const fileName of files) {
        if (!fileName.endsWith('.js')) continue;
        const filePath = path.join(apiPath, fileName);
        const apiName = path.basename(filePath, '.js');
        // toDo inject db config to db.js through api.js files???
        routing[apiName] = (await import(filePath)).default;
    }
    staticServer(config.static.path, config.static.port);
    server(routing, config.api.port);
};

void initApp();