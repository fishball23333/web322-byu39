const express = require("express");
const { getMealsByCategory, getTopMealkits } = require("../model/mealkit-db");
const SignUpValidation = require("../validation/signUpValidation");
const SignInValidation = require("../validation/signInValidation");
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

router.post("/login", (req, res)=>{
    const {email, pswd} = req.body
    let {passedValidation, validationMessages}  = SignInValidation (email, pswd)

    if (passedValidation){
        validationMessages.success = "Log in success!"
        console.log(validationMessages)
        res.redirect('/')
    } else {
        res.render("general/signIn", {
            title: "Sign In",
            values: req.body,
            validationMessages
        })
    }
})



router.get("/signUp", (req, res)=>{
    res.render( "general/signUp", 
    {title:"Sign Up"})
})

router.post("/signUp", (req, res)=>{
    const {firstName, lastName, email, pswd} = req.body
    let {passedValidation, validationMessages}  = SignUpValidation (firstName, lastName,email, pswd)
    if (passedValidation){
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        console.log(email)
        //Note: my seneca email cannot sent to gmail without DNS authentication, so I choose gmail address as a sender
        const msg = {
            to: `${email}`, 
            from: "markyu132@gmail.com",
            subject: "WEB322-WebProject-From-BinweiYu",
            html:
                `Visitor's Full Name: ${firstName} ${lastName}<br>
                Visitor's Email Address: ${email}<br>
                Student Name: Binwei Yu<br>
                Student email address: byu39@myseneca.ca<br>
                Website Name: web322-project-AsianExpress<br>
                `,
            text:"this is a text message"
        };
        sgMail.send(msg)
        .then((res)=>console.log(res))
        .catch((err)=>{
            console.log(err)
            res.render("general/signUp"),{
                values: req.body,
                validationMessages
            }
        })
        res.redirect("/welcome")
    } else {
        res.render("general/signUp", {
            title: "Sign-up",
            values: req.body,
            validationMessages
        })
    }
})

router.get("/welcome", (req, res)=>{
    res.render("general/welcome", 
    {title:"welcome"})
})


router.get("/menu", (req, res)=>{
    res.render("general/menu", 
    {title:"Menu", myMenu:getMealsByCategory()}
    
)})
module.exports = router;