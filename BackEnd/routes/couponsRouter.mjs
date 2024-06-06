import express from 'express'
import Coupon from '../models/Coupon.mjs'
const router = express.Router()

router
	.route('/')
	.post(Coupon.addNewCoupon.bind(Coupon))
	.get(Coupon.getCoupons.bind(Coupon))
	.put(async (req, res, next) => {
		try {
			console.log({ name: 'ziv' })

			const [coupon] = await Coupon.findOneAndUpdate({
				name: req.body.name,
			}).exec()
			console.log(coupon)

			if (!coupon) {
				throw new Error('No Coupon Found')
			}
			{
				expireAt: req.body.expireAt || Date.now()
			}
			const updated = await coupon.save()
			res.status(200).json(updated)
		} catch (err) {
			console.log(err)
			next(err)
		}
	})

export default router
