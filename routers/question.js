const express=require('express')
const {answerQueryMiddleware}=require("../middlewares/query/answerQueryMiddleware")
const Q=require("../controllers/questions")
const verification=require("../middlewares/authorization/auth")
const Question=require("../models/question")
const answer=require("./answer")
//Api/questions
const QuesMiddle=require("../middlewares/database/databaseErrorHelpers")

const {questionQueryMiddlewares}=require("../middlewares/query/questionQueryMiddlewares")


const router=express.Router();

router.get("/",questionQueryMiddlewares(
    Question,{
        population : {
            path:"user",
            select:"name profileimage"
        }
    }

),Q.getAllQuestions)

router.delete("/:id/delete",[verification.getAccessToRoute,QuesMiddle.checkQuestionExist,verification.getQuestionOwnerAccess],Q.deleteQuestion)

router.post("/ask",verification.getAccessToRoute,Q.askNewQuestion)

router.get("/:id",[QuesMiddle.checkQuestionExist,answerQueryMiddleware(Question,{
    population:[
        {
            path:"user",
            select:"name profileimage"
        },
        {
            path:"answers",
            select:"content"
        }
    ]
})],Q.getSingleQuestion)

router.put("/:id/edit",[verification.getAccessToRoute,QuesMiddle.checkQuestionExist,verification.getQuestionOwnerAccess],Q.editQuestion)

router.get("/:id/like",[verification.getAccessToRoute,QuesMiddle.checkQuestionExist],Q.likeQuestion)

router.get("/:id/unlike",[verification.getAccessToRoute,QuesMiddle.checkQuestionExist],Q.undolikeQuestion)

router.use("/:question_id/answer",QuesMiddle.checkQuestionExist,answer)
module.exports=router;
