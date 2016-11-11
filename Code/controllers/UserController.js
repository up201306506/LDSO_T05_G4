var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var configDB = require('./../config/database.js');
var url = configDB.url;

module.exports = {
    insertUser: function (db, name, username, mail, pass, gender, phone, birthdate, callback) {
        var users = db.collection('users');
        //Procura um utilizador na base de dados, dado o e-mail
        users.find({email: mail}).toArray(function (err, docs) {
            assert.equal(err, null);
            //Verifica se j� existe um user com o e-mail dado
            //Se existir, avisa o utilizador e fecha a base de dados
            if (docs.length >= 1) {
                console.log('Already exists a user with the given e-mail');
                db.close();
            }
            //Sen�o existir, adiciona-o � base de dados
            else {
                users.insertOne({
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
        var users = db.collection('users');
        users.findOne({username: email, password: pass}, function (err, docs) {
            assert.equal(err, null);
            callback(err, docs);
        });
    },

    updateEmail: function (db, oldEmail, newEmail, callback) {
        var users = db.collection('users');
        users.updateOne({email: oldEmail}, {$set: {email: newEmail}}
            , function (err, result) {
                assert.equal(err, null);
                console.log("E-mail updated.");
                callback(result);
            });
    },

    updatePassword: function (db, email, newpass, callback) {
        var users = db.collection('users');
        users.updateOne({email: email}, {$set: {password: newpass}}
            , function (err, result) {
                assert.equal(err, null);
                console.log("Password updated.");
                callback(result);
            });
    },

    updatePhone: function (db, email, newphone, callback) {
        var users = db.collection('users');
        users.updateOne({email: email}, {$set: {phone: newphone}}
            , function (err, result) {
                assert.equal(err, null);
                console.log("Phone updated.");
                callback(result);
            });
    },

    deleteUserByEmail: function (db, mail, callback) {
        var user = db.collection('users');
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
        var user = db.collection('users');
        user.find().toArray(function (err, docs) {
            assert.equal(err, null);
            console.log('Found ' + docs.length + " documents");
            console.log(docs);
            callback(docs);
        });
    }
};