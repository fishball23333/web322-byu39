function editMealKitValidation (title, include, description, category, price, cookingTime, serving, topMeal,customerRating, image_ext){
    let passedValidation = true
    let validationMessages = {}
    //email validation 
    if (title.trim().length===0){
        passedValidation = false
        validationMessages.title = "you must specify your mealkit title"
    }
    //password validation 
    if (include.trim().length == 0){
        passedValidation = false
        validationMessages.include = "you must specify your mealkit include/ingredients"
    }
    //description validation
    if (description.trim().length == 0){
        passedValidation = false
        validationMessages.description = "you must specify your mealkit description"
    }    
    //category validation
    if (category.trim().length == 0){
        passedValidation = false
        validationMessages.category = "you must specify your mealkit category"
    }
    //price validation    
    if (price.trim().length == 0){
        passedValidation = false
        validationMessages.price = "you must input a number for the mealkit price"        
    } 

        console.log(typeof cookingTime)
    //cookingTime validation  
    if (cookingTime.trim().length == 0){
        passedValidation = false
        validationMessages.cookingTime = "you must input a number for the mealkit serving people"        
    } 

    //serving validation    
    if (serving.trim().length == 0){
        passedValidation = false
        validationMessages.serving = "you must input a number for the mealkit serving people"        
    } 
    
    if (!topMeal) {
        passedValidation = false
        validationMessages.topMeal = "you must specify if its a topMeal"             
    }


    //customer rating
    if (!customerRating){
        passedValidation = false
        validationMessages.customerRating = "you must specify the topMeal rating"    
    }


    if (image_ext.trim().length != 0){
        if (!(image_ext == '.jpg' || image_ext =='.jpeg' || image_ext == '.png' || image_ext == '.gif')){
            passedValidation = false
            validationMessages.image = "your image file should be either 'jpg', 'jpeg', 'png' 'gif'"
            console.log("image")
        }
    } 
    return {passedValidation, validationMessages}
}
module.exports = editMealKitValidation