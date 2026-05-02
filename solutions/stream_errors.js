const http = require('http');
const fs = require('fs');
const url = require('url');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === '/missing-file' && req.method === 'GET') {
        const fileName = parsedUrl.query.fileName;

        if (!fileName) {
            res.writeHead(400);
            return res.end('fileName query parameter is missing');
        }

        const fileStream = fs.createReadStream(fileName);
        fileStream.on('error', (err) => {
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error: Something went wrong with the file stream');
            } else {
                res.end();
            }
        });

        fileStream.pipe(res);
        res.on('error', () => fileStream.destroy());

    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Error handling server is listening on port ${port}`);
});