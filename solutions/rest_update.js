const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = process.argv[2] || 3000;
const DATA_PATH = path.join(__dirname, 'data.json');

const server = http.createServer((req, res) => {
  // Обробляємо PUT /items/:id
  if (req.url.startsWith('/items/') && req.method === 'PUT') {
    const id = parseInt(req.url.split('/')[2]);
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      try {
        const updates = JSON.parse(body);

        fs.readFile(DATA_PATH, 'utf8', (err, data) => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Read Error' }));
          }

          let items = JSON.parse(data);
          const index = items.findIndex(i => i.id === id);

          if (index !== -1) {
            items[index] = { ...items[index], ...updates, id };

            fs.writeFile(DATA_PATH, JSON.stringify(items, null, 2), err => {
              if (err) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({ error: 'Write Error' }));
              }

              res.writeHead(200, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify(items[index]));
            });

          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Item not found' }));
          }
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