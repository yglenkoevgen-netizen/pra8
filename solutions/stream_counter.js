const http = require('http');
const port = process.argv[2] || 3000;
const server = http.createServer((req, res) => {
    if (req.url === '/count' && req.method === 'POST') {
        let byteCount = 0;
        let chunkCount = 0;

        req.on('data', (chunk) => {
            chunkCount++;
            byteCount += chunk.length;
        });

        req.on('end', () => {
            const result = {
                bytes: byteCount,
                chunks: chunkCount
            };

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        });

        req.on('error', (err) => {
            res.writeHead(500);
            res.end(JSON.stringify({ error: err.message }));
        });

    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Counter server is listening on port ${port}`);
});