var assert = require('assert');
var configDB = require('./../config/dbURL.js');



describe('dbURL', function() {
	it("Seriously, don't commit local variables over the remote one", function() {
		assert.equal('mongodb://LDSO:ldso123456@ds155747.mlab.com:55747/heroku_gdqp38z3', configDB.url);
	});	
});
