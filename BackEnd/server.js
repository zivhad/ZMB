import { fileURLToPath } from 'url'

import path from 'path'
import 'dotenv/config'
import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import https from 'https'
import fs from 'fs'
import crypto from 'crypto'
import googleAuthRouter from './routes/googleAuthRouter.mjs'
//Models
import User from './models/User.mjs'
//Middleware
import errorHandler from './middleware/errorHandler.mjs'

//router's import
import purchaseRouter from './routes/purchaseRouter.mjs'
import couponsRouter from './routes/couponsRouter.mjs'
import beatsRouter from './routes/beatsRouter.mjs'
import usersRouter from './routes/userRouter.mjs'
import categoriesRouter from './routes/categoriesRouter.mjs'
import contactRouter from './routes/contactRouter.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

mongoose.connect(process.env.MONGO_URL).catch((error) => console.log(error))

const app = express()
// General Middleware

app.use(cors())
app.use(express.json())
app.use(cookieParser())

//use routs
app.use('/api/contact', contactRouter)
app.use(express.static(`${__dirname}/public`))
app.use(googleAuthRouter)
app.use('/api/beats', beatsRouter)
app.use('/api/coupons', couponsRouter)
app.use('/api/users', usersRouter)
app.use('/api/purchase', purchaseRouter)
app.use('/api/categories', categoriesRouter)
app.get('/email', (req, res, next) => {
	res.sendFile(`${__dirname}/utils/email-template.html`)
})

app.get('/', User.authenticateUser(), (req, res) => {
	return res.json(req.cookies)
})

// error handling

app.use(errorHandler)

//404

app.all('*', (req, res, next) => {
	{
		res.status(404).json('Not Found')
	}
})

mongoose.connection.on('connected', () => {
	app.listen(3500, () => {
		console.log('Server Is Running On Port 3500...')
	})
})

mongoose.connection.on('error', (err) => {
	console.log(err)
})
