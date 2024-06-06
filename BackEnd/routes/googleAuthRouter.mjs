import passport from 'passport'
import '../middleware/googleAuth.mjs'
import express from 'express'

const router = express.Router()

router
	.route('/google_auth')

	.get(passport.authenticate('google', { scope: ['profile', 'email'] }))
//callback
router.route('/google_auth/callback').get(async function (req, res, next) {
	const returnedFunction = passport.authenticate(
		'google',
		{},
		async (err, user) => {
			if (err) {
				res.status(400).json('Login Failed')
			}
			if (user) {
				await user.rotateToken(req, res, next)
				res.redirect('/')
			}
		}
	)
	await returnedFunction(req, res, next)
})

export default router
