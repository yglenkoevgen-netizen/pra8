const http = require('http');
const fs = require('fs');
const url = require('url');

const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    if (parsedUrl.pathname === '/upload' && req.method === 'POST') {
        const writeStream = fs.createWriteStream('upload.txt');
        req.pipe(writeStream);

        writeStream.on('finish', () => {
            res.writeHead(200);
            res.end('File uploaded successfully');
        });

        writeStream.on('error', (err) => {
            console.error(err);
            res.writeHead(500);
            res.end('Internal Server Error');
        });

    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});