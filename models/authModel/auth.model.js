import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:
    {
        type: String,
        required: true
    },

    email:
    {
        type: String,
        required: true,
        unique: true
    },

    password: 
    {
        type: String,
        required: true
    },

    isVerified :
    {
        type: Boolean,
        default: false
    },

    verifyToken: String,
    verifyTokenExpiry: Date

}, {timestamps: true});

export const User = mongoose.model("User", userSchema)

//export default User;