import transporter from '../utils/nodeMailer.mjs'
import { html } from '../utils/verificationEmail.mjs'
import { replaceHtml } from '../utils/replaceHtml.mjs'
import jwt from 'jsonwebtoken'
import { userSchema } from './User.mjs'

// Sign-up
userSchema.statics.signUp = async function (req, res, next) {
	try {
		jwt.verify(req.cookie.emailJWT, process.env.EMAILJWT_SECRET)
		const newUser = await this.create(req.body)
		const newUserObject = newUser.toObject()
		delete newUserObject.password
		const token = jwt.sign(
			{ username: newUser.username },
			process.env.VERIFICATION_TOKEN_SECRET_KEY,
			{ expiresIn: 30 * 60 }
		)

		const mailOptions = {
			from: 'me <zivmakesbeats@gmail.com>',
			to: newUser.email,
			subject: 'Hello from Nodemailer',
			html: await replaceHtml(html, [
				['URL', `${process.env.DOMAIN}/api/users/${token}`],
			]),
		}

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.error('Error sending email: ', error)
			} else {
				console.log('Email sent: ', info.response)
			}
		})

		res.status(200).json(newUserObject)
	} catch (err) {
		next(err)
	}
}
