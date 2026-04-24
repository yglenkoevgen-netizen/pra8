const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/data') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        JSON.parse(body);
        const filePath = path.join(__dirname, 'data.json');

        fs.writeFile(filePath, body, (err) => {
          if (err) {
            res.writeHead(500);
            return res.end();
          }
          res.writeHead(200);
          res.end();
        });
      } catch (e) {
        res.writeHead(400);
        res.end();
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

const port = process.argv[2] || 3000;
server.listen(port);