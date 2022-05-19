const User = require("../models/user.js")
const CustomError = require("../helpers/error/CustomError")
const asyncHandler = require("express-async-handler")
const sendJwtToClient = require("../helpers/tokenHelpers/sendJwtToClient")
const { validateUserInput, comparePassword } = require("../helpers/Input/inputhelpers")
const sendEmail=require("../helpers/libraries/sendEmail")
const user = require("../models/user.js")

const register = asyncHandler(async (req, res, next) => {
    //postData
    console.log(req.body)

    const { name, email, password, role } = req.body
    // async await
    const user = await User.create({
        name: name,
        email: email,
        password: password,
        role: role
    })

    // const token =user.generateJwtFromUser();
    // console.log(token);
    // res.status(200).json({
    //     success: true,
    //     data: user
    // })
    sendJwtToClient.sendJwtToClient(user, res);

})


const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if (!validateUserInput(email, password)) {
        return next(new CustomError.CustomError("Please Check Your Input", 400))
    }

    const user = await User.findOne({ email }).select("+password");

    if (!comparePassword(password, user.password)) {
        return next(new CustomError.CustomError("Check your credentials", 400))
    }
    if(user.blocked===true){
        return next(new CustomError.CustomError("You are BANNED",497))
    }
    sendJwtToClient.sendJwtToClient(user, res);
})
const logout = asyncHandler(async (req, res, next) => {
    const { NODE_ENV } = process.env;

    return res.status(200).cookie({
        httpOnly: true,
        expires: new Date(Date.now()),
        secure: NODE_ENV === "devolopment" ? false : true
    }).json({
        success: true,
        message: "logout successfuly"
    })
})


const getUser = (req, res, next) => {
    res.json({
        success: true,
        data: {
            id: req.user.id,
            name: req.user.name
        }
    })
}

const imageUpload = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user.id, {
        "profileimage": req.savedProfileImage
    }, {
        new: true,
        runValidators: true
    })

    res.status(200)
        .json({
            success: true,
            message: "Image Upload SucessFull",
            data:user
        })
})
const forgotPassword= asyncHandler(async (req, res, next)=>{
    const resetEmail=req.body.email;
    const user=await User.findOne({email : resetEmail})
    if(!user){
        return next(new CustomError.CustomError("There is no user with that email",400))
    }
    const resetPasswordToken=user.getResetPasswordTokenFormUser();

    await user.save();

    const resetPasswordUrl=`http://localhost:5000/api/auth/resetpassword?resetPasswordToken=${resetPasswordToken}`

    const emailTemplate=`
    <h3>Reset Your Password</h3>
    <p> this <a href = ${resetPasswordUrl} target: '_blank'> Link </a>will expire in 1 hour </p>
    `;

    try{
        await sendEmail({
            from: process.env.SMTP_USER,
            to: resetEmail,
            subject: "Reset Your Password",
            html :emailTemplate
        })
        res.status(200).json({
            success :true,
            message:"token sent to your email"
        })
    }
    catch(err){
        user.resetPasswordToken=undefined;
        user.resetPasswordExpire=undefined;
        await user.save();

        return next(new CustomError.CustomError("Email Could Not Be Sent",500))
    }
})
const resetPassword= asyncHandler(async (req, res, next)=>{
    const {resetPasswordToken}=req.query;
    const {password}=req.body;
    if(!resetPasswordToken){
        return next(new CustomError.CustomError("Please provide a valid token ",400))
    }
    let user=await User.findOne({
        resetPasswordToken:resetPasswordToken,
        resetPasswordExpire : {$gt : Date.now()}
    });
    if(!user){
        return next(new CustomError.CustomError("Invalid Token or Session Expired",400))
    }
    user.password=password;
    user.resetPasswordToken=undefined;
    user.resetPasswordExpire=undefined;

    await user.save();

    return res.status(200).json({
        success:true,
        message:"Reset Password Process Successful"
    })
})

const editDetails=asyncHandler(async(req,res,next)=>{
    const editInformation=req.body;

    const user =await User.findByIdAndUpdate(req.user.id,editInformation,{
        new :true,
        runValidators:true
    })
    return res.status(200).json({
        success:true,
        data: user
    })
})
module.exports = {
    register,
    getUser,
    login,
    logout,
    imageUpload,
    forgotPassword,
    resetPassword,
    editDetails
}