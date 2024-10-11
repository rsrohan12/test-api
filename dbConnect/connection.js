import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const URI = process.env.MONGODB_URI


export const mongoDB = async() => {
    try {
        await mongoose.connect(URI);
        console.log("Connected to database")
    } catch (error) {
        console.log("Error:", error)
    }
}