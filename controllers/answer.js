const Questions=require("../models/question")
const Answer=require("../models/Answer")
const CustomError = require("../helpers/error/CustomError")
const asyncHandler = require("express-async-handler")
const { contentType } = require("express/lib/response")


const addNewAnswerToQuestion= asyncHandler(async (req,res,next)=>{

    const {question_id} =req.params

    const user_id=req.user.id;
    const information=req.body;

    const answer= await Answer.create({
        ...information,
        question:question_id,
        user:user_id
    })



    return res.status(200).json({
        success:true,
        data:answer
    })
})

const getAllAnswerByQuestion= asyncHandler(async (req,res,next)=>{
    const {question_id}=req.params;

    const question=await Questions.findById(question_id).populate("answers");

    const answers=question.answers;

    return res.status(200).json({
        success: true,
        count : answers.length,
        data:answers
    })
})
const getSingleAnswer= asyncHandler(async (req,res,next)=>{
    const {answer_id}=req.params;

    const answer=await Answer.findById(answer_id).populate({
        path:"question",
        select:"title"
    }).populate({
        path:"user",
        select:"name profileimage"
    })

    return res.status(200).json({
        success:true,
        data:answer
    })
})
const editAnswer= asyncHandler(async (req,res,next)=>{
   const {answer_id}=req.params

   const {content}=req.body
    let answer=await Answer.findById(answer_id);

    answer.content=content;

    await answer.save();

    return res.status(200).json({
        succes:true,
        data:answer
    })
})
const deleteAnswer= asyncHandler(async (req,res,next)=>{
    const {answer_id}=req.params
    const  {question_id}=req.params

    await Answer.findByIdAndRemove(answer_id);
    const question=await Questions.findById(question_id);

    question.answers.splice(question.answers.indexOf(answer_id),1)
    question.answerCount=question.answers.length
    await question.save();

    return res.status(200).json({
        succes:true,
        message:"Answer deleted succesfully"
    })
 })

 const likeAnswer=asyncHandler(async(req,res,next)=>{
    const {answer_id}=req.params;

    const answer=await Answer.findById(answer_id)


    if(answer.likes.includes(req.user.id)){
        return next(new CustomError.CustomError("You Already Like This answer",400))
    }
    answer.likes.push(req.user.id)

    await answer.save();
    res.status(200).json({
        success:true,
        data:answer
    })
})
const undolikeAnswer=asyncHandler(async(req,res,next)=>{
    const {answer_id}=req.params;

    const answer=await Answer.findById(answer_id)
    if(!answer.likes.includes(req.user.id)){
        return next(new CustomError.CustomError("You can not undo like oparetion this answer",400))
    }
    const index=answer.likes.indexOf(req.user.id);

    answer.likes.splice(index,1)
    
    await answer.save();
    res.status(200).json({
        success:true,
        data:answer
    })
})
module.exports={
    addNewAnswerToQuestion,
    getAllAnswerByQuestion,
    getSingleAnswer,
    editAnswer,
    deleteAnswer,
    likeAnswer,
    undolikeAnswer
}