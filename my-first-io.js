const fs = require('fs');
const filePath = process.argv[2];
const fileBuffer = fs.readFileSync(filePath);
const text = fileBuffer.toString();
const linesArray = text.split('\n');
const newLinesCount = linesArray.length - 1;
console.log(newLinesCount);