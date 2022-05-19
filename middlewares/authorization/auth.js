const customError=require("../../helpers/error/CustomError")
const jwt=require("jsonwebtoken")
const tokenHelpers=require("../../helpers/tokenHelpers/sendJwtToClient")
const asyncHandler = require("express-async-handler");
const User=require("../../models/user")
const Question=require("../../models/question")
const Answers=require("../../models/Answer")

const { config } = require("dotenv");
const user = require("../../models/user");
const getAccessToRoute=(req,res,next)=>{

    const {JWT_SECRET_KEY}=process.env;
    if (!tokenHelpers.isTokenIncluded(req)) {
        return next(new customError.CustomError("login  yapiniz !",450))
    }
    const accessToken=tokenHelpers.getAccessTokenFromHeader(req);
    jwt.verify(accessToken,JWT_SECRET_KEY,(err,decoded)=>{
        if(err){
            return next(new customError.CustomError("invalid email or password",401))
        }
        req.user={
            id:decoded.id,
            name:decoded.name
        }
        next();
    })
}
const getAdminAccess=asyncHandler(async(req,res,next)=>{
    const {id}=req.user;

    const user=await User.findById(id);

    if(user.role!=="admin"){
        return next(new customError.CustomError("You can not access to admin panel",403))
    }
    next();
})

const getQuestionOwnerAccess=asyncHandler(async(req,res,next)=>{
    
    const user_id=req.user.id;
    const questionid=req.params.id

    const question=await Question.findById(questionid);
    if(question.user!=user_id){
        return next(new customError.CustomError("Only owner can handle this operation",403))
    }
    next();
})

const getAnswerOwnerAccess=asyncHandler(async(req,res,next)=>{
    
    const user_id=req.user.id;
    const answer_id=req.params.answer_id

    const answer=await Answers.findById(answer_id);
    if(answer.user!=user_id){
        return next(new customError.CustomError("Only owner can handle this operation",403))
    }
    next();
})
module.exports={
    getAccessToRoute,
    getAdminAccess,
    getQuestionOwnerAccess,
    getAnswerOwnerAccess
}