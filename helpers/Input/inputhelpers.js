const bcrypt=require("bcryptjs")
const validateUserInput=(email,password)=>{
    return email&&password
}
const comparePassword=(password,hashedpassword)=>{
return bcrypt.compareSync(password,hashedpassword);
}

module.exports={validateUserInput,comparePassword};