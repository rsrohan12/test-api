import nodemailer from "nodemailer"
import bcryptjs from "bcryptjs"
import { User } from "../models/authModel/auth.model.js"
import dotenv from "dotenv"
import { google } from "googleapis"

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

        const OAuth2 = google.auth.OAuth2
        const oauth2Client = new OAuth2(
            process.env.CLIENT_ID, // Your ClientID
            process.env.CLIENT_SECRET, // Your Client Secret
            process.env.REDIRECT_URI // Redirect URL (can use OAuth2 playground)
        );
        oauth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN,
        });

        const accessToken = await oauth2Client.getAccessToken();
        if (!accessToken || accessToken.token === null) {
            throw new Error("Failed to fetch access token");
        }

        console.log(emailId)

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: 'thakurrohan56778@gmail.com',
              clientId: process.env.CLIENT_ID,
              clientSecret: process.env.CLIENT_SECRET,
              refreshToken: process.env.REFRESH_TOKEN,
              accessToken: accessToken.token,
            },
        });

        const info = await transporter.sendMail({
            from: process.env.EMAIL_ID, // sender address
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