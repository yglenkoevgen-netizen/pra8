const http = require('http');
const port = process.argv[2];
const server = http.createServer(function (req, res) {
  if (req.method === 'GET') {
    const parsedUrl = new URL(req.url, 'http://localhost');
    const timeStr = parsedUrl.searchParams.get('iso');
    const date = new Date(timeStr);
    let result;

    if (parsedUrl.pathname === '/api/parsetime') {
      result = {
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds()
      };
    } else if (parsedUrl.pathname === '/api/unixtime') {
      result = {
        unixtime: date.getTime()
      };
    }

    if (result) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    } else {
      res.writeHead(404);
      res.end();
    }
  }
});

server.listen(port);