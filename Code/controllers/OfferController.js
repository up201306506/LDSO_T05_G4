var assert = require('assert');

module.exports = {

    // Insert a new offer in the db
    insertOffer: function (db, username, communityName, title, description, price, type, imageDir, isExpired, date, callback) {
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
                    communityName: communityName,
                    title: title,
                    description: description,
                    price: price,
                    type: type,
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

    // Gets all offers from a community
    getCommunityOffers: function (db, communityName, callback) {
        // Get offer collection
        var offer = db.collection('offer');

        // Get a list of offers of community communityName
        offer.find({communityName: communityName}).toArray(function (err, offers) {
            assert.equal(err, null);

            callback(offers);
        });
    },

    // Gets all offers from a list of communities
    getCommunityListOffers: function (db, communityList, callback) {
        // Get offer collection
        var offer = db.collection('offer');






        // Get a list of offers of community communityName
        offer.find({userName: userName}).toArray(function (err, offers) {
            assert.equal(err, null);

            callback(offers);
        });
    },








    deleteOffer: function (db, id, callback) {
        var offer = db.collection('offer');
        offer.deleteOne({_id: id}, function (err, results) {
            if (err) {
                console.log("failed");
                throw err;
            }
            assert.equal(1, results.result.n);
            console.log("success");
            callback(results);
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

    updateOfferStatus: function (db, id, is_expired, callback) {
        var offer = db.collection('offer');
        offer.updateOne({_id: id}, {$set: {is_expired: is_expired}},
            function (err, result) {
                assert.equal(err, null);
                console.log("Status updated.");
                callback(result);
            });
    }

};