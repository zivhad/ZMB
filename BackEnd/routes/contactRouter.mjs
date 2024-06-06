import User from '../models/User.mjs'
import express from 'express'
const router = express.Router()

router.route('/').post(User.contact.bind(User))

export default router
