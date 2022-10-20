'use strict';

module.exports = {
    static: {
        port: 6002,
        path: '../client/static',
    },
    api: {
        port: 6001,
        path: './api',
        transport: 'http' // http | ws
    },
    db: {
        host: '127.0.0.1',
        port: 5432,
        database: 'example',
        user: 'marcus',
        password: 'marcus',
    },
    logger: {
        path: './log',
    }
}