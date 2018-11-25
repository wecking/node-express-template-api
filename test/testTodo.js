'use strict';

var app = require('../app'),
    chai = require('chai'),
    request = require('supertest');

var expect = chai.expect;

var userTestTodos;

var newTodo = {
    username : 'test',
    todo: 'The lion of the trib of Judia is my dad ',
    isDone: false,
    hasAttachment: false
};

var newlypostedTodo;

module.exports = function () {
    describe('Test todo api endpoints', function () {

        describe('endpoints should perform below actions', function () {
            it("should get all tasks user(test) todo's", function (done) {
                request(app).get('/api/todos/test')
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(200);
                        expect(res.body).to.be.an('array');
                        expect(res.body.length).to.be.equal(3);
                        userTestTodos = res.body;
                        done();
                    });
            });

            it("should create a todo with user(test)", function (done) {
                request(app).post('/api/todo').send(newTodo)
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(201);
                        expect(res.body.username).to.be.equal('test');
                        newlypostedTodo = res.body;
                        done();
                    });
            });

            it("should Get a todo for an id", function (done) {
                request(app).get('/api/todo/' + newlypostedTodo._id.toString())
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(200);
                        expect(res.body.username).to.be.equal('test');
                        newlypostedTodo = res.body;
                        done();
                    });
            });

            it("should Update a todo for user(test)", function (done) {
                newlypostedTodo.todo = makeid();
                request(app).put('/api/todo').send(newlypostedTodo)
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(200)
                        expect(res.body._id).to.be.equal(newlypostedTodo._id);
                        newlypostedTodo = res.body;
                        done();
                    });
            });
            it("should delete a todo with user(test)", function (done) {
                request(app).delete('/api/todo').send({_id: newlypostedTodo._id})
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(200);
                        expect(res.body._id).to.be.equal(newlypostedTodo._id);
                        done();
                    });
            });

        });

        describe('Test API should fail at the below test', function () {
            it("should not update a todo for user(test)", function (done) {
                newlypostedTodo._id = makeid();
                request(app).put('/api/todo').send(newlypostedTodo)
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(500);
                        expect(res.body._id).to.be.equal(undefined);
                        done();
                    });
            });
            it("should not update a todo for user(test)", function (done) {
                newlypostedTodo._id = makeid();
                request(app).put('/api/todo').send({
                    username : 'test',
                    isDone: false,
                    hasAttachment: false
                }).end(function (err, res) {
                        expect(res.statusCode).to.equal(415);
                        expect(res.body.result).to.be
                            .equal("Insertion Failed");
                        done();
                    });
            });
            it("should return an empty {} for user(unknowuser) todo's", function (done) {
                request(app).get('/api/todos/unknowuser')
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(404);
                        expect(res.body).to.be.empty;
                        done();
                    });
            });
            it("should return null for empty todo for an id", function (done) {
                newlypostedTodo._id = "dfsdvsddsvd";
                request(app).get('/api/todo/' + newlypostedTodo._id.toString())
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(404);
                        expect(res.body._id).to.be.equal(undefined);
                        done();
                    });
            });
            it("should not delete any todo with wrong id => ddddd", function (done) {
                request(app).delete('/api/todo').send({_id: newlypostedTodo._id})
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(409);
                        expect(res.body._id).to.be.equal(undefined);
                        done();
                    });
            });
            it("should create a todo with user(test)", function (done) {
                var todo = {};
                request(app).post('/api/todo').send(todo)
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(400);
                        expect(res.body.result).to.be.equal("Insertion Failed");
                        newlypostedTodo = res.body;
                        done();
                    });
            });

        });

        describe('Test Demo data', function () {
            it("should generate todos for user(test)", function (done) {
                request(app).get('/api/setUpTodo')
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(200);
                        expect(res.body).to.be.an('array');
                        expect(res.body.length).to.be.equal(3);
                        done();
                    });
            });
            it("should delete all test todos", function (done) {
                request(app).delete('/api/delete/setUpTodo').send({_id: newlypostedTodo._id})
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(200);
                        expect(res.body.result).to.be.equal("Successfully removed");
                        done();
                    });
            });
        });
    });
};

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}


