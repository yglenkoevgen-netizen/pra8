const http = require('http');
const fs = require('fs/promises');
const { performance } = require('perf_hooks');

const server = http.createServer(async (req, res) => {
    if (req.method !== 'GET' || req.url !== '/parallel') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('Not Found');
    }

    const start = performance.now();

    try {
        const [a, b, c] = await Promise.all([
            fs.readFile('a.txt', 'utf8'),
            fs.readFile('b.txt', 'utf8'),
            fs.readFile('c.txt', 'utf8')
        ]);

        const end = performance.now();
        const combinedString = a.trim() + b.trim() + c.trim();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            combined: combinedString,
            elapsedMs: Math.round(end - start)
        }));
    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error: ' + err.message);
    }
});

const port = process.argv[2] || 3000;
server.listen(port, () => console.log(`Parallel server listening on port ${port}`));