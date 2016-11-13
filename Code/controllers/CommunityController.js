var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var configDB = require('./../config/database.js');
var url = configDB.url;

module.exports = {

    insertCommunity : function (db, name, headOffice, category, founder, description, privacy, creationDate,members,callback){
        var community = db.collection('community');
        community.find({name:name, date: creationDate }).toArray(function (err,docs) {
            assert.equal(err,null);
            if(docs.length>=1){
                console.log('Already exists a community with the given name and creation date');
                db.close();
            }
            else{
                community.insertOne({name: name, office: headOffice, category: category, description: description, date: creationDate, founder: founder, privacy: privacy, members: members},
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