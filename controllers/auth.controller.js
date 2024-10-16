import bcryptjs from "bcryptjs";
import { User } from "../models/authModel/auth.model.js";
import brcyptjs from "bcryptjs"
import { sendMail } from "../utils/mailer.js";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

// creating the user
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
        console.log(newUser)

        // verify email
        await sendMail({emailId: email, emailType: "VERIFY", userId: newUser._id})

        return res.status(201).json({
            message: "User created successfully",
            user: newUser
        })

    } catch (error) {
        console.log("Eror: " + error.message)
        res.status(500).json({message: "Internal server error"})
    }
}

// login the user
export const login = async(req, res) => {
    try {
        const {email, password} = req.body
        
        const user = await User.findOne({email})
        const isMatch = await bcryptjs.compare(password, user.password)
        if(!user || !isMatch){
            return res.status(400).json({message: "Invalid username or password"})
        }

        const tokenData = {
            _id: user._id,
            name: user.name,
            email: user.email
        }

        // create jwt token
        const JWTtoken = jwt.sign(tokenData, process.env.TOKEN_SECRET, {expiresIn: "1d"})

        res.cookie("token", JWTtoken, {
            httpOnly: true,
            secure: true
        })

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

// update the user
export const dataUpdate = async(req, res) => {
    try {
        const {id} = req.params
        const{name, email, password} = req.body

        const user = await User.findById(id)

        if (user) {
            user.name = name || user.name // Keep the old name if no new one is provided
            user.email = email || user.email // Keep the old email if no new one is provided
            if(password){
                const hashPassword = await brcyptjs.hash(password, 10)
                user.password = hashPassword
            }
             // Keep the old password if no new one is provided
            
            const updatedUser = await user.save()

            return res.status(201).json({
                message: "User updated successfully",
                user: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                }
            })
        } else {
            return res.status(400).json({message: "User does not exist"})
        }

        
    } catch (error) {
        console.log("Eror: " + error.message)
        res.status(500).json({message: "Internal server error"})
    }

}

// get all the users
export const allUsers = async(req, res) => {
    try {
        const users = await User.find()
        return res.status(200).json(users)
    } catch (error) {
        console.log("Eror: " + error.message)
        res.status(500).json({message: "Internal server error"})
    }
}

// delete the user
export const deleteUser = async(req, res) => {
    try {
        const {id} = req.params
        
        const deletedUser = await User.findByIdAndDelete(id);
        
        if (deletedUser) {
          res.status(200).json(
            {
                message: "User deleted successfully",
                user: deletedUser 
            });
        } else {
          res.status(404).json({ message: "User not found" });
        }
    } 
        catch (error) {
        console.log("Eror: " + error.message)
        res.status(500).json({message: "Internal server error"})
    }

}
