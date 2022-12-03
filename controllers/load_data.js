const express = require('express');
const meal_kit_model = require("../model/mealkitSchema")
const {getAllMealKits} = require("../model/mealkit-db");
const router = express.Router();


// need to modify
router.get("/load-data/meal-kits", (req, res) => {

    // Protect this route, so only "data clerks" can access it.
    if (res.locals.clerk_id){

        meal_kit_model.find().count({}, (err, count) => {
            if (err) {
                const error_message = "Couldn't count the documents: " + err
                res.render("general/notification", {
                    title:"notification", 
                    messageTitle:"Load Data Error",  
                    message:error_message})

            }
            else if (count === 0) {
                // No documents exist, add the new documents.
                const mealKitsToAdd = getAllMealKits()
                meal_kit_model.insertMany(mealKitsToAdd, (err, docs) => {
                    if (err) {
                        const error_message = "Couldn't count the documents: " + err
                        res.render("general/notification", {
                            title:"notification", 
                            messageTitle:"Load Data Error",  
                            message:error_message})                        
                    }
                    else {
                        res.render("general/notification", {
                            title:"notification", 
                            messageTitle:"Load Data Successful",  
                            message:"Success, Added meal kits to the database!"})
                    }
                });
            }
            else {
                res.render("general/notification", {
                    title:"notification", 
                    messageTitle:"Load Data Error",  
                    message:"Meal kits have already been added to the database"})
            }
        });
    } else {
        res.render("general/notification", {
            title:"notification", 
            messageTitle:"Load Data Error",  
            message:"You are not authorized to add meal kits"})
    }
})

module.exports = router;