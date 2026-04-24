const http = require('http');
const port = process.argv[2] || 3000;
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/json-nested') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                if (!data.user) {
                    res.writeHead(422);
                    return res.end();
                }
                if (!data.user.roles || !Array.isArray(data.user.roles)) {
                    res.writeHead(422);
                    return res.end();
                }
                const user = data.user;
                const responseData = {
                    name: user.name,
                    roleCount: user.roles.length,
                    isAdmin: user.roles.includes('admin')
                };
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(responseData));
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