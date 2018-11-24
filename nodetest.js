// write 'hello, ' and then end with 'world!'
const fs = require('fs');
const file = fs.createWriteStream(__dirname + 'example.txt');
file.write('hello, ');
file.end('world!');