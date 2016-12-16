var assert = require('assert');
var mongo = require('mongodb').MongoClient;
var userController = require("./../controllers/UserController.js");

describe('Users', function() {
	DBurl = 'mongodb://localhost:27017/test';
	
    // runs before all tests in this block	
	before('there must be a local test database and it must be reachable', function(done) {
		mongo.connect(DBurl, function (err, db) {
			if (err) done(err);
			db.close();
			done();
		});
	});

	//Empty the database before running every test
	beforeEach(function() {
		
	});
				
		
	it('Inserting and checking a message was inserted', function(done) {
		done();
	});		
	
});
