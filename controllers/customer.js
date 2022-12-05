const express = require('express');
const meal_kit_model = require('../model/mealkitSchema');
const userModel = require("../model/userSchema");
// Create a router on which to mount our API endpoints
const router = express.Router();


router.get('/cart', (req, res) =>{
    if (req.session.customer){
        let cart = req.session.cart = req.session.cart || []
        console.log(cart)
        if (cart.length == 0){
            res.render('customer/cart')
        } else {

            message = "Welcome"
            res.render('customer/cart', 
                prepareViewModel(req, message)
            )
        }
    } else{
        res.render('general/notification',{
            title:"unauthorized",
            message:"user is not authorized to this page",
            messageTitle: "Authorization Error:"
        })
    }
})

router.get('/mealkit_order', (req, res) =>{
    meal_kit_model.findById(req.query.id).then(data=>{
        let dataObject = data.toObject()
        res.render('customer/mealkit_order',{
            title:"customer mealkit_order",
            object: dataObject,
            id: req.query.id
        })
    })
})


const prepareViewModel = function (req, message) {

    if (req.session && req.session.customer) {
        // Is the user signed in and has a session been established.

        let cart = req.session.cart || [];
        let cartTotal = 0;

        // Check if the cart has any songs.
        const hasMealkits = cart.length > 0;


        // If there are songs in the shopping cart, then calculate the order total.
        if (hasMealkits) {
            cart.forEach(cartMealkit => {
                cartTotal += cartMealkit.extendedPrice
            });
        }

        return {
            message,
            hasMealkits,
            mealkits: cart,
            cartTotal: "$" + cartTotal.toFixed(2),
        };
    }
    else {
        // The user is not signed in, return default information.
        console.log("rejected")
        return {
            message,
            hasMealkits: false,
            mealkits: [],
            cartTotal: "$0.00"
        };
    }
}


router.get('/add_order',(req, res)=>{
    let message
    const id = req.query.id
    if (req.session.customer){
        meal_kit_model.findById(id).then(data=>{
            let cart = req.session.cart = req.session.cart || []
            if (data){
                let mealkit = data.toObject()
                let found = false
                cart.forEach(object =>{
                    if (object.id == id){
                        found = true
                        object.qty++
                        object.extendedPrice += object.mealkit.price
                    }
                })
                if (found){
                    message = "The song was already in the cart, incremented the qty by one"
                    console.log(message)
                }
                else {
                    cart.push({
                        id:id,
                        qty:1,
                        extendedPrice:mealkit.price * 1,
                        mealkit,
                    })
                }
                res.render("customer/cart", prepareViewModel(req, message))
            } else{
                message = "the meal kit was not found in the database"
                console.log(message)
            }
        })
    
} else {
    message = "you must logged in as a customer"
    console.log(message)
}
})


router.get('/reduce_order',(req, res)=>{
    console.log("reduce order")
    let message
    const id = req.query.id
    if (req.session.customer){
        let cart = req.session.cart = req.session.cart || []
        const index = cart.findIndex(object => object.id == id)
        cart[index].qty--
        if (cart[index].qty <= 0){
            cart.splice(index, 1)
        } else {
            cart[index].extendedPrice -= cart[index].mealkit.price
        }
        res.render("customer/cart", prepareViewModel(req, message))
        } else {
            message = "you must logged in as a customer"
            console.log(message)
        }
})

router.get('/checkout',(req, res)=>{
    let message
    if (req.session.customer){
        let cart = req.session.cart || []
        if (cart.length > 0){
            message = "you are now checked out, checkout receipt has been sent to your email."
            const sgMail = require("@sendgrid/mail");
            let tableMessage = "<table><tr><th>Mealkit Name</th><th>quantity</th><th>price</th><th>extended price</th></tr>"
            cartTotal = 0
            cart.forEach(cartMealkit => {
                tableMessage += "<tr><td>" + cartMealkit.mealkit.title + "</td>" +  
                 "<td>"  + cartMealkit.qty + "</td><td> $" + cartMealkit.mealkit.price + "</td><td> $" + cartMealkit.extendedPrice.toFixed(2) + "</td></tr>" 
                cartTotal += cartMealkit.extendedPrice
            });
            tableMessage += "<tr>" + "total amount before tax: $" + cartTotal + "</tr>"
            tableMessage += "</table>"
            console.log(tableMessage)
            sgMail.setApiKey(process.env.SENDGRID_API_KEY);
            email = req.session.customer
             userModel.findOne({user_email:email}).then(user => {
                const firstName = user.first_name
                const lastName = user.last_name
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
                    <br><br>
                    CHECK OUT RECEIPT<br> 
                    ${tableMessage}
                    `,
 
                };
                sgMail.send(msg)
            })
            req.session.cart = []
            res.render('general/notification', {
                title:"customer checkout",
                message:message,
                messageTitle: "Checkout Success"
            })
        } else {
            message = "You cannot check-out, there are no items in the cart."
        }
    } else {
        message = "You must be logged in"
    }
})
    


module.exports = router

