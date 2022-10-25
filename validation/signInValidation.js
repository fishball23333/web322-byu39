function SignInValidation (email,  pswd){
    let passedValidation = true
    let validationMessages = {}
    //email validation 
    if (email.trim().length==0){
        passedValidation = false
        validationMessages.email = "you must specify your email"
    }
    //password validation 
    if (pswd.trim().length == 0){
        passedValidation = false
        validationMessages.pswd = "you must specify your password"
    }
    return {passedValidation, validationMessages}
}
module.exports = SignInValidation
