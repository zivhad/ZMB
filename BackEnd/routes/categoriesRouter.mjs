import express from 'express'
import { Category } from '../models/Category.mjs'

const router = express.Router()

router
	.route('/')
	.post(Category.addCategory.bind(Category))
	.get(Category.getCategories.bind(Category))
	.delete(Category.deleteCategory.bind(Category))

export default router
