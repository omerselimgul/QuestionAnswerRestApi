const express=require("express");
const authorization=require("../middlewares/authorization/auth")
const chechuser=require("../middlewares/database/databaseErrorHelpers")
const Admin=require("../controllers/admin")
const router=express.Router();

router.use([authorization.getAccessToRoute,authorization.getAdminAccess])


router.get("/",(req,res,next)=>{
    res.status(200).json({
        success:true,
        message:"admin page"
    })
})

router.get("/block/:id",chechuser.checkUserExist,Admin.blockUser)

router.delete("/user/:id",chechuser.checkUserExist,Admin.deleteUser)
//Block User
//DeleteUser








module.exports=router;
