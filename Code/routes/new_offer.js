var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('new_offer', { title: 'New Offer' });
});

router.post('/', function(req, res) {

    var response =
    {
        offer_name:req.body.offer_name,
        offer_description:req.body.offer_description,
        offer_type:req.body.offer_type
    };

    console.log(response);
    res.end(JSON.stringify(response));
});

module.exports = router;
