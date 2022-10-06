import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';

// simple static server (more advanced /Users/pavel/Projects/Node/NodeJsCourse/SimpleStaticServer/index.mjs)
const server = (root, port) => {
    http.createServer(async (req, res) => {
        const url = req.url === '/' ? 'index.html' : req.url; 
        const filePath = path.join(root, url);
        
        try {
            const file = await fs.readFile(filePath);
            res.end(file);
        } catch {
            res.statusCode = 404;
            res.end('Not found');
        }
    }).listen(port);

    console.log(`Listen static on port ${port}`);
}

export default server;