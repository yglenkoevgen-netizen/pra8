const http = require('http');
const fs = require('fs');
const path = require('path');
const PORT = process.argv[2] || 3000;
const DATA_PATH = path.join(__dirname, 'data.json');

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/items/') && req.method === 'DELETE') {
    const id = parseInt(req.url.split('/')[2]);

    fs.readFile(DATA_PATH, 'utf8', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Read Error' }));
      }

      let items = JSON.parse(data);
      const initialLength = items.length;
      items = items.filter(i => i.id !== id);

      if (items.length < initialLength) {
        fs.writeFile(DATA_PATH, JSON.stringify(items, null, 2), err => {
          if (err) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({ error: 'Write Error' }));
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: 'Deleted' }));
        });

      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Item not found' }));
      }
    });

  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT);