import mongoose from 'mongoose'

const categorySchema = new mongoose.Schema({
	categories: { type: [String], default: ['Dark'] },
})

categorySchema.statics.addCategory = async function (req, res, next) {
	try {
		const catObj = await this.findOne().exec()

		await catObj.categories.push(req.body.category)

		const newCatObj = await catObj.save()

		return res.status(200).json(newCatObj)
	} catch (err) {
		console.log(err)
		next(err)
	}
}

categorySchema.statics.getCategories = async function (req, res, next) {
	try {
		const categoryObj = await this.findOne().exec()
		res.status(200).json(categoryObj.categories)
	} catch (err) {
		console.log(err)
		next(err)
	}
}

categorySchema.statics.deleteCategory = async function (req, res, next) {
	try {
		const categories = await this.findOne().exec()

		const newCategories = categories.categories.filter((i) => {
			return i !== req.body.name
		})

		categories.categories = newCategories
		const updated = await categories.save()

		res.status(200).json(updated)
	} catch (err) {
		console.log(err)
		next(err)
	}
}

export const Category = mongoose.model('Category', categorySchema)
