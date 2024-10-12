import express from "express";
import { allUsers, dataUpdate, login, signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.put("/update/:id", dataUpdate)
router.get("/allUsers", allUsers)

export default router