const http = require('http');
const fs = require('fs');
const url = require('url');
const { Transform } = require('stream');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (parsedUrl.pathname === '/upper' && req.method === 'GET') {
        const fileName = parsedUrl.query.fileName;

        if (!fileName) {
            res.writeHead(400);
            return res.end('fileName parameter is required');
        }

        const filePath = `./${fileName}`;
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                res.writeHead(400);
                return res.end('File not found');
            }

            const upperCaseTransform = new Transform({
                transform(chunk, encoding, callback) {
                    callback(null, chunk.toString().toUpperCase());
                }
            });

            res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
            fs.createReadStream(filePath)
                .pipe(upperCaseTransform)
                .pipe(res);
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});