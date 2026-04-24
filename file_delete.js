const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
  if (req.method === 'DELETE' && req.url === '/data') {
    const filePath = path.join(__dirname, 'data.json');

    fs.unlink(filePath, (err) => {
      if (err) {
        res.writeHead(500);
        return res.end();
      }
      
      res.writeHead(200);
      res.end();
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

const port = process.argv[2] || 3000;
server.listen(port);