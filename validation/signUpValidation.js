
function SignUpValidation (firstName, lastName,email,  pswd){
    let passedValidation = true
    let validationMessages = {}
    //firstName validation
    if (typeof firstName !== "string" || firstName.trim().length == 0){
        passedValidation = false
        validationMessages.firstName = "you must specify a first name"
    } else if (typeof firstName !== "string" || firstName.trim().length < 2){
        passedValidation = false
        validationMessages.firstName = "the first name should be at least 2 characters long"
    }

    //lastName validation
    if (typeof lastName !== "string" || lastName.trim().length==0){
        passedValidation = false
        validationMessages.lastName = "you must specify a last name"
    } else if (typeof lastName !== "string" || lastName.trim().length < 2){
        passedValidation = false
        validationMessages.lastName = "the last name should be at least 2 characters long"
    }

    //email validation 
    if (typeof email !== "string" || email.trim().length==0){
        passedValidation = false
        validationMessages.email = "you must specify an email address"
    } else if (!/^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/.test(email)){
        passedValidation = false
        validationMessages.email = "your email should match 'xxxxx@xxxx.xxx' format"
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
    return {passedValidation, validationMessages}
}
module.exports = SignUpValidation