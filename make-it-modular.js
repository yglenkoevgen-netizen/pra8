const mymodule = require('./mymodule');
const folderPath = process.argv[2];
const extensionFilter = process.argv[3];

mymodule(folderPath, extensionFilter, function (err, list) {
  if (err) {
    return console.log('Сталася помилка:', err);
  }

  for (let i = 0; i < list.length; i++) {
    console.log(list[i]);
  }
});