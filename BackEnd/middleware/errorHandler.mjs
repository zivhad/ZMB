const errorHandler = (err, req, res, next) => {
	//validation error

	if (err.name === 'ValidationError') {
		for (const error in err.errors) {
			res.status(422).json(err.errors[error].message)
		}
	}
	//duplicate key error
	if (err.message.includes('duplicate key')) {
		for (const field in err.keyValue) {
			res
				.status(409)
				.json(
					`${field} '${err.keyValue[field]}' already exists please try another one`
				)
		}
	}

	if (err.name === 'TokenExpiredError') {
		console.log('Token Expired eh')
		return res.redirect('/login')
	}
	const status = err.status || 500
	res.status(status).json(err.message)
}

export default errorHandler
