const express=require('express')
const auth=require("../controllers/auths")
const getAccessToRoute=require("../middlewares/authorization/auth")
const profileImageUpload=require("../middlewares/libraries/profileImageUpload")
//Api/auth
const router=express.Router();

router.get("/",(req,res)=>{
    res.send("Auth Home Page")
})

router.get("/profile",getAccessToRoute.getAccessToRoute,auth.getUser)


router.get("/logout",getAccessToRoute.getAccessToRoute,auth.logout)
router.post("/login",auth.login)

router.post("/register",auth.register)
router.post("/upload",
[getAccessToRoute.getAccessToRoute,profileImageUpload.single("profile_image")],
auth.imageUpload)

router.post("/forgotpassword",auth.forgotPassword)

router.put("/resetpassword",auth.resetPassword);

router.put("/edit",getAccessToRoute.getAccessToRoute,auth.editDetails)
module.exports=router;
