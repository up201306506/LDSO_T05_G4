var express = require('express');
var router = express.Router();
var assert = require('assert');

/* GET community creation page. */
router.get('/', function (req, res) {
    res.render('community/edit_community',
        {
            title: 'Nome da Comunidade',
            name: 'Nome da Comunidade',
            headQuartes: 'Porto - FEUP',
            description: 'Descrição teste da comunidade para mostrar a template da página'
        });
});


module.exports = router;