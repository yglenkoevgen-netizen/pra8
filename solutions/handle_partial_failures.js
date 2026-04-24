const http = require('http');
const fs = require('fs/promises');

const server = http.createServer((req, res) => {
    if (req.method !== 'POST' || req.url !== '/error-handling') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('Not Found');
    }

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        let files;

        try {
            files = JSON.parse(body);
            if (!Array.isArray(files)) {
                throw new Error('Not an array');
            }
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            return res.end('Bad Request: Expected a JSON array');
        }

        try {
            const promises = files.map(file => fs.readFile(file, 'utf8'));
            const results = await Promise.allSettled(promises);
            const successes = [];
            const failures = [];

            results.forEach(result => {
                if (result.status === 'fulfilled') {
                    successes.push(result.value.trim()); 
                } else {
                    failures.push(result.reason.message);
                }
            });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                successes: successes,
                failures: failures,
                total: files.length
            }));

        } catch (err) {
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Internal Server Error: ' + err.message);
        }
    });
});

const port = process.argv[2] || 3000;
server.listen(port, () => console.log(`Server listening on port ${port}`));