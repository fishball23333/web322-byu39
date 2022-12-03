const { response } = require('express')
const Mongoose = require('mongoose')
const meal_kit_model = require("./mealkitSchema")

let mealkitsDataBase = [
    {
        title:"Sichuan Boiled Beef", 
        include: "Szechuan peppercorns & Sesame oil & Marinated Beef & secrete sauce",
        description: "Popular in Szechuan, China, the beef is well marinated and the pepper is imported from China with the best quality. The food looks spicy that some people may get scared, but once they taste it, they will get addicted to its flavor. You can choose to add less pepper if you really can't stand the spicy food, the taste would still be gorgeous",
        category:"spicy", 
        price: 15.99,
        cookingTime: 30, 
        servings: 4,
        imageUrl: "/image/food/topmeal1.jpg", 
        customerRating: 5,
        topMeal: true
    }, 
    {
        title:"Pan Fried Tofu", 
        include: "hand-made marinated tofu & Sesame oil & secrete sauce & ginger & pickled peppers",
        description: "It looks simple, but the tofu are hand-made from our company with the best quality of the soys in Canada. Also, Our tofu is perfectly marinated, and most people like it not only because it's delicious, but also its super cheap as compared with most restaurant sell in Canada",
        category:"mild", 
        price: 3.99,
        cookingTime: 10, 
        servings: 3,
        imageUrl: "/image/food/topmeal2.jpg", 
        customerRating: 4,
        topMeal: true
    },
    {
        title:"Hot and Sour Fish", 
        include: "sliced sea bass & parsley & Spam",
        description: "Famous in China, however, it is hard to find this cuisine in most Chinese restaurant in Canada somehow. But now, you don't need to worry about it, we have prepared the best marinated spice and fresh fish for you to cook.",
        category:"spicy", 
        price: 15.99,
        cookingTime: 20, 
        servings: 4,
        imageUrl: "/image/food/topmeal3.jpg", 
        customerRating: 5,
        topMeal: true
    },{
        title:"Hainanese Chicken Rice", 
        include: "Wenchang Chicken & Rice & Sesame oil & Ginger & ginger & Star Anise & Soy Sauce & chilli sauce",
        description: "it is a popular staple food in South Asia, according to wikipedia, it is considered one of the national dishes in Singapore. It can be a good choice for people who don't want to taste food in strong flavor",
        category:"mild", 
        price: 9.99,
        cookingTime: 30, 
        servings: 1,
        imageUrl: "/image/food/HainaneseChickenRice.jpg", 
        customerRating: 4,
        topMeal: false
    }, {
        title:"Crab With Rice Cake", 
        include: "Vancouver King Crab & Rick Cake & Ginger & Onion",
        description: "This is a easy-make food, but this is very tasty because the quality of the ingredients. the king crab is picked during the delivery day so it's very fresh, and the price is the best you can find if you want to order this food",
        category:"mild", 
        price: 35.99,
        cookingTime: 25, 
        servings: 3,
        imageUrl: "/image/food/CrabWithRiceCake.jpg", 
        customerRating:5,
        topMeal: false
    }, {
        title:"Taiwanese Fried Chicken", 
        include: "marinated chicken popcorn & Basil & Ginger & green onion",
        description: "It is considered to be one of the best Taiwanese street food for most people, the chicken popcorn testes crunchy outside and very tender inside",
        category:"mild", 
        price: 10.99,
        cookingTime: 20, 
        servings: 2,
        imageUrl: "/image/food/TaiwaneseFriedChicken.jpg", 
        customerRating: 5,
        topMeal: false
    }
]




//will check if "filter" is ok in this case
// module.exports.getTopMealkits = () =>{
//     let topMealkits = mealkitsDataBase.filter((element)=>{return element.topMeal===true})
//     return topMealkits
// }


module.exports.getTopMealkits = function(){
    return new Promise((resolve, reject) =>{
        meal_kit_model.find().then(
            (meal_kits)=>{
            let objects = meal_kits.map(value => value.toObject())
            let topMealkits = objects.filter((element)=>{return element.topMeal==true})
            resolve(topMealkits)
        }).catch(
            (err)=>{console.log(err)
            reject (err)
        })
    })
}

module.exports.getMealsByCategory = function(){
    return new Promise((resolve, reject) =>{
        meal_kit_model.find().then(
            (meal_kits)=>{
            let objects = meal_kits.map(value => value.toObject())
            let categories = {}
            objects.forEach((element)=>{
                // console.log(element._id.valueOf())
                if (categories[element.category]){
                    categories[element.category].push(element)
                } else {
                    categories[element.category] = [element]
                }
            })
            let outputList = []
            for (let key in categories){
                outputList.push({categoryName:key, mealKit: categories[key]})
            }
            console.log(outputList)
            resolve(outputList)
        }).catch(
            (err)=>{console.log(err)
            reject (err)
        })
    })
}

module.exports.getAllMealKits = () =>{
    return mealkitsDataBase
}

