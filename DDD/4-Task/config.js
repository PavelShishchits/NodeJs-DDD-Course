export default {
    static: {
        port: 6002,
        path: './static',
    },
    api: {
        port: 6001,
        path: './api',
    },
    db: {
        host: '127.0.0.1',
        port: 5432,
        database: 'example',
        user: 'marcus',
        password: 'marcus',
    },
    transport: 'http' // http | ws
}