const express = require("express");
const { getMealsByCategory, getTopMealkits } = require("../model/mealkit-db");
const router = express.Router();

//render will be based on layouts/main.hbs first, then put specific hbs file into the "body" of main.hbs
router.get("/", (req, res) => {
    res.render("general/home",
    {title:"home",
     topMeal: getTopMealkits()
    })
});




router.get("/welcome", (req, res)=>{
    res.render("general/welcome", 
    {title:"welcome"})
})


router.get("/menu", (req, res)=>{
    res.render("general/menu", 
    {title:"Menu", myMenu:getMealsByCategory()}
    
)})
module.exports = router;