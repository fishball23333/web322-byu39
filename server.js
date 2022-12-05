/*************************************************************************************
* WEB322 - 2227 Project
* I declare that this assignment is my own work in accordance with the Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* Student Name  : Binwei Yu
* Student ID    : 013154158
* Course/Section: WEB322/NEE
* Assignment 6
**************************************************************************************/

const path = require("path");
const express = require("express");
const exphbs  = require('express-handlebars')
const app = express();
// Set up dotenv
const dotenv = require("dotenv");
const Mongoose = require("mongoose")
const session = require("express-session");

//setting env variable
dotenv.config({ path: "./config/keys.env" });

//setting fileupload
const fileUpload = require("express-fileupload");

//setting handlebar engine
app.engine(".hbs", exphbs.engine({
    extname:".hbs",
    defaultLayout:"main",
}))
app.set("view engine", ".hbs")

//Set up body-parser
app.use(express.urlencoded({extended:true}))

// Set up express-upload
app.use(fileUpload());
// Set up express-session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));


app.use((req, res, next) => {
    // res.locals.user is a global handlebarsuser_role variable.
    // This means that every single handlebars file can access this variable.
    res.locals.user = req.session.user;
    if (req.session.customer){
        res.locals.customer = true
    } else if (req.session.clerk){
        res.locals.clerk_id = true
    }
    next();
});

//setting static folder
app.use(express.static(path.join(__dirname, "/assets")))

//Connecting to the database
Mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Connected to the MongoDB database")
}).catch(err=>{
    console.log(`There was a problem connecting to MongoDB... ${err}`);
})



//setting controllers
    const Customer = require("./controllers/customer")
    const Clerk = require("./controllers/clerk")
const generalController = require("./controllers/general")
const loadDataController = require("./controllers/load_data")
const User = require("./controllers/user")

app.use("/", generalController)
app.use("/", loadDataController)
app.use("/user", User)
app.use("/customer", Customer)
app.use("/clerk", Clerk)

// *** DO NOT MODIFY THE LINES BELOW ***

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});

// This use() will add an error handler function to
// catch all errors.
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Something broke!")
});

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}
  
// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
app.listen(HTTP_PORT, onHttpStart);