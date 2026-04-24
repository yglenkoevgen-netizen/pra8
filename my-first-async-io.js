const fs = require('fs');
const filePath = process.argv[2];
fs.readFile(filePath, 'utf8', function callback(err, data) {
  if (err) {
    return console.log(err);
  }
  
  const linesCount = data.split('\n').length - 1;
  console.log(linesCount);
});