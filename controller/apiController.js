var todoModel = require('../model/todoModel');
var mongoose = require('mongoose');
var config = require('../config');

var bodyParser = require('body-parser');

module.exports = function (app) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended : true}));

    app.get('/api/todos/:username', function (req, res) {

        todoModel.find({ username : req.params.username },
            function (err, todos) {

                if (err)res.send(err);
                res.send(todos);
            
            });

    });


    app.get('/api/todo/:id', function (req, res) {
        console.log(req.body.username + "sfdfdfdfdfdf")
        todoModel.findById({_id : req.params.id},
            function (err, todo) {

                if (err)res.send(err);
                res.send(todo);

        });

    });

    app.put('/api/todo', function (req, res) {
        todoModel.findByIdAndUpdate(req.body._id,
            {   username : req.body.username,
                todo: req.body.todo,
                isDone: req.body.isDone,
                hasAttachment: req.body.hasAttachment},
            function (err, todo) {
                if (err)res.send(err);
                res.send(todo);
            });
    });

    app.post('/api/todo', function (req, res) {

        if (req.body.username !== undefined) {
                var newTodo = todoModel({   username : req.body.username,
                     todo: req.body.todo,
                     isDone: req.body.isDone,
                     hasAttachment: req.body.hasAttachment
                 });

            newTodo.save(function (err, todo) {
                if (err)res.send(err);
                res.send(todo);
            });
        }else
        res.send({result :"Insertion Failed"});

    });

    app.delete('/api/todo', function (req, res) {
        todoModel.findByIdAndRemove(req.body._id,
            function (err, todo) {
                if (err)res.send(err);
                res.send(todo);
            })
    });

    return app;

};