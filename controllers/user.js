const express = require("express");
const SignUpValidation = require("../validation/signUpValidation");
const SignInValidation = require("../validation/signInValidation");
const userModel = require("../model/userSchema");
const router = express.Router();
const bcrypt = require("bcryptjs");

router.get("/login", (req, res)=>{
    res.render( "user/signIn", 
    {title:"Sign In"})
})


router.post("/login", (req, res)=>{
    const {email, pswd, role} = req.body
    let {passedValidation, validationMessages}  = SignInValidation (email, pswd, role)
    if (passedValidation){
        userModel.findOne({user_email:req.body.email}).then(user => {
            if (user){
                bcrypt.compare(pswd, user.password).then(isMatched => {
                    if (isMatched){
                        req.session.user = user;
                        if (role === "clerk_id"){
                            req.session.clerk = true
                            res.redirect("/clerk/list-mealkits")
                        } else if (role === 'customer'){
                            req.session.customer = email
                            res.redirect('/customer/cart')
                        }
                    } else {
                        validationMessages.serverError = "sorry, you might have entered a wrong password."
                        res.render("user/signIn",{
                            title:"Sign In",
                            values:req.body,
                            validationMessages
                        })
                    }
                })
            } else {
                //couldn't query the database.
                validationMessages.serverError = "sorry, we cannot find your email account associated with the role selected"
                res.render("user/signIn",{
                    title:"Sign In",
                    values:req.body,
                    validationMessages
                })}}
        )
    } else {
        res.render("user/signIn", {
            title: "Sign In",
            values: req.body,
            validationMessages
        })
    }
})

router.get("/signUp", (req, res)=>{
    res.render( "user/signUp", 
    {title:"Sign Up"})
})


router.post("/signUp", (req, res)=>{
    const {firstName, lastName, email, pswd, role} = req.body
    console.log(req.body)
    let {passedValidation, validationMessages}  = SignUpValidation (firstName, lastName,email, pswd, role)
    if (passedValidation){
        const sgMail = require("@sendgrid/mail");
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
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
        
        
        console.log(email)
        let user = new userModel({
            first_name:firstName,
            last_name:lastName,
            user_email: email,
            password:pswd,
        })

        user.save()
        .then(userSaved=>{
            console.log(`User ${userSaved.first_name} has been added to the database.`)
            sgMail.send(msg)
                .then(res.redirect("/welcome"))
                .catch(err=>{
                    validationMessages.unexpectedError = true
                    console.log("here is the unexpected error messages1", err.message)
                    console.log(err)
                    res.render("user/signUp",{
                        title: "Sign-up",
                        values: req.body,
                        validationMessages
                    }) 
                })
        })
        .catch(err=>{
            validationMessages.unexpectedError = true
            console.log("here is the unexpected error messages2", err.message)
            console.log(err)
            res.render("user/signUp",{
                title: "Sign-up",
                values: req.body,
                validationMessages
            }) 
        })
    }
    else {
        res.render("user/signUp", {
            title: "Sign-up",
            values: req.body,
            validationMessages
        })
    }


})

router.get("/logout", (req, res) => {
    // Clear the session from memory.
    req.session.destroy();
    res.redirect("/");
});


module.exports = router