var assert = require('assert');
var mongo = require('mongodb').MongoClient;
var messagingController = require("./../controllers/MessageController.js");
var userController = require("./../controllers/UserController.js");

describe('Messaging', function() {
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
		
	/*
		Insert a generic message, it should exist in the db
		Coverage: 
			MessageController.insertMessage() - Success
			MessageController.getMessagesByUser() - Success
			MessageController.getSentByUser() - Success
	*/
	it('Inserting and checking a message was inserted', function(done) {
		
		messagingController.insertMessage(db, "testuser", "testreceiver", "testsubject", "testcontent", new Date(), "offer", function(success){
			messagingController.getMessagesByUser(db, "testreceiver", function(receiver){
				messagingController.getSentByUser(db, "testuser", function(sender){
				
				assert.equal(receiver.length, 1);
				assert.equal(sender.length, 1);
				
				
				messagingController.insertMessage(db, "testuser", "testreceiver", "testsubject", "testcontent", new Date(), "offer", function(success){
				messagingController.insertMessage(db, "testuser", "testreceiver", "testsubject", "testcontent", new Date(), "offer", function(success){
				messagingController.insertMessage(db, "testreceiver", "testuser", "testsubject", "testcontent", new Date(), "offer", function(success){
				
					messagingController.getMessagesByUser(db, "testreceiver", function(verify1){
					messagingController.getSentByUser(db, "testuser", function(verify2){
					messagingController.getMessagesByUser(db, "testuser", function(verify3){
					messagingController.getSentByUser(db, "testreceiver", function(verify4){
						
						assert.equal(verify1.length, 3);
						assert.equal(verify2.length, 3);
						assert.equal(verify3.length, 1);
						assert.equal(verify4.length, 1);
						
						done();	
					});});});});	
				
				
				
				});});});
				
				
				});
			});		
		});
	});

	//===================

	it('TODO - This requires more tests', function(done) {
		done();
	});


	//===================
	
});