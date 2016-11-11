var MongoClient = require('mongodb').MongoClient, assert = require('assert');

var url = 'mongodb://localhost:27017/Tutorial';

var insertUser = function(db, name, mail, pass, gender, phone, birthdate, callback){
    var users = db.collection('users');
    //Procura um utilizador na base de dados, dado o e-mail
    users.find({email:mail}).toArray(function (err,docs) {
        assert.equal(err,null);
        //Verifica se já existe um user com o e-mail dado
        //Se existir, avisa o utilizador e fecha a base de dados
        if(docs.length>=1){
            console.log('Already exists a user with the given e-mail');
            db.close();
        }
        //Senão existir, adiciona-o à base de dados
        else{
            users.insertOne({name: name, email: mail, password: pass, gender: gender, phone: phone, birthdate: birthdate},
            function (err,result) {
                assert.equal(err,null);
                assert.equal(1, result.result.n);
                assert.equal(1, result.ops.length);
                console.log('Inserted 1 document into the db');
                callback(result);
            });
        }
    });
}

var logIn = function (db, email, pass, callback) {
    var users = db.collection('users');
    users.find({email: email, password: pass}).toArray(function (err,docs) {
        assert.equal(err,null);
        console.log('Found the following record ' + docs.length);
        console.log(docs);
        callback(docs);
    });
}

var updateEmail = function (db, oldEmail, newEmail, callback) {
    var users = db.collection('users');
    users.updateOne({email: oldEmail},{$set:{email: newEmail}}
        ,function (err,result) {
        assert.equal(err,null);
        console.log("E-mail updated.");
        callback(result);
    });
}

var updatePassword = function (db, email, newpass, callback) {
    var users = db.collection('users');
    users.updateOne({email: email},{$set:{password: newpass}}
        ,function (err,result) {
            assert.equal(err,null);
            console.log("Password updated.");
            callback(result);
        });
}

var updatePhone = function (db, email, newphone, callback) {
    var users = db.collection('users');
    users.updateOne({email: email},{$set:{phone: newphone}}
        ,function (err,result) {
            assert.equal(err,null);
            console.log("Phone updated.");
            callback(result);
        });
}

var deleteUserByEmail = function (db, mail, callback) {
    var user = db.collection('users');
    user.deleteOne({email: mail},function (err,results) {
        if (err){
            console.log("failed");
            throw err;
        }
        assert.equal(1, results.result.n);
        console.log("success");
        callback(results);
    });
}

var listAllUsers = function (db, callback) {
    var user = db.collection('users');
    user.find().toArray(function (err,docs) {
        assert.equal(err, null);
        console.log('Found ' + docs.length + " documents");
        console.log(docs);
        callback(docs);
    });
}