var assert = require('assert');

module.exports = {

    // Inserts a new user
    insertUser: function (db, name, username, email, pass, gender, phone, birthdate, callback) {
        // Get User collection
        var user = db.collection('user');

        // Search for the user's username in the db
        user.find({username: username}).toArray(function (err, docs) {
            assert.equal(err, null);

            // Verifies if there is another user with the same specs on the db
            if (docs.length >= 1) {
                console.log('This user already exists ' + username);
                db.close();
            } else {
                // Inserts the new user
                user.insertOne({
                        name: name,
                        username: username,
                        email: email,
                        password: pass,
                        gender: gender,
                        phone: phone,
                        birthdate: birthdate
                    },
                    function (err, result) {
                        assert.equal(err, null);
                        assert.equal(1, result.result.n);
                        assert.equal(1, result.ops.length);

                        console.log('Inserted a new user: ' + username);
                        db.close();
                    });
            }
        });
    },

    // Verifies if an user exists
    logIn: function (db, username, pass, callback) {
        // Get User collection
        var user = db.collection('user');

        // Find the user in the db
        user.findOne({username: username, password: pass}, function (err, user) {
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