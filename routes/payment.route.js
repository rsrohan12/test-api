import express from "express";
import { transaction, transactionAccept } from "../controllers/payment.controller.js";

const router = express.Router()

router.post("/create-payment-intent", transaction)
router.post("/confirm-payment", transactionAccept)

export default router