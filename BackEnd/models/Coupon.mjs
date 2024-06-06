import mongoose from 'mongoose'

const couponSchema = mongoose.Schema({
	name: { type: String, required: true },
	amount: { type: Number, required: true },
	expireAt: { type: Date, expires: 0, required: true },
})

//addNewCoupon static method

couponSchema.statics.addNewCoupon = async function (req, res, next) {
	try {
		const data = await this.create(req.body)

		return res.status(200).json(data)
	} catch (err) {
		console.log(err)
		next(err)
	}
}

// getCoupons static method

couponSchema.statics.getCoupons = async function (req, res, next) {
	try {
		const data = req.body.couponName
			? await this.findOne({ name: req.body.couponName }).lean().exec()
			: await this.find().lean().exec()
		return data
	} catch (err) {
		console.log(err)
		next(err)
	}
}

const Coupon = mongoose.model('Coupon', couponSchema)

export default Coupon
