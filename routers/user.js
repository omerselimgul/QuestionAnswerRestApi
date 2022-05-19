const express=require("express");
const use=require("../controllers/user.js")
const errorHelpers=require("../middlewares/database/databaseErrorHelpers.js")
const User=require("../models/user")
const {
    userQueryMiddleware
}=require("../middlewares/query/userQueryMiddleware");
const user = require("../models/user.js");
const router=express.Router();


router.get("/",userQueryMiddleware(User),use.getAllUsers)

router.get("/:id",errorHelpers.checkUserExist,use.getSingleUSer)
module.exports=router;