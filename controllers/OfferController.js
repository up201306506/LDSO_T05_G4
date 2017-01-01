var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

module.exports = {
    // Insert a new offer in the db
    insertOffer: function (db, username, communityName, title, description, price, imageDir, isExpired, date, callback) {
        // Get Offer collection
        var offer = db.collection('offer');

        // Search for offers dups in the db
        offer.findOne({
            username: username,
            communityName: communityName,
            title: title
        }, function (err, offerData) {
            assert.equal(err, null);

            // Verifies if there is another offer's dup
            if (offerData != null) {
                callback(false);
            } else {
                // Inserts the new offer
                offer.insertOne({
                    username: username,
                    receiver: null,
                    communityName: communityName,
                    title: title,
                    description: description,
                    price: price,
                    imageDir: imageDir,
                    isExpired: isExpired,
                    date: date
                }, function (err, result) {
                    assert.equal(err, null);
                    assert.equal(1, result.result.n);
                    assert.equal(1, result.ops.length);

                    callback(true);
                });
            }
        });
    },

    // Remove offer from db
    removeOffer: function (db, id, callback) {
        // Get Offer collection
        var offer = db.collection('offer');

        // Delete offer from db
        offer.deleteOne({_id: ObjectId(id)}, function (err) {
            assert.equal(err, null);

            callback();
        });
    },

    // Retrieves all information of an offer
    getOfferData: function (db, id, callback) {
        // Get Offer collection
        var offer = db.collection('offer');

        // Search for the community in the tb
        offer.findOne({_id: ObjectId(id)}, function (err, offerData) {
            assert.equal(err, null);

            // Process the community
            callback(offerData);
        });
    },

    // Edit all information about an offer
    editOffer: function (db, offerId, lastTitle, username, communityName, title, description, price, imageDir, callback) {
        // Get Offer collection
        var offer = db.collection('offer');

        // Search for offers dups in the db
        offer.findOne({
            title: title
        }, function (err, offerData) {
            assert.equal(err, null);

            // Verifies if there is another offer's dup
            if (offerData != null && offerData._id != offerId) {
                callback(false);
            } else {
                // Updates information about an offer
                offer.updateOne({
                        username: username,
                        communityName: communityName,
                        title: lastTitle
                    },
                    {
                        $set: {
                            title: title,
                            description: description,
                            price: price,
                            imageDir: imageDir
                        }
                    },function (err) {
                        assert.equal(err, null);

                        callback(true);
                    });
            }
        });
    },



































    // Gets all offers from a community
    getCommunityOffers: function (db, communityName, range, callback) {
        // Get offer collection
        var offer = db.collection('offer');

        offer.count(function (e, totalOffersCount) {
            // Get a list of offers of community communityName
            offer.find({communityName: communityName}).skip(range.from).limit(range.size).toArray(function (err, offers) {
                assert.equal(err, null);
                callback(offers, totalOffersCount);
            });
        });
    },

    // Gets all active offers from a community
    getActiveOffers: function(db, communityName, range, callback){
        //Get offer collection
        var offer = db.collection('offer');

        offer.count(function (e, totalOffersCount) {
            // Get a list of offers of community communityName
            offer.find({communityName: communityName, isExpired: false}).skip(range.from).limit(range.size).toArray(function (err, offers) {
                assert.equal(err, null);
                callback(offers, totalOffersCount);
            });
        });
    },

    // Gets history of user offers
    getOfferHistory: function(db, username, callback) {
        var offer = db.collection('offer');
        offer.find({$or: [{username: username}, {receiver: username}]}).toArray(function (err, offers) {
            assert.equal(err, null);
            callback(offers);
        });
    },

    // Gets all offers from a list of communities
    getCommunityListOffers: function (db, communityList, range, callback) {

        var communityListName = [];
        communityList.forEach(function (community) {
            communityListName.push(community.name);
        });

        var offer = db.collection('offer');
        offer.count(function (e, totalOffersCount) {
            offer.find({communityName: {$in: communityListName}, isExpired: false }).skip(range.from).limit(range.size).toArray(function (err, offers) {
                assert.equal(err, null);
                callback(offers, totalOffersCount);
            });
        });
    },

    listOffersByUser: function (db, user, callback) {
        var offer = db.collection('offer');
        offer.find({user: user}).toArray(function (err, docs) {
            assert.equal(err, null);
            console.log('Found the following record ' + docs.length);
            console.log(docs);
            callback(docs);
        });
    },

    updateOfferDescription: function (db, oldDescription, newDescription, callback) {
        var offer = db.collection('offer');
        offer.updateOne({description: oldDescription}, {$set: {description: newDescription}},
            function (err, result) {
                assert.equal(err, null);
                console.log("Description updated.");
                callback(result);
            });
    },

    updateOfferStatus: function (db, id, receiver, is_expired, callback) {
        var offer = db.collection('offer');
        offer.updateOne({_id: ObjectId(id)}, {$set: {isExpired: is_expired, receiver: receiver}},
            function (err, result) {
                assert.equal(err, null);
                console.log("Status updated.");
                callback(result);
            });
    }
};