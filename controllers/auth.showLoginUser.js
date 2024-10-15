import { User } from "../models/authModel/auth.model.js"
import { getDatafromToken } from "../utils/getDatafromToken.js"

export const showUser = async(req, res) => {
    try {
        const userId = getDatafromToken(req)
        console.log("Login User's id:", userId)
        const user = await User.findOne({_id: userId}).select("-password")

        if(!user){
            return res.status(401).json({message: "User not found"})
        }

        return res.status(200).json({
            message: "User found",
            user
        })
    } catch (error) {
        console.log("Eror: " + error.message)
        res.status(500).json({message: "Internal server error"})
    }
}