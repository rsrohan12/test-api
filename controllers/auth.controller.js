import bcryptjs from "bcryptjs";
import { User } from "../models/authModel/auth.model.js";
import brcyptjs from "bcryptjs"

export const signup = async(req, res) => {

    try {
        const {name, email, password} = req.body
        const user = await User.findOne({email})

        if(user){
            return res.status(400).json({message: "User already exists"})
        }

        const hashPassword = await brcyptjs.hash(password, 10)

        const newUser = new User({
            name: name,
            email: email,
            password: hashPassword
        })
        await newUser.save()

        return res.status(201).json({
            message: "User created successfully",
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
            }
        })

    } catch (error) {
        console.log("Eror: " + error.message)
        res.status(500).json({message: "Internal server error"})
    }
}

export const login = async(req, res) => {
    try {
        const {email, password} = req.body
        
        const user = await User.findOne({email})
        const isMatch = await bcryptjs.compare(password, user.password)
        if(!user || !isMatch){
            return res.status(400).json({message: "Invalid username or password"})
        }

        return res.status(200).json({
            message: "User Loggedin successfully",
            user: {
                _id: user._id,
                email: user.email
            }
        })


    } catch (error) {
        console.log("Eror: " + error.message)
        res.status(500).json({message: "Internal server error"})
    }

    
}