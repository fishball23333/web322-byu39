const Mongoose = require("mongoose")


let mealKitSchema = new Mongoose.Schema({
    title:{type:String, required:true, unique:true},
    include:{type:String, required:true},
    description:{type:String, required:true},
    category:{type:String, required:true},
    price:{type:Number, required:true},
    cookingTime:{type:Number, required:true},
    servings:{type:Number, required:true},
    imageUrl:{type:String, required:true},
    customerRating:{type:Number, required:true}, 
    topMeal:{type:Boolean, required:true}    
})
const meal_kit_model = Mongoose.model("meal_kit", mealKitSchema)
module.exports = meal_kit_model

