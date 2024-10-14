import { User } from "../models/authModel/auth.model.js"

export const verifyEmail = async(req, res) => {
    try {
        const {token} = req.body

        const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}})
        console.log(token)

        if(!user){
            return res.status(401).json({message: "Invalid Token"})
        }

        user.isVerified = true
        user.verifyToken = undefined
        user.verifyTokenExpiry = undefined

        await user.save()

        return res.status(200).json({
            message: "User verified successfully",
            user
        })
        
    } catch (error) {
        console.log("Eror: " + error.message)
        res.status(500).json({message: "Internal server error"})
    }
}