const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();


router.get('/cart', (req, res) =>{
    res.render('customer/cart', {
        title:"customer cart",
        // first_name: req.session.user.first_name
    })
})
module.exports = router

