'use strict';

var app = require('../app'),
    chai = require('chai'),
    request = require('supertest')
    var AM = require('../modules/account-module/account-manager');

var session = require('supertest-session');

var testSession = session(app);



var expect = chai.expect;

var userTest;

var newUser = {
    user : 'comtge76',
    email: 'comejl,76',
    pass: '123234kl5j',
    country: 'Nigeria',
    name: 'kingslj,ly'
};

var newUser1 = {
    user : 'comhje76',
    email: 'comkle76',
    pass: '12323fg45j',
    country: 'Nigeria',
    name: 'kingsmnly'
};

var authenticatedSession;
var newlypostedTodo;

module.exports = function () {
    describe('Test User api endpoints', function () {
        this.timeout(10000);
        describe('endpoints should perform below actions', function () {
            //insert delete for these user
            it("Should create a new user", function (done) {
                request(app).post('/api/user/signup').send(newUser)
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(200);
                        userTest = res.body;
                        done();
                    });
            });

            it("should Login using the new user details", function (done) {
                testSession.post('/api/user').send(newUser)
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(200);
                        expect(res.headers['set-cookie']).to.be.an('array');
                        userTest = res.body;
                        authenticatedSession = testSession;
                        done();
                    });
            });

            it("should take a logged in user to homepage", function (done) {
                authenticatedSession.get('/api/user/home')
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(200);
                        expect(res.body.title).to.be.equal("User already logged in");
                        authenticatedSession = testSession;
                        done();
                    });
            });

            it("should take a logged in user to homepage", function (done) {
                authenticatedSession.get('/api/user/')
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(302);
                        authenticatedSession = testSession;
                        done();
                    });
            });


            it("should take a non logged in user to login page", function (done) {
                request(app).get('/api/user/')
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(400);
                        expect(res.body.title).to.be.equal('Hello - Please Login To Your Account')
                        done();
                    });
            });
            it("should logged out a user", function (done) {
                authenticatedSession.post('/api/user/logout')
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(200);
                        done();
                    });
            });
            it("should take a user with expired session to login page", function (done) {
                request(app).get('/api/user/')
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(400);
                        expect(res.body.title).to.be.equal('Hello - Please Login To Your Account')
                        done();
                    });
            });

            it("should take a user with expired session to login page", function (done) {
                authenticatedSession.get('/api/user/')
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(400);
                        expect(res.body.title).to.be.equal('Hello - Please Login To Your Account')
                        done();
                    });
            });
            it("should not Login using wrong password", function (done) {
                newUser.pass = makeid();
                testSession.post('/api/user').send(newUser)
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(400);
                        newlypostedTodo = res.body;
                        done();
                    });
            });
            it("should take a user without session to login page", function (done) {
                request(app).get('/api/user/home')
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(302);
                        done();
                    });
            });
            //insert delete for these user
            it("Should create a new user", function (done) {
                request(app).post('/api/user/signup').send(newUser1)
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(200);
                        userTest = res.body;
                        done();
                    });
            });
            it("should Login using the new user details", function (done) {
                testSession.post('/api/user').send(newUser1)
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(200);
                        expect(res.headers['set-cookie']).to.be.an('array');
                        userTest = res.body;
                        authenticatedSession = testSession;
                        done();
                    });
            });

            it("should Update a user profile details", function (done) {
                newUser1.name = 'king';
                authenticatedSession.post('/api/user/update').send(newUser1)
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(200);
                        authenticatedSession = testSession;
                        done();
                    });
            });

            it("should Login using the new user details", function (done) {
                newUser1['remember-me'] = 'false';
                request(app).post('/api/user').send(newUser1)
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(200);
                        userTest = res.body;
                        done();
                    });
            });
            it("should Update a user profile details", function (done) {
                request(app).post('/api/user/update').send(newUser1)
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(302);
                        authenticatedSession = testSession;
                        done();
                    });
            });
            //Test Reset, forget and recover password here

            it("should not submit a reset password request", function (done) {
                request(app).post('/api/user/lost-password').send(newUser)
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(400);
                        authenticatedSession = testSession;
                        done();
                    });
            });

            it("should submit a reset password request", function (done) {
                newUser1.email = "testidfasa"
                request(app).post('/api/user/lost-password').send(newUser1)
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(400);
                        authenticatedSession = testSession;
                        done();
                    });
            });

            //insert delete for these user
            it("Should create a new user", function (done) {
                newUser1.email = makeid();
                newUser1.user = makeid();
                request(app).post('/api/user/signup').send(newUser1)
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(200);
                        userTest = res.body;
                        done();
                    });
            });
            it("should send mail and submit a reset password request", function (done) {
                newUser1.email = "testingnewuser4@gmail.com"
                request(app).post('/api/user/lost-password').send(newUser1)
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(200);
                        authenticatedSession = testSession;
                        done();
                    });
            });

             it("should redirect a fake reset password request to login page", function (done) {
                newUser1.pass = "sdsczc";
                request(app).get('/api/user/reset-password/' + "dfsfsfew")
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(302);
                        authenticatedSession = testSession;
                        done();
                    });
            });

            it("should return 404 for invalid user", function (done) {
                request(app).get('/api/user/xdsffwf')
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(404);
                        done();
                    });
            });

            it("Should create a new user", function (done) {
                newUser1.email = makeid();
                newUser1.user = makeid();
                request(app).post('/api/user/signup').send(newUser1)
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(200);
                        userTest = res.body;
                        done();
                    });
            });

            it("should Login using the new user details", function (done) {
                testSession.post('/api/user').send(newUser1)
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(200);
                        userTest = res.body;
                        authenticatedSession = testSession;
                        done();
                    });
            });

            it("should delete the user", function (done) {
                authenticatedSession.post('/api/user/delete').send(newUser1)
                    .end(function (err, res) {
                        expect(res.statusCode).to.equal(200);
                        authenticatedSession = testSession;
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


