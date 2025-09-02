import  nodemailer ,  { Transporter }  from "nodemailer";

const config = {
    host  : "smtp.gmail.com",
    port : 465,
    secure :true,
    auth:{
       user : process.env.EMAIL_APP_ADDRESS,
       pass :process.env.EMAIL_APP_PASSWORD
    }
}

const transporter : Transporter = nodemailer.createTransport(config)


export default transporter