# Nodejs, ExpressJs and MongoDB API development template with basic User api

## Usage
## For a quick Node js, ExpressJs and MongoDB project startup
>Start adding model, controllers, test and config js files, just connect and use your newly added js files

### Prerequisites

Node JS


## Installation & Setup
1. Install [Node.js](https://nodejs.org/) & [MongoDB](https://www.mongodb.org/) if you haven't already.
2. Clone this repository and install its dependencies.
		
		> git clone git@github.com:wecking/node-express-template-api.git
		> cd node-express-template-api
		> npm install
		
3. In a separate shell start MongoDB.

		> mongod

4. From within the node-express-template-api directory start the server.

		> node app.js
		
5. Open a browser window and navigate to: [localhost:3000/api-docs](localhost:3000/api-docs) For API Documentation

## Password Retrieval

To enable the password retrieval feature it is recommended that you create environment variables for your credentials instead of hard coding them into the [email dispatcher module](https://github.com/wecking/node-express-template-api/blob/master/modules/account-module/email-dispatcher.js).

To do this on OSX you can simply add them to your .profile or .bashrc file.

	export NL_EMAIL_HOST='smtp.gmail.com'
	export NL_EMAIL_USER='your.email@gmail.com'
	export NL_EMAIL_PASS='1234'

### A basic account management system built in Node.js with the following features:

* New User Account Creation
* Secure Password Reset via Email
* Ability to Update / Delete Account
* Session Tracking for Logged-In Users
* Local Cookie Storage for Returning Users
* Blowfish-based Scheme Password Encryption

## Start Server

```sh
node app.js
```

## Logs

>Access logs are generated for all request @ /logs/access-date.log
,
>Failed requests are generated @ /logs/bug-date.log

## Run Automated Test

```sh
npm test
```

> Test coverage html is generated on /coverage/index.html


## Included Basic Api Usage

> See API documentation after start server @ localhost:3000/api-docs
>API Docs updates are added to /swagger.json file

## Contributing

PRs accepted.

## License

MIT © Edeh Kingsley C