const fs = require('fs');
const path = require('path');
module.exports = function (dirName, extStr, callback) {
  fs.readdir(dirName, function (err, list) {
    if (err) {
      return callback(err);
    }
    const filteredList = [];
    for (let i = 0; i < list.length; i++) {
      if (path.extname(list[i]) === '.' + extStr) {
        filteredList.push(list[i]);
      }
    }

    callback(null, filteredList);
  });
};