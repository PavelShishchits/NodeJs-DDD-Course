import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const LOCAL_HOST = 'http://127.0.0.1';
const PORT = 8000;

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

const STATIC_PATH = path.join(process.cwd(), './static');

const promiseResponseToBool = [() => true, () => false];

const prepareFile = async (url) => {
    const paths = [STATIC_PATH, url];
    if (url.endsWith('/')) paths.push('index.html');

    const filePath = path.join(...paths);
    const pathTraversal = !filePath.startsWith(STATIC_PATH); // check if request for file isn't traverslal (../../...)
    const exists = await fs.promises.access(filePath).then(...promiseResponseToBool); // check if file exists
    const fileFound = exists && !pathTraversal;

    const streamPath = fileFound ? filePath : STATIC_PATH + '/404.html'

    const fileExtention = path.extname(streamPath).replace('.', '');

    const stream = fs.createReadStream(streamPath); // toDo investigate

    return {
        fileFound,
        fileExtention,
        stream,
    }
}

const server = http.createServer(async (req, res) => {
    const file = await prepareFile(req.url);

    const statusCode = file.fileFound ? 200 : 404;
    const mimeType = MIME_TYPES[file.fileExtention] || MIME_TYPES.default;

    res.writeHead(statusCode, {
        'Content-Type': mimeType,
    });

    file.stream.pipe(res);

    console.log(`Request: ${req.method} ${req.url} ${statusCode}`);
});

server.listen(PORT);

console.log(`Server running on ${LOCAL_HOST}:${8000}`);