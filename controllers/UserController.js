var assert = require('assert');

module.exports = {
    // Inserts a new user
    insertUser: function (db, username, password, name, email, phone, gender, callback) {
        // Get User collection
        var user = db.collection('user');

        // Search for the user's username in the db
        user.findOne({username: username}, function (err, userData1) {
            assert.equal(err, null);

            // If the db already has an user with the same username throws an error
            if(userData1 != null){
                callback("Username já em uso");
            }else{
                user.findOne({email: email}, function (err, userData2) {
                    assert.equal(err, null);

                    // If the db already has an user with the same email throws an error
                    if(userData2 != null){
                        callback("Email já me uso");
                    }else{
                        // Inserts the new user
                        user.insertOne({
                                name: name,
                                username: username,
                                email: email,
                                password: password,
                                gender: gender,
                                phone: phone
                            },
                            function (err, result) {
                                assert.equal(err, null);
                                assert.equal(1, result.result.n);
                                assert.equal(1, result.ops.length);

                                callback(null);
                            });
                    }
                });
            }
        });
    },

    // Verifies if an user exists
    logIn: function (db, username, password, callback) {
        // Get User collection
        var user = db.collection('user');

        // Find the user in the db
        user.findOne({username: username, password: password}, function (err, user) {
            assert.equal(err, null);

            // Process the search
            callback(err, user);
        });
    },

    // Get user data
    getUser: function (db, username, callback) {
        // Get User collection
        var user = db.collection('user');

        // Find the user in the db
        user.findOne({username: username}, function (err, user) {
            assert.equal(err, null);

            // Process the search
            callback(user);
        });
    },

    // Get all users with username like param
    getAllUsers: function (db,username,callback) {
        // Get User collection
        var user = db.collection('user');
        var regexValue = '\.*'+username+'\.*';
        // Find the users in the db
        user.find({username: new RegExp(regexValue,'i')}).toArray(function (err, users) {
            assert.equal(err, null);
            // Process the search
            callback(users);
        });
    },

    // Edit all information about an user
    editUser: function (db, username, password, name, email, phone, gender, callback) {
        // Get Community collection
        var user = db.collection('user');

        // Find the user in the db
        user.findOne({username: username}, function (err, result) {
            assert.equal(err, null);

            if (result != null) {
                // Finds if the email is already taken
                user.findOne({email: email}, function (err, userData) {
                    assert.equal(err, null);

                    // Verifies if email is not being used
                    if (userData == null || userData.username == username) {
                        // Updates information about the user
                        user.updateOne({username: username},
                            {
                                $set: {password: password, name: name, email: email, phone: phone, gender: gender}
                            }, function (err) {
                                assert.equal(err, null);

                                callback(true);
                            });
                    } else {
                        callback(false);
                    }
                });
            } else {
                callback(false);
            }
        });
    }
};