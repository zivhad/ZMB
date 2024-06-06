import mongoose from 'mongoose'
import Stripe from 'stripe'
import jwt from 'jsonwebtoken'
import Beat from './Beat.mjs'
import Coupon from './Coupon.mjs'

const stripe = Stripe(process.env.STRIPE_SECRET)

const purchaseSchema = new mongoose.Schema({
	sum: { type: Number, required: true, trim: true },
	currency: { type: String, enum: ['EUR', 'USD'], required: true },
	user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	beats: {
		type: [
			{
				beat: { type: mongoose.Schema.ObjectId, ref: 'Beat' },

				price: Number,
				exclusive: Boolean,
			},
		],
		validate: {
			validator: function (beats) {
				return beats.length !== 0
			},
			message: 'beats are required',
		},
	},
	coupons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' }],
})

//create purchase
purchaseSchema.statics.addPurchase = async function (req, res, next) {
	try {
		const purchaseDetails = jwt.verify(
			req.cookie.purchaseDetails,
			process.env.PURCHASE_DETAILS_SECRET
		)
		res.status(200).json(purchaseDetails)
		// const newPurchase = await this.create(req.body)

		res.status(200).json(newPurchase)
	} catch (err) {
		console.log(err)
		next(err)
	}
}
//get purchases

purchaseSchema.statics.getPurchases = async (req, res, next) => {
	try {
		this.find()
	} catch (err) {
		console.log(err)
		next(err)
	}
}
// create payment intent
purchaseSchema.statics.createPaymentIntent = async (req, res, next) => {
	try {
		const beats = await Beat.getBeats(req.body)

		if (!beats) {
			throw new Error('no beats found')
		}

		const fullCost =
			(await beats.reduce(async (accumulator, beat) => {
				const price = await beat[`priceIn${req.body.currency}`]
				return (await accumulator) + price
			}, 0)) * 100

		const { amount: couponPercent } = await Coupon.getCoupons(req, res, next)
		let total = fullCost
		if (couponPercent) {
			total -= (fullCost * couponPercent) / 100
		}

		const paymentIntent = await stripe.paymentIntents.create({
			amount: total,
			currency: req.body.currency,
		})
		const purchaseDetails = jwt.sign(
			req.body,
			process.env.PURCHASE_DETAILS_SECRET
		)
		res.cookie('purchaseDetails', purchaseDetails, {
			maxAge: 900000000000000,
			HttpOnly: true,
			secure: true,
		})
		res.send({
			clientSecret: paymentIntent.client_secret,
		})
	} catch (err) {
		console.log(err)
		next(err)
	}
}

//export
const Purchase = mongoose.model('Purchase', purchaseSchema)

export default Purchase
