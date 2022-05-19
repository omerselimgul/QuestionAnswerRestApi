const express=require("express");
const dotenv=require("dotenv");
const routers=require("./routers/index") 
const connectDB=require("./helpers/database/connectDatabase")
const customErrorHandler=require("./middlewares/errors/customErrorHandlers")
const path=require("path")

dotenv.config({
    path:"./config/env/config.env"
})

//Mongo Db coonection
connectDB.connectDatabase();


const app=express();
app.use(express.json());
//Environment Variables
const PORT = process.env.PORT;

// Routers MiddleWare

app.use("/api",routers);

//express Body Middleware

//error handler

//Static Files
app.use(express.static(path.join(__dirname,"public")))

app.use(customErrorHandler.customErrorHandler)
app.listen(PORT,()=>{
    console.log(`app started on ${PORT} : ${process.env.NODE_ENV}`);
})
