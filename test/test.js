var assert = require('assert');
var configDB = require('./../config/dbURL.js');
var mongo = require('mongodb').MongoClient;
var messagingController = require("./../controllers/MessageController.js");

//Guarantee that no one sent the wrong db link.
assert.equal('mongodb://LDSO:ldso123456@ds155747.mlab.com:55747/heroku_gdqp38z3', configDB.url);

//Assuming travis, mongod should be running locally
configDB.url = 'mongodb://localhost:27017/LocalExchangeDB';

mongo.connect(configDB.url, function (err, db) {
	
	//-------------
	//	TEST
	//-------------
	/*
		Insert a generic message, it should exist in the db
		Coverage: 
			MessageController.insertMessage() - Success
			MessageController.getMessagesByUser() - Success
			MessageController.getSentByUser() - Success
	*/
	describe('MessageController', function() {
		describe('Inserting and checking a message was inserted', function() {
			it('should work...', function() {
				messagingController.insertMessage(db, "testuser", "testreceiver", "testsubject", "testcontent", new Date(), "offer", function(success){});
				messagingController.getMessagesByUser(db, "testreceiver", function(userMessages){
					assert.equal(userMessages.length, 1);
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
	
	db.close();
});
	
	
/*
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});
*/
