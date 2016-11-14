var express = require('express');
var router = express.Router();
var assert = require('assert');
var userPrivileges = require('./../../config/userPrivileges');

/* GET community user list page. */
router.get('/', function (req, res) {

    var isMod = userPrivileges.isModerator();

    // TEMP
    var testArray = [
        {
            name: 'Joaquim Zé',
            email: 'email@email.com'
        },
        {
            name: 'Joaquim Zé',
            email: 'email@email.com'
        },
        {
            name: 'Joaquim Zé',
            email: 'email@email.com'
        },
        {
            name: 'Joaquim Zé',
            email: 'email@email.com'
        }
    ];

    res.render('community/community_user_list',
        {
            title: 'Community List Of Users',
            isModerator: isMod,
            communityName: 'Nome da Comunidade',
            users: testArray
        });
});

module.exports = router;