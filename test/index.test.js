'use strict';

var testTodo = require('./testTodo');


testTodo();

setTimeout(function() {
    process.exit(1)
}, 13000);

