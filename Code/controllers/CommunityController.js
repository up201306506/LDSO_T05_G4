var assert = require('assert');

module.exports = {

    // Get the enrolled communities by an user
    getUserEnrolledCommunities: function (db, username, callback) {
        // Get Community collection
        var community = db.collection('community');

        // Get a list of communities that this user is member of
        community.find({members: username}).toArray(function (err, communities) {
            assert.equal(err, null);

            // Process the list of communities
            callback(communities);
        });
    },

    // Insert a new community in the db
    insertCommunity: function (db, communityName, headOffice, category, founder, description, privacy, members, callback) {
        // Get Community collection
        var community = db.collection('community');

        // Search for the community's name in the db
        community.findOne({name: communityName}).toArray(function (err, docs) {
            assert.equal(err, null);

            // Verifies if there is another community with the same specs on the db
            if (docs.length >= 1) {
                console.log('This community already exists ' + communityName);
                db.close();
            } else {
                // Inserts the new community
                community.insertOne({
                        name: communityName, office: headOffice, category: category, description: description,
                        founder: founder, privacy: privacy, members: members
                    },
                    function (err, result) {
                        assert.equal(err, null);
                        assert.equal(1, result.result.n);
                        assert.equal(1, result.ops.length);

                        console.log('Inserted a new community: ' + communityName);
                        db.close();
                    });
            }
        });
    },

    // Verifies if an user is enrolled in a community
    isUserEnrolledInCommunity: function (db, username, communityName) {
        // Get Community collection
        var community = db.collection('community');

        // Verifies if the user is member of the specified community
        community.findOne({name: communityName, members: username}).toArray(function (err, community) {
            assert.equal(err, null);

            // Process the community
            callback(community);
        });
    }
}

var listAllCommunities = function (db, callback) {
    var community = db.collection('community');
    community.find().toArray(function (err, docs) {
        assert.equal(err, null);
        console.log('Found ' + docs.length + " documents");
        console.log(docs);
        callback(docs);
    });
}

var listPublicCommunities = function (db, callback) {
    var community = db.collection('community');
    community.find({privacy: 'public'}).toArray(function (err, docs) {
        assert.equal(err, null);
        console.log('Found ' + docs.length + " documents");
        console.log(docs);
        callback(docs);
    });
}

var listCommunityByCategory = function (db, category, callback) {
    var community = db.collection('community');
    community.find({category: category}).toArray(function (err, docs) {
        assert.equal(err, null);
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