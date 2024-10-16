import jwt from "jsonwebtoken"
import dotenv from "dotenv" 

dotenv.config()

export const getDatafromToken = (req) => {
    try {
        const token = req.cookies?.token || ""; // access the token from cookies if available
        console.log("Token: ", token)
        //console.log(process.env.TOKEN_SECRET)

        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET)
        return decodedToken._id
    } catch (error) {
        console.log("Eror: " + error.message)
    }
}