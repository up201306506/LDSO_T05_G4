var MongoClient = require('mongodb').MongoClient, assert = require('assert');

var url = 'mongodb://localhost:27017/Tutorial';

var insertOffer = function (db, id, type, user, description, is_expired, date, price, title, callback) {
    var offer = db.collection('offer');
    offer.find({_id:id}).toArray(function (err,docs) {
        assert.equal(err,null);
        if(docs.length>=1){
            console.log('Already exists a offer with the giver id');
            db.close();
        }
        else{
            offer.insertOne({_id:id, type:type, user:user, title: title, description:description, is_expired:is_expired, date:date, price:price},
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

var deleteOffer = function (db, id, callback) {
    var offer = db.collection('offer');
    offer.deleteOne({_id: id}, function(err, results) {
        if (err){
            console.log("failed");
            throw err;
        }
        assert.equal(1, results.result.n);
        console.log("success");
        callback(results);
    });
}

var listOffersByUser = function (db, user, callback) {
    var offer = db.collection('offer');
    offer.find({user: user}).toArray(function (err,docs) {
        assert.equal(err,null);
        console.log('Found the following record ' + docs.length);
        console.log(docs);
        callback(docs);
    });
}

var updateOfferDescription = function (db, oldDescription, newDescription, callback) {
    var offer = db.collection('offer');
    offer.updateOne({description: oldDescription},{$set:{description: newDescription}},
    function (err,result) {
        assert.equal(err,null);
        console.log("Description updated.");
        callback(result);
    });
}

var updateOfferStatus = function (db, id, is_expired, callback) {
    var offer = db.collection('offer');
    offer.updateOne({_id: id}, {$set:{is_expired: is_expired}},
    function (err,result) {
        assert.equal(err, null);
        console.log("Status updated.");
        callback(result);
    });
}