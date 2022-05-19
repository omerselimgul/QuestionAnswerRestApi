const Question=require("../models/question")
const CustomError = require("../helpers/error/CustomError")
const asyncHandler = require("express-async-handler")

const getAllQuestions=asyncHandler(async(req,res,next)=>{

    
    return res.status(200).json(req.queryResult)
})

const askNewQuestion=asyncHandler(async(req,res,next)=>{
    const information=req.body;
    const question=await Question.create({
        ...information,
        user:req.user.id
    })
    res.status(200).json({
        success:true,
        data:question
    })
})
const getSingleQuestion=asyncHandler(async(req,res,next)=>{

    return res.status(200).json(req.queryResult)
})
const editQuestion =asyncHandler(async(req,res,next)=>{
    const id =req.params.id

    const {title,content}=req.body;
    let question=await Question.findById(id)


    question.title=title;
    question.content=content;
    question=await question.save();

    return res.status(200).json({
        success:true,
        data:question
    })
})
const deleteQuestion=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;

    await Question.findByIdAndDelete(id)

    res.status(200).json({
        success:true,
        message:"Question Delete"
    })
})
const likeQuestion=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;

    const question=await Question.findById(id)
    if(question.likes.includes(req.user.id)){
        return next(new CustomError.CustomError("You Already Like This Question",400))
    }
    question.likes.push(req.user.id)
    question.likeCount=question.likes.length
    await question.save();
    res.status(200).json({
        success:true,
        data:question
    })
})
const undolikeQuestion=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;

    const question=await Question.findById(id)
    if(!question.likes.includes(req.user.id)){
        return next(new CustomError.CustomError("You can not undo like oparetion this question",400))
    }
    const index=question.likes.indexOf(req.user.id);

    question.likes.splice(index,1)
    question.likeCount=question.likes.length
    
    await question.save();
    res.status(200).json({
        success:true,
        data:question
    })
})
module.exports={
    getAllQuestions,
    askNewQuestion,
    getSingleQuestion,
    editQuestion,
    deleteQuestion,
    likeQuestion,
    undolikeQuestion
}