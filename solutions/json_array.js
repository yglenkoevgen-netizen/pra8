const http = require('http');
const port = process.argv[2] || 3000;
const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/json-array') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const data = JSON.parse(body);
                if (!data || !Array.isArray(data.numbers)) {
                    res.writeHead(422);
                    return res.end();
                }
                const hasNonNumeric = data.numbers.some(item => typeof item !== 'number');
                if (hasNonNumeric) {
                    res.writeHead(422);
                    return res.end();
                }
                const numbers = data.numbers;
                const count = numbers.length;
                let sum = 0;
                let average = 0;
                if (count > 0) {
                    sum = numbers.reduce((acc, curr) => acc + curr, 0);
                    average = sum / count;
                }
                const responseData = {
                    count: count,
                    sum: sum,
                    average: average
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