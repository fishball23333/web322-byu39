function SignInValidation (email,  pswd, role){
    let passedValidation = true
    let validationMessages = {}
    //email validation 
    if (email.trim().length===0){
        passedValidation = false
        validationMessages.email = "you must specify your email"
    }
    //password validation 
    if (pswd.trim().length == 0){
        passedValidation = false
        validationMessages.pswd = "you must specify your password"
    }
  //password validation
    if (typeof pswd !== "string" || pswd.trim().length==0){
        passedValidation = false
        validationMessages.pswd = "you must specify a password"
    } else if (pswd.length>12 || pswd.length<8){
        passedValidation = false
        validationMessages.pswd = "your password should between 8 to 12 characters"
    } else if (!/.*[a-z].*/.test(pswd)){
        passedValidation = false
        validationMessages.pswd = "your password should have at least 1 lower-case character"
    } else if (!/.*[A-Z].*/.test(pswd)){
        passedValidation = false
        validationMessages.pswd = "your password should have at least 1 upper-case character"
    } else if (!/.*\d.*/.test(pswd)){
        passedValidation = false
        validationMessages.pswd = "your password should have at least 1 number"
    } else if (!/.*\W.*/.test(pswd)){
        passedValidation = false
        validationMessages.pswd = "your password should have at least 1 symbol"
    }

        //role validation
    if (!role){
        passedValidation = false
        validationMessages.role = "you must specify a role"
    }
    return {passedValidation, validationMessages}
}
module.exports = SignInValidation
