var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var configDB = require('./../config/dbURL.js');
var url = configDB.url;

module.exports = {
    getUser : function (db, username, callback) {
        var user = db.collection('user');
        user.findOne({username: username}, function (err, docs) {
            assert.equal(err, null);
            callback(err, docs);
        });
    },

    insertUser: function (db, name, username, mail, pass, gender, phone, birthdate, callback) {
        var user = db.collection('user');
        //Procura um utilizador na base de dados, dado o e-mail
        user.find({email: mail}).toArray(function (err, docs) {
            assert.equal(err, null);
            //Verifica se ja existe um user com o e-mail dado
            //Se existir, avisa o utilizador e fecha a base de dados
            if (docs.length >= 1) {
                console.log('Already exists a user with the given e-mail');
                db.close();
            }
            //Senao existir, adiciona-o a base de dados
            else {
                user.insertOne({
                        name: name,
                        username: username,
                        email: mail,
                        password: pass,
                        gender: gender,
                        phone: phone,
                        birthdate: birthdate
                    },
                    function (err, result) {
                        assert.equal(err, null);
                        assert.equal(1, result.result.n);
                        assert.equal(1, result.ops.length);
                        console.log('Inserted 1 document into the db');
                        callback(result);
                    });
            }
        });
    },

    logIn: function (db, email, pass, callback) {
        var user = db.collection('user');
        user.findOne({username: email, password: pass}, function (err, docs) {
            assert.equal(err, null);
            callback(err, docs);
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