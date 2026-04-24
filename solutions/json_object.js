const http = require('http');
const port = process.argv[2] || 3000;
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/json-object') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                if (!data.name || data.age === undefined || typeof data.age !== 'number') {
                    res.writeHead(422);
                    return res.end();
                }
                const responseData = {
                    greeting: `Hello ${data.name}`,
                    isAdult: data.age >= 18
                };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(responseData));
            } catch (error) {
                res.writeHead(400);
                res.end('Bad Request: Invalid JSON');
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