const mongooose=require('mongoose')

const connectDatabase=()=>{
    mongooose.connect(process.env.MONGO_URL)
    .then((result) => {
        console.log("mongo db connection sucessful")
    }).catch((err) => {
        console.log(err)
    });
}


module.exports={connectDatabase};