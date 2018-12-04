
var CT = require('../modules/account-module/country-list');
var AM = require('../modules/account-module/account-manager');
var EM = require('../modules/account-module/email-dispatcher');
var config = require('../config');

module.exports = function(app) {

/*
	login & logout
*/

	app.get('/api/user', function(req, res){
	// check if the user has an auto login key saved in a cookie //
		if (req.cookies.login == undefined){
            res.status(400).send({ title: 'Hello - Please Login To Your Account' });
            config.logBug(req, { title: 'Hello - Please Login To Your Account' });
		}	else{
	// attempt automatic login //
            var ip = getIP();
			AM.validateLoginKey(req.cookies.login, ip, function(e, o){
				if (o){
					AM.autoLogin(o.user, o.pass, function(o){
						req.session.user = o;
						res.redirect('/api/user/home');
					});
				}	else{
                    config.logBug(req, { title: 'Hello - Please Login To Your Account' });
                    res.status(400).send({ title: 'Hello - Please Login To Your Account' });
				}
			});
		}
	});
	
	app.post('/api/user', function(req, res){
		AM.manualLogin(req.body['user'], req.body['pass'], function(e, o){
			if (!o){
				res.status(400).send(e);
                config.logBug(req, e);
            }	else{
				req.session.user = o;
				if (req.body['remember-me'] == 'false'){
					res.status(200).send(o);
                    config.logBug(req, o);
                }	else{
					AM.generateLoginKey(o.user, req.ip, function(key){
						res.cookie('login', key, { maxAge: 900000 });
						res.status(200).send(o);
					});
				}
			}
		});
	});

	app.post('/api/user/logout', function(req, res){
		res.clearCookie('login');
		req.session.destroy(function(e){ res.status(200).send('ok'); });
	})
	
/*
	control panel
*/
	
	app.get('/api/user/home', function(req, res) {
        if (req.session.user == null){
			res.redirect('/api/user/');
		}	else{
			//perform get home action here
            res.status(200).send({title : "User already logged in"});
		}
	});
	
	app.post('/api/user/update', function(req, res){
		if (req.session.user == null){
			res.redirect('/api/user/');
		}	else{
			AM.updateAccount({
				id		: req.session.user._id,
				name	: req.body['name'],
				email	: req.body['email'],
				pass	: req.body['pass'],
				country	: req.body['country']
			}, function(e, o){
				if (e){
					res.status(400).send('error-updating-account');
                    config.logBug(req, 'error-updating-account');
                }	else{
					req.session.user = o.value;
					res.status(200).send('ok');
				}
			});
		}
	});

/*
	new accounts
*/
	
	app.post('/api/user/signup', function(req, res){
		AM.addNewAccount({
			name 	: req.body['name'],
			email 	: req.body['email'],
			user 	: req.body['user'],
			pass	: req.body['pass'],
			country : req.body['country']
		}, function(e){
			if (e){
				res.status(400).send(e);
                config.logBug(req, e);
            }	else{
				res.status(200).send('ok');
			}
		});
	});

/*
	password reset
*/

	app.post('/api/user/lost-password', function(req, res){
		let email = req.body['email'];
        var ip = getIP();

		AM.generatePasswordKey(email, ip, function(e, account){
			if (e){
				res.status(400).send(e);
                config.logBug(req, e);
            }	else{
				EM.dispatchResetPasswordLink(account, function(e, m){
			// TODO this callback takes a moment to return, add a loader to give user feedback //
					if (!e){
						res.status(200).send('ok');
					}	else{
						for (k in e) console.log('ERROR : ', k, e[k]);
                        config.logBug(req, 'unable to dispatch password reset');
                        res.status(400).send('unable to dispatch password reset');
					}
				});
			}
		});
	});

	app.get('/api/user/reset-password/:key', function(req, res) {
		AM.validatePasswordKey(req.query['key'], req.ip, function(e, o){
			if (e || o == null){
				res.redirect('/api/user/');
			} else{
				req.session.passKey = req.query['key'];
				//return password reset data here
				res.status(200).send({"title": " New Password form to fill here"})
			}
		})
	});
	
	app.post('/api/user/reset-password', function(req, res) {
		let newPass = req.body['pass'];
		// let passKey = req.session.passKey;
        let passKey = req.query['key'];
	// destory the session immediately after retrieving the stored passkey //
		req.session.destroy();
		AM.updatePassword(passKey, newPass, function(e, o){
			if (o){
				res.status(200).send('ok');
			}	else{
                config.logBug(req, 'unable to update password');
                res.status(400).send('unable to update password');
			}
		})
	});
	
/*
	view, delete & reset accounts
*/
	
	app.get('/api/user/print', function(req, res) {
		AM.getAllRecords( function(e, accounts){
			//Get all records
			console.log(accounts)
            res.status(200).send(accounts);
		})
	});
	
	app.post('/api/user/delete', function(req, res){
		AM.deleteAccount(req.session.user._id, function(e, obj){
			if (!e){
				res.clearCookie('login');
				req.session.destroy(function(e){ res.status(200).send('ok'); });
			}	else{
                config.logBug(req, 'record not found');
                res.status(400).send('record not found');
			}
		});
	});
	
	app.get('/api/user/reset', function(req, res) {
		AM.deleteAllAccounts(function(){
			res.redirect('/api/user/print');
		});
	});
	
	app.get('*', function(req, res) { res.status(404).send('Page Not Found'); });

	function getIP() {
        'use strict';

        var os = require('os');
        // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
        var result;

        var ifaces = os.networkInterfaces();
        Object.keys(ifaces).forEach(function (ifname) {

            var alias = 0;
            ifaces[ifname].forEach(function (iface) {
                if ('IPv4' !== iface.family || iface.internal !== false) {
                    // this single interface has multiple ipv4 addresses
                    return;

                }
                if (alias >= 1) {
                    result = iface.address;
                } else {
                    // this interface has only one ipv4 adress
                    result = iface.address;
                }
                ++alias;
            });
        });
        return result;
    }

};
