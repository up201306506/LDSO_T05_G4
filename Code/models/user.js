/*

    ESTE FICHEIRO NÃO FAZ NADA, É SÓ PARA O CASO DE SER NECESSÁRIO FAZER O LOGIN DE OUTRA FORMA

 */

/*var mongoose = require('mongoose'),
    bcrypt = require('bcryptjs'),
    configDB = require('./../config/database.js');

mongoose.connect(configDB.url);

// define the schema for our user model
var userSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password:{
        type: String
    },
    email:{
        type: String
    }
});

module.exports.createUser = function(newUser, callback){
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
var User = module.exports = mongoose.model('User', userSchema);
*/