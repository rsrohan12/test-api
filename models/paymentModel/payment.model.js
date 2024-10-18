import mongoose from "mongoose";

export const paymentSchema = mongoose.Schema({
    paymentIntentId: {
        type: String,
        required: true
    },
    customer_name: {
        type: String,
        ref: "User"
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'usd'
    },
    status: {
        type: String,
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

export const paymentModel = mongoose.model("Transaction", paymentSchema)