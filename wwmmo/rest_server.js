//var mongohost = 'mongodb://laroccaa:17322@mcsdb.utm.utoronto.ca/laroccaa_309';

var mongohost = 'mongodb://ferna800:23968@mcsdb.utm.utoronto.ca/ferna800_309';

var MongoClient = require('mongodb').MongoClient;

var express = require('express');
var app = express();

/*app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});*/

app.use('/', express.static('static-content'));

app.listen(10423, function () {
  console.log('Example app listening on port 10423!');
});

/*
	MongoClient.connect(mongohost, function (err, db) {
		if (err) throw err
		//// INSERT DATABASE STUFF HERE ////
		db.close();
	})
*/

// REST api

// GET username / password for login
app.post('/users/:username/:password', function (req, res) {
	var username = req.params.username;
	var password = req.params.password;

	MongoClient.connect(mongohost, function (err, db) {
		if (err) throw err
		
		db.collection('users').findOne({"user.username" : username, "user.password" : password}, 			function(err2, doc){
			if (err2) throw err2;
			if (doc){res.status(200).send('OK');}
			else {res.status(400).send('Invalid Username or password');}
		});

		db.close();
	})
});

// GET username for register (no duplicates)
app.get('/users/:username', function (req, res) {
	var username = req.params.username;

	MongoClient.connect(mongohost, function (err, db) {
		if (err) throw err
		
		db.collection('users').findOne({"user.username" : username}, function(err2, doc){
			if (err2) throw err2;
			if (doc){res.status(200).send('OK');}
			else {res.status(404).send('User not found');}
		});

		db.close();
	})

});

// POST username / password for register
app.get('/users/:username/:password', function (req, res) {
	var username = req.params.username;
	var password = req.params.password;

	MongoClient.connect(mongohost, function (err, db) {
		if (err) throw err
		db.collection('users').findOne({"user.username" : username}, function(err2, doc){

			if (err2) throw err2;
			if (doc){res.status(400).send('User already exists');}
			else {
				insertUser(username, password);
				res.status(200).send('OK');
			}
		});

		db.close();
	})

});

// GET scores
// POST scores (update)

// Database functions
function insertUser(username, password) {
	MongoClient.connect(mongohost, function (err, db) {
		db.collection('users').insertOne( {
			user : {
				"username" 	: username,
				"password" 	: password

			}
		});
	});
}
