import { getDatafromToken } from "../utils/getDatafromToken.js";
import { User } from "../models/authModel/auth.model.js";
import { ImageModel } from "../models/imgModel/img.model.js";

export const imgPath = async(req, res) => {
    try {
        const userId = getDatafromToken(req)
        const user = await User.findOne({_id: userId})

        if(!user){
            return res.status(400).json({
                message: "User not found"
            })
        }

        const files = req.files

        if(!files || files.length === 0){
            return res.status(400).json({message: "Please upload atleast one image"})
        }

        const imagePaths = files.map((file) => file.path) // each file path

        const data = await ImageModel.findOne({imageId: userId})

        if(!data){
            const newImgUser = new ImageModel({
                imageId: user._id,
                name: user.name,
                imgPaths: imagePaths
            })
 
            await newImgUser.save()

            return res.status(200).json({
                message: "Image uploaded successfully",
                newImgUser
            })
        }

        data.imgPaths.push(...imagePaths) // To add individual elements from imagePaths to data.imgPaths
        await data.save()

        return res.status(200).json({
            message: "Image uploaded successfully",
            data
        })

    } catch (error) {
        console.log("Eror: " + error.message)
        res.status(500).json({message: "Internal server error"})
    }
}
