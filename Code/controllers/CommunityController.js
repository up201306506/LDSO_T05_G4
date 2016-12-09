var assert = require('assert'),
    dropdownList = require('./../config/dropdownLists');

module.exports = {

    // Get the enrolled communities by an user
    getUserEnrolledCommunities: function (db, username, doNotShowSecretCommunities, callback) {
        // Get Community collection
        var community = db.collection('community');

        if (doNotShowSecretCommunities) {
            // Get a list of communities that this user is member of
            community.find({members: username}).toArray(function (err, communities) {
                assert.equal(err, null);

                // Process the list of communities
                callback(communities);
            });
        } else {
            // Get a list of communities that this user is member of
            community.find({members: username,
                $or: [{privacy: dropdownList.privacyList[0]}, {privacy: dropdownList.privacyList[1]}]
            }).toArray(function (err, communities) {
                assert.equal(err, null);

                // Process the list of communities
                callback(communities);
            });
        }
    },

    // Insert a new community in the db
    insertCommunity: function (db, communityName, headOffice, category, founder, description, privacy, members, admins, callback) {
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
                        name: communityName, office: headOffice, category: category, description: description,
                        founder: founder, privacy: privacy, members: members, requests: [], admins: founder
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

    //gets all users from db field request
    /*getRequests: function (db, communityName, callback) {
        // Get Community requests list
        var community = db.collection('community');
        // Verifies if there is another community with the same specs on the db
                //finds all users in requests
                community.find({name: communityName}).toArray(function (err, requests) {
                    assert.equal(err, null);
                    //return array with users in requests
                    callback(requests);
                });


    },*/
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

    // If an user is not in private community require permission
    insertRequests: function (db, communityName, username, callback) {
        // Get Community collection
        var community = db.collection('community');

        // Inserts the new user in requests
        community.updateOne({name: communityName}, {$push: {requests: username}}, function (err, result) {
        assert.equal(err, null);
        console.log("New request inserted");
            callback(result);
        });

    },

    removeFromRequests: function (db, communityName, username, callback){
        var community = db.collection('community');

        // remove the user from the requests field
        community.removeOne({requests: username}, function (err, result) {
            assert.equal(err, null);
            callback(result);
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

    // Edit all information of a community
    editCommunityData: function (db, communityName, headOffice, category, description, privacy, callback) {
        // Get Community collection
        var community = db.collection('community');

        // Update the community in the db
        community.updateOne({name: communityName},
            {
                $set: {office: headOffice, category: category, description: description, privacy: privacy}
            }, function (err) {
                assert.equal(err, null);

                // Process the edit
                callback();
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

    getPublicAndPrivateCommunity : function (db, name, callback) {
        // Get Community collection
        var community = db.collection('community');
        var regexValue = '\.*'+name+'\.';
        // Search for the community in the db
        community.find({name: new RegExp(regexValue,'i'), $or:[{privacy: "Pública"},{privacy: "Privada"}]}).toArray(function (err, communities) {
            assert.equal(err, null);

            // Process the list of communitiesz
            callback(communities);
        });
    },

    listAllCommunities: function (db, callback) {
        var community = db.collection('community');
        community.find().toArray(function (err, docs) {
            assert.equal(err, null);
            console.log('Found ' + docs.length + " documents");
            console.log(docs);
            callback(docs);
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

    insertUserInCommunity: function (db, name, member, callback) {
        var community = db.collection('community');
        community.updateOne({name: name}, {$push: {members: member}}, function (err, result) {
            assert.equal(err, null);
            console.log("New member inserted");
            callback(result);
        });
    },

    removeUserFromCommunity: function (db, name, member, callback) {
        var community = db.collection('community');
        community.updateOne({name: name}, {$pull: {members: member}}, function (err, result) {
            assert.equal(err, null);
            console.log("Member removed from community");
            callback(result);
        });
    },

    removeCommunity: function ( db, name, callback) {
        var community = db.collection('community');
        community.deleteOne({name: name}, function (err, results) {
            assert.equal(err, null);
            callback(results);
        });
    }

}

