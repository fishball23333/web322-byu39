const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();


router.get('/cart', (req, res) =>{
    if (req.session.customer){
    res.render('customer/cart', {
        title:"customer cart",
    })
    } else{
        res.render('general/notification',{
            title:"unauthorized",
            message:"user is not authorized to this page",
            messageTitle: "Authorization Error:"
        })
    }
})

module.exports = router

