import mongoose from 'mongoose'
import transporter from '../utils/nodeMailer.mjs'
import { html } from '../utils/verificationEmail.mjs'
import { replaceHtml } from '../utils/replaceHtml.mjs'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
// import { error } from 'console'
import { templateHtml } from '../utils/email-template.mjs'
//Validation

const validateEmail = function (email) {
	const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
	return regex.test(email)
}

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, default: undefined, unique: true },
	password: {
		type: String,
		required: true,
		default: undefined,
		select: false,
		match: [
			/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,18}$/g,
			'Please Enter a Valid Password',
		],
	},
	email: {
		type: String,
		required: true,
		unique: true,
		match: [
			/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g,
			'Please Enter a Valid Email Address',
		],
	},
	isVerified: { type: Boolean, default: false },
	createdOn: { type: Date, default: Date.now },
	purchases: { type: [mongoose.Schema.Types.ObjectId], ref: 'Purchases' },
	isAdmin: { type: Boolean, value: false },
	refreshToken: { type: String },
})

//TTL Index

userSchema.index(
	{ createdOn: 1 },
	{ expireAfterSeconds: 30, partialFilterExpression: { isVerified: false } }
)

//Pre-Save__Password-Hash

userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) return next()

	this.password = await bcrypt.hash(this.password, 8)
	next()
})

//contact email

userSchema.statics.contact = async function (req, res, next) {
	const replacedHtml = await replaceHtml(templateHtml, [
		[
			'MESSAGE',
			` from: ${req.body.email}<br></br><br></br>${req.body.message}`,
		],
	])
	try {
		const toAdminOptions = {
			from: `${req.body.name} <${req.body.email}>`,
			to: ' zivmakesbeats@gmail.com',
			subject: 'Contact-us',
			html: replacedHtml,
			attachments: [
				{
					filename: 'z.m.b-01.png',
					path: './public/z.m.b-01.png',
					cid: 'z.m.b-01.png',
				},
			],
		}
		///to client
		const clientMailOptions = {
			from: ' zivmakesbeats<zivmakesbeats@gmail.com>',
			to: req.body.email,
			subject: 'Message sent',
			html: replaceHtml(templateHtml, [
				[
					'MESSAGE',
					'Thank you for messaging us, we will get back to you soon.',
				],
			]),
			attachments: [
				{
					filename: 'z.m.b-01.png',
					path: './public/z.m.b-01.png',
					cid: 'z.m.b-01.png',
				},
			],
		}
		const sent = await transporter.sendMail(toAdminOptions)
		const clientSent = await transporter.sendMail(clientMailOptions)

		if (sent.accepted) {
			return res.status(200).json({ sent, clientSent })
		}
		throw new Error("email didn't send")
	} catch (err) {
		next(err)
	}
}

// sendVerifyEmail
userSchema.statics.sendVerifyEmail = async function (req, res, next) {
	try {
		const code = crypto.randomBytes(10).toString('hex')
		const token = jwt.sign(
			{ email: req.body.email, code: code },
			process.env.EMAILJWT_SECRET
		)

		const mailOptions = {
			from: 'me <zivmakesbeats@gmail.com>',
			to: req.body.email,
			subject: 'Email code',
			html: `<h1>${code}</h1>`,
		}

		transporter.sendMail(mailOptions, (error, info) => {
			if (error) {
				console.error('Error sending email: ', error)
			} else {
				res.cookie('emailVerificationJWT', token, {
					httpOnly: true,
					maxAge: 1800000,
				})
				console.log('Email sent: ', info.response)
				res.status(200).json('emailsent')
			}
		})
	} catch (error) {
		console.log(error)
		res.status(400).json(err)
	}
}
//verify email code

userSchema.statics.verifyEmailCode = async function (req, res, next) {
	try {
		const JwtFromCookie = req.cookies.emailVerificationJWT
		const objFromJwt = jwt.verify(JwtFromCookie, process.env.EMAILJWT_SECRET)
		if (objFromJwt.code !== req.body.code) {
			throw new Error(`Code Doesn't Match`)
		}

		const token = jwt.sign(
			{ ...objFromJwt, isEmailVerified: true },
			process.env.EMAILJWT_SECRET
		)

		await res.cookie('emailVerificationJWT', token, {
			httpOnly: true,
			maxAge: 1800000,
		})
		res.status(200).json('code verified')
	} catch (err) {
		console.log(err)
		next(err)
	}
}

