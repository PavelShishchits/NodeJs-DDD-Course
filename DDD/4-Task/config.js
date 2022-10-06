export default {
    staticServerPort: 8001,
    staticFolder: './static',
    serverPort: 8000,
    dbSettings: {
        host: '127.0.0.1',
        port: 5432,
        database: 'example',
        user: 'marcus',
        password: 'marcus',
    },
    transport: 'http' // http | ws
}