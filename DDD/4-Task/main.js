'use strict';
const path = require('node:path');
const fs = require('node:fs/promises');
const config = require('./config.js');
const db = require('./db.js')(config.db);
const logger = require('./logger.js');
const hash = require('./hash.js')

// toDo createRouting helper function
const apiPath = path.join(process.cwd(), config.api.path);
const routing = {};

const sandbox = {
    logger: Object.freeze(logger),
    db: Object.freeze(db),
    common: Object.freeze({ hash }),
}

const serverApi = require(`./transport/${config.api.transport}.js`)({
    logger: sandbox.logger,
    port: config.api.port,
});
const staticServer = require('./staticServer.js')({
    port: config.static.port,
    path: config.static.path,
    logger: sandbox.logger,
});

const initApp = async () => {
    const files = await fs.readdir(apiPath);
    for (const fileName of files) {
        if (!fileName.endsWith('.js')) continue;
        const filePath = path.join(apiPath, fileName);
        const apiName = path.basename(filePath, '.js');
        routing[apiName] = require(filePath)({ db: sandbox.db, common: sandbox.common });
    }
    staticServer();
    serverApi(routing);
};

void initApp();