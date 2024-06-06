import mongoose from 'mongoose'
import CC from 'currency-converter-lt'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'

const currencyConverter = new CC({ from: 'USD', to: 'EUR' })

// beatSchema
const beatSchema = mongoose.Schema(
	{
		name: { type: String, required: true, unique: true },
		priceInUSD: { type: Number, required: true },
		priceInEUR: {
			type: Number,
			default: undefined,
		},
		YTid: { type: String, required: true },
		tags: {
			type: [String],
			required: true,
			select: true,
			default: ['exclusive'],
			enum: [
				'Dark',
				'Bright',
				'Boom-Bap',
				'Conscious',
				'Trap',
				'Aggressive',
				'Exclusive-Only',
			],
			index: true,
		},
		isExclusive: { type: Boolean, required: true, default: true },
		created: { type: Date, default: Date.now },
	},
	{
		toObject: { getters: true },
	}
)
//Plugin

// currency conversion virtual

// beatSchema.pre('find', async function () {
// 	return currencyConverter.convert(this.priceInUSD)
// })

// beatSchema.virtual('priceInEUR').get(function (cb) {
// 	currencyConverter.convert(this.priceInUSD).then((result) => {
// 		cb(result)
// 	})
// })

beatSchema.methods.setPriceInEUR = async function () {
	this.priceInEUR = await currencyConverter.convert(this.priceInUSD)
}

//getBeats static function

beatSchema.statics.getBeats = async function (options) {
	try {
		if (options.tags) {
			if (typeof options.tags === 'string') {
				options.tags = options.tags.split(',')
			}
			const data = await this.where('tags')
				.all(options.tags)
				.limit(options.limit)
				.exec()

			return data
		}

		if (options.beatsNames) {
			const data = await this.where('name').in(options.beatsNames).exec()

			if (data.length !== options.beatsNames.length) {
				throw new Error('invalid beat')
			}

			return data
		}
		const data = await this.find().limit(options.limit).exec()
		return data
	} catch (err) {
		throw err
	}
}

//addNewBeat static function

beatSchema.statics.addNewBeat = async function (req, res, next) {
	try {
		const newBeat = await this.create(req.body)
		return res.json(newBeat)
	} catch (err) {
		next(err)
	}
}
// pre saving exclusive in tags

beatSchema.pre('save', function (next) {
	this.wasNew = this.isNew
	next()
})

beatSchema.post('save', function (doc, next) {
	if (doc.wasNew && doc.isExclusive) {
		doc.tags.push('Exclusive-Only')
		doc.save()
	}
	next()
})

//post Find Objectify

// beatSchema.post('find', async (data) => {
// 	if (Array.isArray(data)) {
// 		const beatPromises = await data.map(async (beat) => {
// 			await beat.setPriceInEUR()
// 			const beatOject = beat.toObject()
// 			return beatOject
// 		})
// 		return await Promise.all(beatPromises)
// 	}
// 	return await data.setPriceInEUR().toObject()
// })

const Beat = mongoose.model('Beat', beatSchema)
export default Beat
