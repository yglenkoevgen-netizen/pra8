const http = require('http');
const port = process.argv[2] || 3000;
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/json-calc') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                if (typeof data.a !== 'number' || typeof data.b !== 'number' || !data.operation) {
                    res.writeHead(422);
                    return res.end();
                }
                const { a, b, operation } = data;
                let result;
                switch (operation) {
                    case 'add':
                        result = a + b;
                        break;
                    case 'subtract':
                        result = a - b;
                        break;
                    case 'multiply':
                        result = a * b;
                        break;
                    case 'divide':
                        if (b === 0) {
                            res.writeHead(400);
                            return res.end();
                        }
                        result = a / b;
                        break;
                    default:
                        res.writeHead(400);
                        return res.end();
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ result: result }));
            } catch (error) {
                res.writeHead(400);
                res.end();
            }
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});
server.listen(port);