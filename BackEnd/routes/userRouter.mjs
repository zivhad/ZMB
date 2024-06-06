import express from 'express'
import User from '../models/User.mjs'
import Purchase from '../models/Purchase.mjs'

const router = express.Router()

router
	.route('/')

	.get(User.authenticateUser.call(User, true), (req, res, next) => {
		res.status(200).json('data')
	})
// router.route('/:token').get(User.verifyEmail.bind(User))

router.route('/signup').post(User.signUp.bind(User))
router.route('/login').post(User.login.bind(User))
router
	.route('/verifyEmail')
	.get(User.sendVerifyEmail)
	.post(User.verifyEmailCode)

export default router
