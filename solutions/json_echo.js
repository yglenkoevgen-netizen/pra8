const http = require('http');
const port = process.argv[2] || 3000;

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/json-echo') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            if (!body) {
                res.writeHead(400);
                return res.end();
            }
            try {
                const jsonObject = JSON.parse(body);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(jsonObject));
            } catch (error) {
                res.writeHead(400);
                res.end('Invalid JSON');
            }
        });
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

server.listen(port, () => {
    console.log(`Server listening on port ${port}...`);
});