// Sign-up
userSchema.statics.signUp = async function (req, res, next) {
	try {
		const tokenFromCookie = req.cookies.emailVerificationJWT
		const objFromJwt = jwt.verify(tokenFromCookie, process.env.EMAILJWT_SECRET)
		if (!objFromJwt.isEmailVerified) {
			throw new Error('please verify your email')
		}
		if (objFromJwt.email !== req.body.email) {
			throw new Error('the email verified dose not match the email submitted')
		}
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
//Verify Email

// userSchema.statics.verifyEmail = async function (req, res, next) {
// 	try {
// 		const token = req.params.token
// 		const decoded = jwt.verify(token, process.env.VERIFICATION_TOKEN_SECRET_KEY)
// 		const user = await this.findOne({ username: decoded.username }).exec()
// 		user.isVerified = true
// 		await user.rotateToken(req, res, next)
// 		await user.save()
// 		res.end()
// 	} catch (err) {
// 		console.log(err)
// 		next(err)
// 	}
// }
//Authenticate User

userSchema.statics.authenticateUser = function (isAdmin = false) {
	return async (req, res, next) => {
		try {
			const accessToken = await req.cookies.accessToken
			if (!accessToken) {
				return res.redirect('/login')
			}

			jwt.verify(
				accessToken,
				process.env.ACCESS_TOKEN_SECRET_KEY,
				async (err, decoded) => {
					try {
						if (err?.name === 'TokenExpiredError') {
							const refreshToken = req.cookies.refreshToken
							if (!refreshToken) {
								return res.redirect('/login')
							}

							const decoded = jwt.verify(
								refreshToken,
								process.env.REFRESH_TOKEN_SECRET_KEY
							)
							const username = decoded.username
							const user = await this.findOne({ username }).exec()
							if (refreshToken !== user.refreshToken) {
								return res.status(401).json('none equal refresh token')
							}
							await user.rotateToken(req, res, next)
							console.log('authed')
							return next()
						}

						const username = decoded.username
						if (isAdmin && !decoded.isAdmin) {
							return res.status(401).json(`Admin's Access Only `)
						}
						const user = await this.findOne({ username }).exec()
						console.log('authed')

						return next()
					} catch (err) {
						next(err)
					}
				}
			)
		} catch (err) {
			console.log(err)
			next(err)
		}
	}
}
//login
userSchema.statics.login = async function (req, res, next) {
	const email = req.body.email
	const password = req.body.password
	if (!email || !password) {
		return res.status(400).json('All Fields Are Required')
	}
	const user = (await this.findOne({ email }).select('password').exec()) || {
		password: '',
	}
	const passwordIsValid = await bcrypt.compare(password, user.password)
	if (!user || !passwordIsValid) {
		return res.status(400).json('Wrong Email Or PassWord')
	}
	await user.rotateToken(req, res, next)
	res.status(200).json('logging in')
}

// rotate token method
userSchema.methods.rotateToken = async function (req, res, next) {
	const refreshToken = jwt.sign(
		{ username: this.username, isAdmin: this.isAdmin },
		process.env.REFRESH_TOKEN_SECRET_KEY,
		{ expiresIn: '7d' }
	)

	this.refreshToken = refreshToken
	await this.save()
	res.cookie('refreshToken', refreshToken, {
		maxAge: 900000000000000,
		HttpOnly: true,
		secure: true,
	})

	const accessToken = jwt.sign(
		{ username: this.username },
		process.env.ACCESS_TOKEN_SECRET_KEY,
		{ expiresIn: 40 }
	)
	return res.cookie('accessToken', accessToken, {
		maxAge: 900000000000000,
		HttpOnly: true,
		secure: true,
	})
}

const User = mongoose.model('User', userSchema)

export default User
