import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
	service: 'Gmail',
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: 'zivmakesbeats@gmail.com',
		pass: process.env.NODEMAILER_PASSWORD,
	},
})

export default transporter
