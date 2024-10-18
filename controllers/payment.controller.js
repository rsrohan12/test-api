// payment gateway integration using stripe (only testing)

import Stripe from "stripe"
import { User } from "../models/authModel/auth.model.js"
import { getDatafromToken } from "../utils/getDatafromToken.js"
import { paymentModel } from "../models/paymentModel/payment.model.js"
import dotenv from "dotenv" 

dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const transaction = async(req, res) => {

    const {amount, currency} = req.body

    try {
        // check for login first 
        const userId = getDatafromToken(req)
        const user = await User.findOne({_id: userId})

        if(!user){
            return res.status(401).json({message: "First login yourself to proceed the payment"})
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100, // Convert to smallest currency unit (cents for USD)
            currency: currency || 'usd',
            payment_method: 'pm_card_visa',
            automatic_payment_methods: {
                enabled: true,  // Automatically handle payment methods like cards
                allow_redirects: 'never' // Disallow redirect-based payment methods
            }
        });

        // Step 2: Store payment intent details in MongoDB
        const newPayment = new paymentModel({
            paymentIntentId: paymentIntent.id,
            customer_name: user.name,
            amount: amount,
            currency: currency || 'usd',
            status: paymentIntent.status,
        });

        await newPayment.save();

        return res.status(200).json({
            success: true,
            paymentIntentId: paymentIntent.id,
            customer_name: newPayment.customer_name,
            clientSecret: paymentIntent.client_secret,
        })
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).send({ success: false, error: error.message });
    }
}

export const transactionAccept = async(req, res) => {
    const { paymentIntentId } = req.body;

    try {
         // Step 1: Confirm the payment intent
        const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);

        // Step 2: Update payment status in MongoDB
        await paymentModel.findOneAndUpdate(
            { paymentIntentId: paymentIntentId },
            { status: confirmedPaymentIntent.status }
        );

        res.status(200).json({
            success: true,
            confirmedPaymentIntent,
        });
    } catch (error) {
        console.error('Error confirming payment intent:', error);
        res.status(500).send({ success: false, error: error.message });
    }
}