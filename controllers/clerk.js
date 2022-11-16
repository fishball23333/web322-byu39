const express = require('express');

// Create a router on which to mount our API endpoints
const router = express.Router();


router.get('/list-mealkits', (req, res)=>{
    res.render('clerk/list-mealkits'),{
        title:"clerk mealkits list"
    }
})


module.exports = router