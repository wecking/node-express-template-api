var todoModel = require('../model/todoModel');
var config = require('../config');

var bodyParser = require('body-parser');

module.exports = function (app) {

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.get('/api/todos/:username', function (req, res) {
        todoModel.find({username: req.params.username},
            function (err, todos) {

                if (err) {
                    config.logBug(req, err);
                    res.status(500).send(err);
                } else if (Object.keys(todos).length === 0) {
                    config.logBug(req, "no todo found for user ");
                    res.status(404).send("no todo found for user " +
                        req.body.username);
                }else
                    res.status(200).send(todos);
            });

    });


    app.get('/api/todo/:id', function (req, res) {
        todoModel.findById({_id: req.params.id},
            function (err, todo) {
                if (err) {
                    config.logBug(req, err);
                    res.status(404).send("no todo found for user " +
                        req.body.username);
                } else
                res.status(200).send(todo);

            });

    });

    app.put('/api/todo', function (req, res) {
        var newob = {
            username: req.body.username,
            todo: req.body.todo,
            isDone: req.body.isDone,
            hasAttachment: req.body.hasAttachment
        };
        var isUndefined = false;
        for (var key in newob) {
            if (newob[key] === undefined) {
                isUndefined = true;
            }
        }
        if(!isUndefined)
            todoModel.findByIdAndUpdate(req.body._id, newob,
                function (err, todo) {
                    if (err) {
                        config.logBug(req, err);
                        res.status(500).send(err);
                    }else
                        res.status(200).send(todo);
            });
        else {
            config.logBug(req, key + "is Undefined");
            res.status(415).send({
                result: "Insertion Failed",
                key : " is undefined"
            });
        }
    });

    app.post('/api/todo', function (req, res) {
        //assuming that all keys are unique
        var newob = {
            username: req.body.username,
            todo: req.body.todo,
            isDone: req.body.isDone,
            hasAttachment: req.body.hasAttachment
        }
        var newTodo = todoModel(newob);
        var isUndefined = false;
        for (var key in newob) {
            if (newob[key] === undefined){
                isUndefined = true;
            }
        };
        if(!isUndefined)
            newTodo.save(function (err, todo) {
                if (err){
                    config.logBug(req, err);
                    res.status(500).send({result :"Insertion Failed " });
                }else
                    res.status(201).send(todo);
            });
        else{
            config.logBug(req, key + " is Undefined");
            res.status(400).send({result :"Insertion Failed",
                key : " is undefined" });
        }

    });

    app.delete('/api/todo', function (req, res) {
        todoModel.findByIdAndRemove(req.body._id,
            function (err, todo) {
                if (err){
                    config.logBug(req, err);
                    res.status(409).send(err);

                }else
                    res.status(200).send(todo);
            })
    });

    return app;

};