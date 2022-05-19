const User = require("../models/user.js")
const CustomError = require("../helpers/error/CustomError")
const asyncHandler = require("express-async-handler");
const user = require("../models/user.js");

const blockUser=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;

    const user=await User.findById(id);

    user.blocked=!user.blocked;

    await user.save();
    return res.status(200).json({
        success:true,
        messega:"Kardeşim banlandın !"
    })
})
const deleteUser=asyncHandler(async(req,res,next)=>{
    const {id}=req.params;
    const user=await User.findById(id);

    await user.remove();

    return res.status(200).json({
        succes:true,
        messega : "Delete Operation Succesful"
    })
})
module.exports={
    blockUser,deleteUser
}