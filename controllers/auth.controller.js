import bcryptjs from "bcryptjs";
import { User } from "../models/authModel/auth.model.js";
import brcyptjs from "bcryptjs"

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
            id: _id,
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

// login the user
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

