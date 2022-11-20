const Mongoose = require('mongoose')
const bcrypt = require("bcryptjs")

const userSchema = new Mongoose.Schema({
    first_name:{type:String,required:true},
    last_name:{type:String, required:true},
    user_email: {type:String, required:true, unique:true},
    password:{type:String, required:true},
})
userSchema.pre("save", function(next){
    let user = this
    //generate salt
    bcrypt.genSalt(10)
        .then(salt => {
            //hash the password using the generated salt.
            bcrypt.hash(user.password, salt)
                .then(hashedPwd =>{
                user.password = hashedPwd
                next()
            })
            .catch(err=>{
                console.log(`Error occurred when salting... ${err}`)
            })
        })                
        .catch(err=>{
            console.log(`Error occurred when salting... ${err}`)
        })
})

module.exports = Mongoose.model("user", userSchema)