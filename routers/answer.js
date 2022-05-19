const express = require("express")

const {getAccessToRoute,getAnswerOwnerAccess}=require("../middlewares/authorization/auth")

const {
    addNewAnswerToQuestion,
    getAllAnswerByQuestion,
    getSingleAnswer,
    editAnswer,
    deleteAnswer,
    likeAnswer,
    undolikeAnswer
}=require("../controllers/answer")

const {checkQuestionAndAnswerExist}=require("../middlewares/database/databaseErrorHelpers")

const router=express.Router({
    mergeParams:true //üst router daki paraması almamızı saglıyor
});

router.post("/",getAccessToRoute,addNewAnswerToQuestion)

router.get("/",getAllAnswerByQuestion)

router.get("/:answer_id",checkQuestionAndAnswerExist,getSingleAnswer)

router.get("/:answer_id/like",[checkQuestionAndAnswerExist,getAccessToRoute],likeAnswer)

router.get("/:answer_id/undolike",[checkQuestionAndAnswerExist,getAccessToRoute],undolikeAnswer)


router.put("/:answer_id/edit",[checkQuestionAndAnswerExist,getAccessToRoute,getAnswerOwnerAccess],editAnswer)

router.delete("/:answer_id/delete",[checkQuestionAndAnswerExist,getAccessToRoute,getAnswerOwnerAccess],deleteAnswer)
module.exports=router;

