var configDB = require('./../config/dbURL.js');

module.exports = {
    
    insertMessage : function (db, id, sender, receiver, content, date, type, callback ) {
        var messages = db.collection('messages');
        messages.find({_id:id}).toArray(function (err,docs) {
            assert.equal(err,null);
            if(docs.length>=1){
                console.log('Already exists a message with the giver id');
                db.close();
            }
            else{
                messages.insertOne({_id:id, sender:sender, receiver:receiver, content:content, date:date, type:type},
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