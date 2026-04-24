const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/data') {
    let body = '';
    req.on('data', chunk => { body += chunk.toString(); });

    req.on('end', () => {
      const filePath = path.join(__dirname, 'data.json');
      fs.readFile(filePath, 'utf8', (err, fileData) => {
        if (err) {
          res.writeHead(500);
          return res.end();
        }

        try {
          const currentJson = JSON.parse(fileData);
          const newData = JSON.parse(body);
          const updatedJson = { ...currentJson, ...newData };

          fs.writeFile(filePath, JSON.stringify(updatedJson), (writeErr) => {
            if (writeErr) {
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
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

const port = process.argv[2] || 3000;
server.listen(port);