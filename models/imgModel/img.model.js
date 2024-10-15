import mongoose from "mongoose";
import { User } from "../authModel/auth.model.js";

const imageSchema = mongoose.Schema({
    imageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    name: String,
    
    imgPaths: [String]
})

export const ImageModel = mongoose.model("Image", imageSchema)