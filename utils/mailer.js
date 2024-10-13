import nodemailer from "nodemailer"
import bcryptjs from "bcryptjs"
import { User } from "../models/authModel/auth.model.js"
import dotenv from "dotenv"

dotenv.config()

export const sendMail = async({emailId, emailType, userId}) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10)

        if(emailType == "VERIFY"){
            const user = await User.findById(userId)

            if(user){
                user.verifyToken = hashedToken
                user.verifyTokenExpiry = Date.now() + 3600000
                await user.save()
            }
        }

        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: "ea883b67ce3fa0",
              pass: "53e9f634ba1277"
            }
        });
        console.log(emailId);

        const info = await transporter.sendMail({
            from: 'thakurrohan56778@gmail.com', // sender address
            to: emailId, // list of receivers
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your Password", // Subject line
            text: "Hello world?", // plain text body
            html: `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : ""}
            or copy and paste the link below in your browser. <br> ${process.env.DOMAIN}/verifyemail?token=${hashedToken}
            </p>` // html body
        });

        return info

    } catch (error) {
        console.log("Eror: " + error.message)
    }
}