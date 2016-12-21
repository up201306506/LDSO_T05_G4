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

    // Edit all informatio about an user
    editUser: function (db, username, password, name, email, phone, gender, callback) {
        // Get Community collection
        var user = db.collection('user');

        // Finds if the email is already taken
        user.findOne({email: email}, function (err, userData) {
            assert.equal(err, null);

            // Verifies if email is not being used
            if(userData == null || userData.username == username){ // Email not being used or is the same user
                // Updates information about the user
                user.updateOne({username: username},
                    {
                        $set: {password: password, name: name, email: email, phone: phone, gender: gender}
                    },function (err) {
                        assert.equal(err, null);

                        callback(true);
                    });
            }else{
                callback(false);
            }
        });
    },













    updateEmail: function (db, oldEmail, newEmail, callback) {
        var user = db.collection('user');
        user.updateOne({email: oldEmail}, {$set: {email: newEmail}}
            , function (err, result) {
                assert.equal(err, null);
                console.log("E-mail updated.");
                callback(result);
            });
    },

    updatePassword: function (db, email, newpass, callback) {
        var user = db.collection('user');
        user.updateOne({email: email}, {$set: {password: newpass}}
            , function (err, result) {
                assert.equal(err, null);
                console.log("Password updated.");
                callback(result);
            });
    },

    updatePhone: function (db, email, newphone, callback) {
        var user = db.collection('user');
        user.updateOne({email: email}, {$set: {phone: newphone}}
            , function (err, result) {
                assert.equal(err, null);
                console.log("Phone updated.");
                callback(result);
            });
    },

    deleteUserByEmail: function (db, mail, callback) {
        var user = db.collection('user');
        user.deleteOne({email: mail}, function (err, results) {
            if (err) {
                console.log("failed");
                throw err;
            }
            assert.equal(1, results.result.n);
            console.log("success");
            callback(results);
        });
    },

    listAllUsers: function (db, callback) {
        var user = db.collection('user');
        user.find().toArray(function (err, docs) {
            assert.equal(err, null);
            console.log('Found ' + docs.length + " documents");
            console.log(docs);
            callback(docs);
        });
    }
};