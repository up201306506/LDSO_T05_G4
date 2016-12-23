var assert = require('assert');
var mongo = require('mongodb').MongoClient;
var communityController = require("./../controllers/CommunityController.js");

describe('Community', function() {
	this.timeout(5000);
	DBurl = 'mongodb://localhost:27017/test';
	var db;
	

	//===================
	// HOOKS
	//===================
	
    // runs before all tests in this block	
	before('there must be a local test database and it must be reachable', function(done) {
		mongo.connect(DBurl, function (err, res) {
			if (err) done(err);
			db = res;
			done();
		});
	});
	//Empty the database before running every test
	beforeEach(function() {
		db.dropDatabase();
	});	
	//Runs after all tests in this block
	after(function() {
		db.close();
	});	
	
	
		
	//===================
	// TESTS
	//===================
	it('TODO - This requires more tests', function(done) {
		done();
	});

	//===================
	
});
