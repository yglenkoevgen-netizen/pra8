const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = process.argv[2] || 3000;
const DATA_PATH = path.join(__dirname, 'data.json');

const server = http.createServer((req, res) => {
  if (req.url === '/items' && req.method === 'POST') {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const newItem = JSON.parse(body);

        fs.readFile(DATA_PATH, 'utf8', (err, data) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Read Error' }));
          }

          const items = JSON.parse(data);
          items.push(newItem);

          fs.writeFile(DATA_PATH, JSON.stringify(items, null, 2), err => {
            if (err) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              return res.end(JSON.stringify({ error: 'Write Error' }));
            }

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newItem));
          });
        });
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT);