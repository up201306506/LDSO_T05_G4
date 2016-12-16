var assert = require('assert');
var configDB = require('./../config/dbURL.js');
console.log(configDB.url);


assert.equal('mongodb://LDSO:ldso123456@ds155747.mlab.com:55747/heroku_gdqp38z', configDB.url);








