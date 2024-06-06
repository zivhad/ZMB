import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth2'
import User from '../models/User.mjs'
import generatePassword from 'generate-password'

const password = generatePassword.generate({
	length: 18,
	numbers: true,
})

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: `${process.env.DOMAIN}/google_auth/callback`,
			passReqToCallback: true,
		},
		async function (request, accessToken, refreshToken, profile, cb) {
			try {
				const user = await User.findOne({
					email: profile.emails[0].value,
				}).exec()

				if (!user) {
					user = await User.create({
						username: profile.displayName,
						email: profile.emails[0].value,
						isVerified: profile.emails[0].verified,
						password,
					})
				}

				return await cb(null, user)
			} catch (err) {
				cb(err, null)
			}
		}
	)
)
