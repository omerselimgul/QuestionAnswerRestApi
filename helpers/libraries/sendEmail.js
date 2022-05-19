const nodemailer=require("nodemailer")

const sendEmail=async(mailOptoins)=>{
    let transporter=nodemailer.createTransport({
        host : process.env.SMTP_HOST,
        port : process.env.SMTP_PORT,
        auth :{
            user :process.env.SMTP_USER,
            pass:process.env.SMTP_PASS
        }
    });

    let info=await transporter.sendMail(mailOptoins);

    console.log(`messege sent : ${info.messageId}`);
}

module.exports=sendEmail;