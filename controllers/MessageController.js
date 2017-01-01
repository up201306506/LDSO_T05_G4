var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;
var userController = require("./UserController.js");

module.exports = {

    /*
        sender: username
        receiver: username
        subject: text
        content: inner_html?? text??
        date: date
        type: "offer", "conversation", "invitaton"
        read: bool
        starred: bool
        deleted: bool
     */

    //Create a new Message
    insertMessage : function (db, sender, receiver, subject, content, date, type, callback) {
        // Get messages collection
        var messages = db.collection('messages');

        //make sure the sender is an existing user
        userController.getUser(db, sender ,function (result) {
        if(result === null){
            callback(false);
            return;
        }
        userController.getUser(db, receiver ,function (result) {
        if(result === null){
            callback(false);
            return;
        }

            //add message to collection
            messages.insertOne({sender:sender, receiver:receiver, subject:subject, content:content, read:false, starred:false, date:date, type:type, deleted:false},
                function (err,result) {
                    callback(true);
                });


        });
        });


    },

    //Get specific message with id
    getMessageByID : function (db, id, callback ) {
        var messages = db.collection('messages');

        if(ObjectID.isValid(id)) {
            //console.log("A VALID MESSAGE ID");
            messages.findOne({_id: ObjectID(id)}, function (err, result) {
                assert.equal(err, null);
                callback(result);
            });
        } else {
            //console.log("AN INVALID MESSAGE ID");
            callback(null)
        }
    },

    //Get messages sent TO user
    getMessagesByUser : function(db, username, callback) {
        var messages = db.collection('messages');

        messages.find( { receiver:username, deleted:false} ).sort({ date:-1}).toArray(function(err,result){
            assert.equal(err, null);
            callback(result);
        });

    },

    //Get messages sent BY user
    getSentByUser : function(db, username, callback) {
        var messages = db.collection('messages');

        messages.find( { sender:username } ).sort({ date:-1}).toArray(function(err,result){
            assert.equal(err, null);
            callback(result);
        });

    },

    //Get messages to user with star
    getStarredUserMessages : function(db, username, callback){
        var messages = db.collection('messages');

        messages.find( { receiver:username, deleted:false, starred: true} ).sort({ date:-1}).toArray(function(err,result){
            assert.equal(err, null);
            callback(result);
        });
    },

    //Get messages of a specific type
    getMessagesByUserByType : function(db, username, messageType, callback){
        var messages = db.collection('messages');

        messages.find( { receiver:username, deleted:false, type:messageType} ).sort({ date:-1}).toArray(function(err,result){
            assert.equal(err, null);
            callback(result);
        });
    },

    //Get messages with the flag "deleted"
    getMessagesByUserDeleted : function(db, username, callback){
        var messages = db.collection('messages');

        messages.find( { receiver:username, deleted:true} ).sort({ date:-1}).toArray(function(err,result){
            assert.equal(err, null);
            callback(result);
        });
    },

    //Set message as read - Call this in the getMessageByID() callback
    setMessageAsRead : function(db, id, callback){
        var messages = db.collection('messages');

        if(ObjectID.isValid(id)) {
            messages.updateOne(
                {_id: ObjectID(id)},
                {$set: {read: true}},
                function (err)
                {
                    assert.equal(err, null);
                    callback(true);
                });
        } else {
            callback(false);
        }
    },

    //Set all messages to user as read
    setAllMessageAsRead : function(db, user, callback){
        var messages = db.collection('messages');

        messages.update({receiver:user}, {$set: {read:true}}, {multi:true}, function(err) {
            assert.equal(null, err);
            }
        );
        callback(false);
    },

    //Set message as deleted - It should have a TTL afterwards
    setMessageAsDeleted : function(db, id, callback){
        var messages = db.collection('messages');

        if(ObjectID.isValid(id)) {
            messages.updateOne(
                {_id: ObjectID(id)},
                {$set: {deleted: true}},
                function (err)
                {
                    assert.equal(err, null);
                    callback(true);
                });
        } else {
            callback(false);
        }
    },

    //Undelete message - It should have TTL removed
    setMessageAsUndeleted : function(db, id , callback){
        var messages = db.collection('messages');

        if(ObjectID.isValid(id)) {
            messages.updateOne(
                {_id: ObjectID(id)},
                {$set: {deleted: false}},
                function (err)
                {
                    assert.equal(err, null);
                    callback(true);
                });
        } else {
            callback(false);
        }
    },

    //Switch a message's star status
    toggleMessageStarred : function(db, id, status, callback){
        var messages = db.collection('messages');

        if(ObjectID.isValid(id)) {
            messages.updateOne(
                {_id: ObjectID(id)},
                {$set: {starred: status}},
                function (err)
                {
                    assert.equal(err, null);
                    callback(true);
                });
        } else {
            callback(false);
        }
    },

    //Remove Message
    removeMessage : function ( db, id, callback) {
        var messages = db.collection('messages');
        messages.deleteOne({_id: id}, function (err, result) {
            assert.equal(err, null);
            callback(result);
        });
    }
};