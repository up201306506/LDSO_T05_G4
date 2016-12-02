var assert = require('assert');
var ObjectID = require('mongodb').ObjectID;

module.exports = {

    /*
        sender: username
        receiver: username
        subject: text
        content: inner_html?? text??
        date: date
        type: "offer", "conversation"
        read: bool
        starred: bool
        deleted: bool
     */

    //Create a new Message
    insertMessage : function (db, sender, receiver, subject, content, date, type, callback) {
        // Get messages collection
        var messages = db.collection('messages');

        //add message to collection
        messages.insertOne({sender:sender, receiver:receiver, subject:subject, content:content, read:false, starred:false, date:date, type:type, deleted:false},
            function (err,result) {
                console.log('Inserted 1 document into the db');
                callback(result);
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

    //Get messages sent to user
    getMessagesByUser : function(db, username, callback) {

        var messages = db.collection('messages');

        messages.find( { receiver:username} ).sort({ date:-1}).toArray(function(err,result){
            assert.equal(err, null);
            callback(result);
        });

    },


    //Get messages to user with star
    getStarredUserMessages : function(){
    },

    //Get messages of a specific type
    getMessagesByUserByType : function(){

    },

    //Get messages with the flag "deleted"
    getMessagesByUserDeleted : function(){

    },

    //Set message as read
    setMessageAsRead : function(){

    },

    //Set message as deleted - It should have a TTL afterwards
    setMessageAsDeleted : function(){

    },

    //Undelete message - It should have TTL removed
    setMessageAsUndeleted : function(){

    },

    //Switch a message's star status
    setMessageAsStarred : function(){

    },

    //Remove Message
    removeMessage : function ( db, id, callback) {
        var messages = db.collection('messages');
        messages.deleteOne({_id: id}, function (err, result) {
            assert.equal(err, null);
            callback(result);
        });
    }

}