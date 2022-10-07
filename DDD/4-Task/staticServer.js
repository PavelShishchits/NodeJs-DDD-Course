import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

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

const prepareFile = async (root, url) => {
    const paths = [path.join(process.cwd(), root), url];
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

const server = (root, port) => {
    http.createServer(async (req, res) => {
        const file = await prepareFile(root, req.url);
    
        console.log(file.fileExtention);
        const statusCode = file.fileFound ? 200 : 404;
        const mimeType = MIME_TYPES[file.fileExtention] || MIME_TYPES.default;
    
        res.writeHead(statusCode, {
            'Content-Type': mimeType,
        });
    
        file.stream.pipe(res);
    
        console.log(`Request: ${req.method} ${req.url} ${statusCode}`);
    }).listen(port);

    console.log(`Static Server running on PORT:${port}`);
};

export default server;