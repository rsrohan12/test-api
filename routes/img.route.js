import express from "express";
import multer from "multer";
import { imgPath } from "../controllers/img.controller.js";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads"); // Specify the folder to save images
},
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique name for each image
},
});

const upload = multer({ storage: storage });

router.post("/upload", upload.array("images", 3), imgPath)

export default router