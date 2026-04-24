const fs = require('fs');
const path = require('path');
const folderPath = process.argv[2];
const extensionFilter = '.' + process.argv[3]; 
fs.readdir(folderPath, function callback(err, list) {
  if (err) {
    return console.log(err);
  }
  
  for (let i = 0; i < list.length; i++) {
    if (path.extname(list[i]) === extensionFilter) {
      console.log(list[i]);
    }
  }
});