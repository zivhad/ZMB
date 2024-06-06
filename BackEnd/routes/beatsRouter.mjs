import express from 'express'
import Beat from '../models/Beat.mjs'

const router = express.Router()

router
	.route('/')
	.get(async function (req, res, next) {
		try {
			const data = await Beat.getBeats.call(Beat, req.query)

			res.status(200).json(data)
		} catch (err) {
			console.log(err)
			next(err)
		}
	})
	.post(Beat.addNewBeat.bind(Beat))

export default router
