var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var configDB = require('./../config/dbURL.js');
var url = configDB.url;

module.exports = {

    insertCommunity : function (db, name, headOffice, category, founder, description, privacy, members, callback){
        var community = db.collection('community');
        community.find({name:name}).toArray(function (err,docs) {
            assert.equal(err,null);
            if(docs.length>=1){
                console.log('Already exists a community with the given name: ' + name);
                db.close();
            }else{
                community.insertOne({name: name, office: headOffice, category: category, description: description,
                       founder: founder, privacy: privacy, members: members},
                    function (err,result) {
                        assert.equal(err,null);
                        assert.equal(1, result.result.n);
                        assert.equal(1, result.ops.length);
                        console.log('Inserted 1 document into the db');
                        callback(result);
                    });
            }
        });
    },

    getUserEnrolledCommunities : function (db, email, callback) {
        var community = db.collection('community');
        community.find({members: email}).toArray(function (err,docs) {
            assert.equal(err,null);
            console.log('Found ' + docs.length + " documents");
            console.log(docs);
            callback(docs);
        });
    }
}

var listAllCommunities = function (db,callback) {
    var community = db.collection('community');
    community.find().toArray(function (err,docs) {
        assert.equal(err, null);
        console.log('Found ' + docs.length + " documents");
        console.log(docs);
        callback(docs);
    });
}

var listPublicCommunities = function (db, callback) {
    var community = db.collection('community');
    community.find({privacy: 'public'}).toArray(function (err,docs) {
        assert.equal(err,null);
        console.log('Found ' + docs.length + " documents");
        console.log(docs);
        callback(docs);
    });
}

var listCommunityByCategory = function (db, category, callback) {
    var community = db.collection('community');
    community.find({category: category}).toArray(function (err,docs) {
        assert.equal(err,null);
        console.log('Found ' + docs.length + " documents");
        console.log(docs);
        callback(docs);
    });
}

var insertUserInCommunity = function (db, name, member, callback) {
    var community = db.collection('community');
    community.updateOne({name: name}, {$push: {members: member}}, function (err, result) {
        assert.equal(err, null);
        console.log("New member inserted");
        callback(result);
    });
}

var removeUserFromCommunity = function (db, name, member, callback) {
    var community = db.collection('community');
    community.updateOne({name: name}, {$pull: {members: member}}, function (err, result) {
        assert.equal(err, null);
        console.log("Member removed from community");
        callback(result);
    });
}