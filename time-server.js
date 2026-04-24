const net = require('net');
function zeroFill(number) {
  if (number < 10) {
    return '0' + number;
  }
  return number;
}

const server = net.createServer(function (socket) {
  const date = new Date();
  const year = date.getFullYear();
  const month = zeroFill(date.getMonth() + 1);
  const day = zeroFill(date.getDate());
  const hours = zeroFill(date.getHours());
  const minutes = zeroFill(date.getMinutes());
  const dateString = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes;
  socket.end(dateString + '\n');
});

const port = process.argv[2];
server.listen(port);