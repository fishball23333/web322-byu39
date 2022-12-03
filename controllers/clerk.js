const express = require('express');
const { getMealsByCategory } = require("../model/mealkit-db");
const addMealKitValidation = require("../validation/addMealKitValidation")
const editMealKitValidation = require("../validation/editMealKitValidation")
const meal_kit_model = require("../model/mealkitSchema")
const path = require("path");
// Create a router on which to mount our API endpoints
const router = express.Router();


router.get('/list-mealkits', (req, res)=>{
    if (req.session.clerk){
        getMealsByCategory().then(
            data=>{
                res.render('clerk/list-mealkits',{
                    title:"clerk mealkits list",
                    myMenu:data
                })
            }
        )
    } else {
        res.render('general/notification',{
            title:"unauthorized",
            message:"user is not authorized to this page",
            messageTitle: "Authorization Error:"
        })
    }
})

router.get('/add-mealkit',(req, res)=>{

    if (req.session.clerk){
        res.render('clerk/add-mealkit', {
        title:"clerk add-mealkit",
    })
    } else {
        res.render('general/notification',{
            title:"unauthorized",
            message:"user is not authorized to this page",
            messageTitle: "Authorization Error:"
        })
    }
})

router.post('/add-mealkit',(req, res)=>{
   let image_ext = ""
    if (req.files){
     image_ext =  path.parse(req.files.image.name).ext
    }
    const {title, include, description, category, price, cookingTime, 
           servings, topMeal, customerRating} = req.body
     let {passedValidation, validationMessages}  = addMealKitValidation (title, include, 
        description, category, price, cookingTime, servings, topMeal, customerRating, image_ext)
    if (req.session.clerk){
        if (passedValidation){
            //edit this part later
            const newDoc = new meal_kit_model({
                title:title,
                include:include,
                description:description,
                category:category,
                price:price,
                cookingTime:cookingTime,
                servings:servings,
                imageUrl:"fix after",
                customerRating:customerRating, 
                topMeal:topMeal  
            })
            newDoc.save().then(savedDoc => {
                console.log(savedDoc.title, "saved")
                let uniqueName = `profile-pic-${savedDoc._id}${path.parse(req.files.image.name).ext}`;
                req.files.image.mv(`assets/image/${uniqueName}`).then(()=>{
                    meal_kit_model.updateOne({_id:savedDoc._id},{imageUrl:'/image/'+uniqueName}).then(()=>{
                        res.render('general/notification',{
                            title:"Add mealKit",
                            message:savedDoc.title + "has been added to the database",
                            messageTitle: "Upload successful"
                        })
                    }).catch(err=>{
                        res.render('general/notification',{
                            title:"clerk/add-mealkit",
                            message: "err sended from database: " + err,
                            messageTitle:"Uploading Error"
                        })
                    })
                }).catch(err=>{
                    res.render('general/notification',{
                        title:"clerk/add-mealkit",
                        message: "error from storing the image file: " + err,
                        messageTitle:"Uploading Error"
                    })
                })
            }).catch(err=>{
                res.render('general/notification',{
                    title:"clerk/add-mealkit",
                    message: "Error adding user to the database ...: " + err,
                    messageTitle:"Uploading Error"
                })
            })
    } else {
            res.render('clerk/add-mealkit', {
                title:"clerk add-mealkit",
                values:req.body,
                validationMessages
            })
        
        }
    } else {
        res.render('general/notification',{
            title:"unauthorized",
            message:"user is not authorized to this page",
            messageTitle: "Authorization Error:"
        })
    }
})

router.get('/edit-mealkit',(req,res)=>{
    meal_kit_model.findById(req.query.id).then(data => {
        let dataObject = data.toObject()
        res.render('clerk/edit-mealkit',{
            title:"clerk edit-mealkit",
            object:dataObject,
            id: req.query.id
        })
    })
    // even though this error not likely to happen
    // ).catch(
    //     res.render("general/notification",{
    //         title:"edit-mealkit",
    //         message:"unable to find the data from database",
    //         messageTitle: "Retrieving Error:"
    //     })
    // )
})

router.post('/edit-mealkit', (req,res)=>{
   let image_ext = ""
   if (req.files){
     image_ext =  path.parse(req.files.image.name).ext
   }
    const {title, include, description, category, price, cookingTime, 
           servings, topMeal, customerRating} = req.body
    let {passedValidation, validationMessages}  = editMealKitValidation (title, include, 
        description, category, price, cookingTime, servings, topMeal, customerRating, image_ext)
    ///req.body.id somehow contains a "/" so I have to remove it 
    req.body.id = req.body.id.substring(0, req.body.id.indexOf('/'))
    console.log("typeof id", typeof req.body.id)
    if (passedValidation){
        if (!req.files){             
            meal_kit_model.findOneAndUpdate({"_id":req.body.id},{"$set":{
                "title": title,
                "include":include,
                "description":description,
                "category":category,
                "price":price,
                "cookingTime":cookingTime,
                "servings":servings,
                "customerRating":customerRating,
                "topMeal":topMeal}}).then(    
                    res.render('general/notification', {
                        title:"edit-mealkit",
                        message:req.body.title + " has been edited",
                        messageTitle: "Editing Success"
                    })    
                ).catch(err=>{
                    res.render('general/notification', {
                        title:"edit-mealkit",
                        message:"something wrong to modify data to the database " + err,
                        messageTitle: "Editing Success"
                    })    

                }
                )
        } else {
            console.log("req.body", req.body)
            let uniqueName = `profile-pic-${req.body.id}${path.parse(req.files.image.name).ext}`;
            req.files.image.mv(`assets/image/${uniqueName}`).then(()=>{
                meal_kit_model.findOneAndUpdate({"_id":req.body.id},{"$set":{
                    "imageUrl":'/image/'+uniqueName,
                    "title": title,
                    "include":include,
                    "description":description,
                    "category":category,
                    "price":price,
                    "cookingTime":cookingTime,
                    "servings":servings,
                    "customerRating":customerRating,
                    "topMeal":topMeal}}).then(    
                        res.render('general/notification', {
                            title:"edit-mealkit",
                            message:req.body.title + " has been edited",
                            messageTitle: "Editing Success"
                        })    
                    )
            }).catch( err=>{
                res.render('general/notification', {
                    title:"edit-mealkit",
                    message: "fail to upload the file: " + err,
                    messageTitle: "Editing Fail"
                })    
            })
        }
    } else {
        console.log("hellow", req.body)
        res.render('clerk/edit-mealkit',{
            title:"clerk edit-mealkit",
            object:req.body,
            id: req.body.id,
            validationMessages
        })
    }
})

router.get('/remove-mealkit',(req, res)=>{
    meal_kit_model.deleteOne({ _id: req.query.id }).then(function(){
        res.render('general/notification', {
            title:"clerk remove-mealkit",
            message:req.query.title + " has been removed",
            messageTitle: "Remove Success"
        })
    }).catch(function(error){
        res.render('general/notification', {
        title:"clerk remove-mealkit",
        message:"something was wrong: " + error,
        messageTitle: "Remove Failed"
    })
    });
})

module.exports = router