var assert = require('assert');
var mongo = require('mongodb').MongoClient;
var userController = require("./../controllers/UserController.js");

describe('Users', function() {
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
        db.dropDatabase();
		db.close();
	});	
	
	
		
	//===================
	// TESTS
	//===================


    /*
         Inserting users with colliding data should fail on server side
         Coverage:
         UserController.insertUser() - Success, Failure
     */
    it('Trying to insert Users with conflicting data should fail', function(done) {
        userController.insertUser(db, "TestUser1","password","Test1","email1",999999999,"male",function(success){
        assert.equal(success, null);

            //Same username
            userController.insertUser(db, "TestUser1","password","Test2","email2",999999999,"male",function(success){
            assert.notEqual(success, null);
            //Same email
            userController.insertUser(db, "TestUser3","password","Test3","email1",999999999,"male",function(success){
            assert.notEqual(success, null);

                //They should insert just fine with fixed data
                userController.insertUser(db, "TestUser2","password","Test2","email2",999999999,"male",function(success){
                assert.equal(success, null);
                userController.insertUser(db, "TestUser3","password","Test3","email3",999999999,"male",function(success){
                assert.equal(success, null);


                done();

                });});

            });});
        });


    });

    //===================

	/*
		 Insert users and then check if some exist and others don't
		 Coverage:
			UserController.insertUser() - Success, Failure
			UserController.getUser() - Success
	 */
	it('Using getUser() to check if inserted users exist or not', function(done) {
        userController.insertUser(db, "TestUser1","password","Test1","email",999999999,"male",function(success){
        assert.equal(success, null);

            //Test1 Must Exist
            userController.getUser(db,"TestUser1",function(success){
            assert.notEqual(success._id, null);
            assert.equal(success.name, "Test1");
            assert.equal(success.username, "TestUser1");
            assert.equal(success.email, "email");
            assert.equal(success.password, "password");
            assert.equal(success.gender, "male");
            assert.equal(success.phone, 999999999);

            //Test2 must not
            userController.getUser(db,"TestUser2",function(success){
            assert.equal(success, null);

                done();

            });});
        });


	});

    //===================

    it('TODO - This requires more tests', function(done) {
        done();
    });

    //===================
	
});
