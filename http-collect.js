const http = require('http');
const bl = require('bl');
const url = process.argv[2];
http.get(url, function (response) {
  response.pipe(bl(function (err, data) {
    if (err) {
      return console.error(err);
    }

    const dataString = data.toString();
    console.log(dataString.length);
    console.log(dataString);
  }));
  
}).on('error', function(error) {
  console.error(error);
});