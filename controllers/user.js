const User=require("../models/user")
const CustomError = require("../helpers/error/CustomError")
const asyncHandler = require("express-async-handler");
const user = require("../models/user");
const { json } = require("express");
const { disable } = require("express/lib/application");
const { db } = require("../models/user");


const getSingleUSer= asyncHandler( async (req,res,next)=>{
    const {id}=req.params;

    const user=await User.findById(id);

    return res.status(200).json({
        success:true,
        data:user
    })
})

const getAllUsers=asyncHandler( async (req,res,next)=>{

    return res.status(200).json(res.queryResult)
})
module.exports={
    getSingleUSer,
    getAllUsers
}

