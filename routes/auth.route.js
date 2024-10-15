import express from "express";
import { allUsers, dataUpdate, deleteUser, login, signup } from "../controllers/auth.controller.js";
import { verifyEmail } from "../controllers/auth.verifyemail.js";
import { logout } from "../controllers/auth.logout.js";
import { showUser } from "../controllers/auth.showLoginUser.js";

const router = express.Router();

router.post("/signup", signup)
router.post("/login", login)
router.put("/update/:id", dataUpdate)
router.get("/allUsers", allUsers)
router.delete("/deleteUser/:id", deleteUser)
router.post("/verifyemail", verifyEmail)
router.get("/logout", logout)
router.get("/userInfo", showUser)

export default router