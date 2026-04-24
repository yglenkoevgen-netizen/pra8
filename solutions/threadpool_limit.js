const http = require('http');
const crypto = require('crypto');
const util = require('util');
const { performance } = require('perf_hooks');

const pbkdf2Async = util.promisify(crypto.pbkdf2);
const server = http.createServer(async (req, res) => {
    if (req.method !== 'GET' || req.url !== '/threadpool-limit') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('Not Found');
    }

    const start = performance.now();
    try {
        const tasks = [];
        const numberOfTasks = 8;
        for (let i = 0; i < numberOfTasks; i++) {
            tasks.push(pbkdf2Async('secret_password', 'salt', 100000, 64, 'sha512'));
        }

        await Promise.all(tasks);
        const end = performance.now();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            tasks: numberOfTasks,
            durationMs: Math.round(end - start)
        }));

    } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error: ' + err.message);
    }
});

const port = process.argv[2] || 3000;
server.listen(port, () => console.log(`Threadpool server listening on port ${port}`));