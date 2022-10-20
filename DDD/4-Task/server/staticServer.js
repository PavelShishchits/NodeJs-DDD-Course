'use strict';
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const MIME_TYPES = {
    default: 'application/octet-stream',
    html: 'text/html; charset=UTF-8',
    js: 'application/javascript; charset=UTF-8',
    css: 'text/css',
    png: 'image/png',
    jpg: 'image/jpg',
    gif: 'image/gif',
    ico: 'image/x-icon',
    svg: 'image/svg+xml',
};

const promiseResponseToBool = [() => true, () => false];

const prepareFile = async (root, url) => {
    const staticPath = path.join(process.cwd(), root);
    const paths = [staticPath, url];
    if (url.endsWith('/')) paths.push('index.html');

    const filePath = path.join(...paths);
    const pathTraversal = !filePath.startsWith(staticPath); // check if request for file isn't traversal (../../...)
    const exists = await fs.promises.access(filePath).then(...promiseResponseToBool); // check if file exists
    const fileFound = exists && !pathTraversal;

    const streamPath = fileFound ? filePath : staticPath + '/404.html'

    const fileExtention = path.extname(streamPath).replace('.', '');

    const stream = fs.createReadStream(streamPath); // toDo investigate

    return {
        fileFound,
        fileExtention,
        stream,
    }
}

module.exports = ({ path, port, logger }) => () => {
    http.createServer(async (req, res) => {
        const file = await prepareFile(path, req.url);

        const statusCode = file.fileFound ? 200 : 404;
        const mimeType = MIME_TYPES[file.fileExtention] || MIME_TYPES.default;

        res.writeHead(statusCode, {
            'Content-Type': mimeType,
        });

        file.stream.pipe(res);

        logger.log(`Static Server Request: ${req.method} ${req.url} ${statusCode}`);
    }).listen(port);

    logger.log(`Static Server running on PORT:${port}`);
};