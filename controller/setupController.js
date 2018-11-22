var Todos = require('../model/todoModel');

module.exports = function (app) {

    //Seed Database
    var startTodos = [
        {
            username : 'test',
            todo: 'go home',
            isDone: false,
            hasAttachment: false
        },

        {
            username: 'test',
            todo: 'eat dinner',
            isDone: false,
            hasAttachment: false
        },

        {
            username: 'test',
            todo: 'play tennis',
            isDone: false,
            hasAttachment: false
        }
    ];


    app.get('/api/setUpTodo', function (req, res) {
        Todos.create(startTodos, function (err, results) {
            res.send(results);
        });
    });
    app.delete('/api/delete/setUpTodo', function (req, res) {
        startTodos.forEach(function (todo) {
            Todos.deleteOne(todo, function (err, results) {
                if (err)res.send(err);
            });
        });
        res.send({result: "Successfully removed"});
    });
};