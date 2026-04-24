const http = require('http');
const port = process.argv[2];
const server = http.createServer((req, res) => {
    const parsedUrl = new URL(req.url, 'http://localhost');
    if (req.method === 'GET' && parsedUrl.pathname === '/echo') {
        const msg = parsedUrl.searchParams.get('msg') || '';
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end(msg);
        
    } else {
        res.writeHead(404);
        res.end('Not Found');
    }
});
server.listen(port);