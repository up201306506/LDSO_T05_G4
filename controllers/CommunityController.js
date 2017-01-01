var assert = require('assert'),
    dropdownList = require('./../config/dropdownLists');

module.exports = {
    // Insert a new community in the db
    insertCommunity: function (db, communityName, headOffice, description, useCoin, coinName, privacy, rules, founder, admins, members, callback) {
        // Get Community collection
        var community = db.collection('community');

        // Search for the community's name in the db
        community.findOne({name: communityName}, function (err, communityData) {
            assert.equal(err, null);

            // Verifies if there is another community with the same specs on the db
            if (communityData != null) {
                callback(false);
            } else {
                // Inserts the new community
                community.insertOne({
                        name: communityName, office: headOffice, description: description, useCoin: useCoin, coinName: coinName,
                        privacy: privacy, ruleDescription: rules, founder: founder, admins: admins, members: members, requests: []
                    },
                    function (err, result) {
                        assert.equal(err, null);
                        assert.equal(1, result.result.n);
                        assert.equal(1, result.ops.length);

                        callback(true);
                    });
            }
        });
    },

    // Retrieves all communities data
    getAllCommunities: function (db, communityName, showSecretCommunities, callback) {
        // Get Community collection
        var community = db.collection('community');
        // Create search querry
        var regexValue = '\.*'+ communityName +'\.*';

        // Show secret communities
        if (showSecretCommunities) {
            // Get a list of communities
            community.find({name: new RegExp(regexValue,'i')}).toArray(function (err, communities) {
                assert.equal(err, null);

                // Process the list of communities
                callback(communities);
            });
        } else {
            // Get a list of public and private communities that this user is member of
            community.find({name: new RegExp(regexValue,'i'), $or:[{privacy: dropdownList.privacyList[0]}, {privacy: dropdownList.privacyList[1]}]}).toArray(function (err, communities) {
                assert.equal(err, null);

                // Process the list of communities
                callback(communities);
            });
        }
    },

    // Get the enrolled communities by an user
    getUserEnrolledCommunities: function (db, username, showSecretCommunities, callback) {
        // Get Community collection
        var community = db.collection('community');

        // Shows secret communities
        if (showSecretCommunities) {
            // Get a list of communities that this user is member of
            community.find({members: {$elemMatch: {name: username}}}).toArray(function (err, communities) {
                assert.equal(err, null);

                // Process the list of communities
                callback(communities);
            });
        } else {
            // Get a list of public and private communities that this user is member of
            community.find({members: {$elemMatch: {name: username}},
                $or: [{privacy: dropdownList.privacyList[0]}, {privacy: dropdownList.privacyList[1]}]
            }).toArray(function (err, communities) {
                assert.equal(err, null);

                // Process the list of communities
                callback(communities);
            });
        }
    },

    // Get the administrated communities by an user
    getUserAdminCommunities: function (db, username, callback) {
        // Get Community collection
        var community = db.collection('community');

            // Get a list of communities that this user is admin of
            community.find({admins: username}).toArray(function (err, communities) {
                assert.equal(err, null);

                // Process the list of communities
                callback(communities);
            });
    },

    // Retrieves all information of a community
    getCommunityData: function (db, communityName, callback) {
        // Get Community collection
        var community = db.collection('community');

        // Search for the community in the tb
        community.findOne({name: communityName}, function (err, communityData) {
            assert.equal(err, null);

            // Process the community
            callback(communityData);
        });
    },

    // Insert a new user in the community
    insertUserInCommunity: function (db, communityName, userName, callback) {
        // Get Community collection
        var community = db.collection('community');

        // Inserts user
        community.updateOne({name: communityName}, {$push: {members: {name: userName, coins: 0}}}, function () {
            // Call callback
            callback();
        });
    },

    // User request to be inserted in the community
    insertUserRequestsInCommunity: function (db, communityName, userName, callback) {
        // Get Community collection
        var community = db.collection('community');

        // Inserts user's request
        community.updateOne({name: communityName}, {$push: {requests: userName}}, function () {
            // Call callback
            callback();
        });
    },

    // Remove user from community
    removeUserFromCommunity: function (db, communityName, userName, callback) {
        // Get Community collection
        var community = db.collection('community');

        // Removes user from members
        community.updateOne({name: communityName, founder: {$ne: userName}}, {$pull: {members: {name: userName}}}, function () {
            // Removes user from admins
            community.updateOne({name: communityName, founder: {$ne: userName}}, {$pull: {admins: userName}}, function () {
                // Call callback
                callback();
            });
        });
    },

    // Insert new admin to community
    insertAdminInCommunity: function (db, communityName, userName, callback) {
        // Get Community collection
        var community = db.collection('community');

        // Inserts user
        community.updateOne({name: communityName}, {$push: {admins: userName}}, function () {
            // Call callback
            callback();
        });
    },

    // Remove admin from community
    removeAdminFromCommunity: function (db, communityName, userName, callback) {
        // Get Community collection
        var community = db.collection('community');

        // Inserts user
        community.updateOne({name: communityName}, {$pull: {admins: userName}}, function () {
            // Call callback
            callback();
        });
    },

    // Remove user request
    removeFromRequests: function (db, communityName, username, callback){
        // Get Community collection
        var community = db.collection('community');

        // Remove user from request list
        community.updateOne({name: communityName}, {$pull: {requests: username}}, function () {
            // Call callback
            callback();
        });
    },
























































    // Verifies if an user is enrolled in a community
    isUserEnrolledInCommunity: function (db, username, communityName, callback) {
        // Get Community collection
        var community = db.collection('community');

        // Verifies if the user is member of the specified community
        community.findOne({name: communityName, members: username}, function (err, communityData) {
            assert.equal(err, null);

            //returns true if users found in community and false if not
            if(communityData) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },

    // Verify if user already requested to enter in the community
    verifyUserRequest: function (db, username, communityName, callback) {
        var community = db.collection('community');
        community.findOne({name: communityName,requests: username}, function (err, result1) {
                assert.equal(err, null);

                //return true if user found in requests field and false if not
                if(result1) {
                    callback(true);
                } else {
                    callback(false);
                }
            });
    },

    // Retrieves the privacy of a community
    getCommunityPrivacy: function (db, communityName, callback) {
        // Get Community collection
        var community = db.collection('community');

        // Search for the community in the tb
        community.findOne({name: communityName}, function (err, communityData) {
            assert.equal(err, null);

            // Return privacy
            callback(communityData.privacy);
        });
    },


    isAdmin: function (db, communityName, username, callback){
        var community = db.collection('community');

        // Search for the user in the admin field
        community.findOne({admins: username}, function (err, admin) {
            assert.equal(err, null);

            // return true if user is admin and false if not
            if(admin) {
                callback(true);
            } else {
                callback(false);
            }
        });
    },

    // Edit all information of a community
    editCommunityData: function (db, communityName, headOffice, description, privacy, rules, callback) {
        // Get Community collection
        var community = db.collection('community');

        // Update the community in the db
        community.updateOne({name: communityName},
            {
                $set: {office: headOffice, description: description, privacy: privacy, ruleDescription: rules}
            }, function (err) {
                assert.equal(err, null);

                // Process the edit
                callback(true);
            });
    },

    removeCommunity : function ( db, name, callback) {
        // Get Community collection
        var community = db.collection('community');
        community.deleteOne({name: name}, function (err) {
            assert.equal(err, null);
            callback();
        });
    },

    listPublicCommunities: function (db, callback) {
        var community = db.collection('community');
        community.find({privacy: 'public'}).toArray(function (err, docs) {
            assert.equal(err, null);
            console.log('Found ' + docs.length + " documents");
            console.log(docs);
            callback(docs);
        });
    },

    listCommunityByCategory: function (db, category, callback) {
        var community = db.collection('community');
        community.find({category: category}).toArray(function (err, docs) {
            assert.equal(err, null);
            console.log('Found ' + docs.length + " documents");
            console.log(docs);
            callback(docs);
        });
    },

    removeCommunity: function ( db, name, callback) {
        var community = db.collection('community');
        community.deleteOne({name: name}, function (err, results) {
            assert.equal(err, null);
            callback(results);
        });
    }
};