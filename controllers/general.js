const express = require("express");
const { getMealsByCategory, getTopMealkits} = require("../model/mealkit-db");
const router = express.Router();


//render will be based on layouts/main.hbs first, then put specific hbs file into the "body" of main.hbs
router.get("/", (req, res) => {
    getTopMealkits().then(
        data=>{
            res.render("general/home",
            {title:"home",
             topMeal: data
            })
        }
    )
});



router.get("/welcome", (req, res)=>{
    res.render("general/welcome", 
    {title:"welcome"})
})


router.get("/menu", (req, res)=>{
    getMealsByCategory().then(
        data=>{
            res.render("general/menu", 
            {title:"Menu", myMenu:data})
        })
    }
)






module.exports = router;