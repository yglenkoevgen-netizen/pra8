const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const port = process.argv[2] || 3000;
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === '/file' && req.method === 'GET') {
        const fileName = parsedUrl.query.fileName;

        if (!fileName) {
            res.writeHead(400);
            return res.end('Missing fileName parameter');
        }

        const filePath = path.join(process.cwd(), fileName);
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                res.writeHead(400);
                return res.end('File does not exist');
            }

            res.writeHead(200, {
                'Content-Type': 'text/plain; charset=utf-8'
            });

            const fileStream = fs.createReadStream(filePath);
            fileStream.pipe(res);
            fileStream.on('error', () => {
                if (!res.headersSent) {
                    res.writeHead(400);
                }
                res.end('Error streaming file');
            });
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});