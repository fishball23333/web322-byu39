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


router.get("/login", (req, res)=>{
    res.render( "general/signIn", 
    {title:"Sign In"})
})


router.get("/signUp", (req, res)=>{
    res.render( "general/signUp", 
    {title:"Sign Up"})
})


router.get("/menu", (req, res)=>{
    res.render("general/menu", 
    {title:"Menu", myMenu:getMealsByCategory()}
    
)})
module.exports = router;