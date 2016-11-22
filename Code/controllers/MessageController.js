var assert = require('assert');
var configDB = require('./../config/dbURL.js');

module.exports = {

    //Create a new Message
    insertMessage : function (db, sender, receiver, content, date, type, callback) {
        // Get messages collection
        var messages = db.collection('messages');

        //add message to collection
        messages.insertOne({sender:sender, receiver:receiver, read:false, starred:false, content:content, date:date, type:type, deleted:false},
            function (err,result) {
                assert.equal(err,null);
                assert.equal(1, result.result.n);
                assert.equal(1, result.ops.length);
                console.log('Inserted 1 document into the db');
                callback(result);
            });
    },


    //Get specific message with id
    getMessageByID : function (db, id, callback ) {
        var messages = db.collection('messages');

        messages.find( { _id:id } ).toArray(function(err,result){
            assert.equal(err, null);
            callback(result);
        });
    },


    //Get messages sent to user
    getUserMessages : function(db, username, callback) {

        var messages = db.collection('messages');

        messages.find( { receiver:username} ).toArray(function(err,result){
            assert.equal(err, null);
            callback(result);
        });

    },


    //Get messages to user with star
    //Get messages of a specific type
    //Get messages with the flag "deleted"

    //Set message as read
    //Set message as deleted - It should have a TTL afterwards
    //Undelete message - It should have TTL removed

    //Switch a message's star status

    //Remove Message
    removeMessage : function ( db, id, callback) {
        var messages = db.collection('messages');
        messages.deleteOne({_id: id}, function (err, result) {
            assert.equal(err, null);
            callback(result);
        });
    }

}