import express from 'express'
import Purchase from '../models/Purchase.mjs'

const router = express.Router()

router.route('/').post(Purchase.addPurchase.bind(Purchase))
router.route('/create-payment-intent').post(Purchase.createPaymentIntent)

export default router
