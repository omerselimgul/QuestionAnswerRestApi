const mongooose=require('mongoose')
const bcrypt = require('bcryptjs');
const Schema=mongooose.Schema;
const jwt=require("jsonwebtoken");
const crypto=require("crypto");
const Question=require("./question")
const UserSchema =new Schema({
    name:{
        type:String,
        required:[true,"Please provide a name"]

    },
    email :{
        type:String,
        required : true,
        unique:[true,"Please try different email"],
        match:[
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "please provide a valid email"
        ]
    },
    role :{
        type:String,
        default:"user",
        enum:["user","admin"]
    },
    password:{
        type:String,
        minlength:[6,"please provide a passwor with min length 6"],
        required:[true,"Please provide a password"],
        select : false
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    title:{
        type:String
    },
    about :{
        type:String
    },
    place:{
        type:String
    },
    website :{
        type:String
    },
    profileimage : {
        type: String,
        default: "default.jpg"
    },
    blocked:{
        type:Boolean,
        default:false
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordExpire:{
        type:Date
    }
})
// UserShema Methods

UserSchema.methods.getResetPasswordTokenFormUser=function(){
    const {RESET_PASSWORD_EXPIRE}=process.env;
    const randomHexString =crypto.randomBytes(15).toString("hex");
    const resetPasswordToken =crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest('hex');
    this.resetPasswordToken=resetPasswordToken;
    this.resetPasswordExpire=Date.now()+parseInt(RESET_PASSWORD_EXPIRE);

    return resetPasswordToken;

}

UserSchema.methods.generateJwtFromUser =function(){
    const {JWT_SECRET_KEY,JWT_EXPIRE}=process.env;
    const payload={
        id:this._id,
        name:this.name
    }
    const token =jwt.sign(payload,JWT_SECRET_KEY,{
        expiresIn:JWT_EXPIRE
    })
    return token;
}
UserSchema.pre("save",function (next){
    if(!this.isModified("password")){
        next();
    }
    bcrypt.genSalt(10, (err, salt)=> {
        if(err){
        next(err)
        }    
        bcrypt.hash(String(this.password), salt, (err, hash)=> {
            if(err) {
                next(err)
            }

            this.password=hash;
            next()
        });
    });
})
UserSchema.post("remove",async function(){
    await Question.deleteMany({
        user:this._id
    })
})

module.exports=mongooose.model("user",UserSchema)