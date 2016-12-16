var assert = require('assert');
var configDB = require('./../config/dbURL.js');
var mongo = require('mongodb').MongoClient;
var messagingController = require("./../controllers/MessageController.js");

describe("DB URL variable", function() {
	it("seriously, don't commit local variables over the remote one", function() {
		//Guarantee that no one sent the wrong db link.
		assert.equal('mongodb://LDSO:ldso123456@ds155747.mlab.com:55747/heroku_gdqp38z3', configDB.url);
	});
});

describe('Database', function() {
	DBurl = 'mongodb://localhost:27017/test';
	
	
    // runs before all tests in this block	
	before('there must be a local test database and it must be reachable', function(done) {
		mongo.connect(DBurl, function (err, db) {
			if (err) done(err);
			db.close();
			done();
		});
	});

	
	
	it("It doesn't matter whay I put here", function() {			
	});
	
	
	
	/*
	describe('Messaging', function() {
		it('Inserting and checking a message was inserted', function(done) {
			
			done();
		});
	});
	*/
});


/*	
if(err){
	console.log("welp");
} else {
	console.log("YYYYY");
}


//-------------
//	TEST
//-------------
/*
	Insert a generic message, it should exist in the db
	Coverage: 
		MessageController.insertMessage() - Success
		MessageController.getMessagesByUser() - Success
		MessageController.getSentByUser() - Success
*//*
describe('MessageController', function() {		
	describe('Inserting and checking a message was inserted', function() {
		it('should work', function() {
			messagingController.insertMessage(db, "testuser", "testreceiver", "testsubject", "testcontent", new Date(), "offer", function(success){});
			messagingController.getMessagesByUser(db, "testreceiver", function(userMessages){
				assert.equal(userMessages.length, 2);
			});
			messagingController.getSentByUser(db, "testuser", function(userMessages){
				assert.equal(userMessages.length, 1);
			});
			messagingController.insertMessage(db, "testuser", "testreceiver", "testsubject", "testcontent", new Date(), "offer", function(success){});
			messagingController.insertMessage(db, "testuser", "testreceiver", "testsubject", "testcontent", new Date(), "offer", function(success){});
			messagingController.insertMessage(db, "testreceiver", "testuser", "testsubject", "testcontent", new Date(), "offer", function(success){});
			messagingController.getMessagesByUser(db, "testreceiver", function(userMessages){
				assert.equal(userMessages.length, 3);
			});
			messagingController.getSentByUser(db, "testuser", function(userMessages){
				assert.equal(userMessages.length, 3);
			});
			messagingController.getMessagesByUser(db, "testuser", function(userMessages){
				assert.equal(userMessages.length, 1);
			});
			messagingController.getSentByUser(db, "testreceiver", function(userMessages){
				assert.equal(userMessages.length, 1);
			});

		});
	});
	
	
});

*/