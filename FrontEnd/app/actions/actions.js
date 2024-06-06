'use server'

export const submitContactForm = async function (data) {
	try {
		const name = data.get('name')
		const message = data.get('message')
		const email = data.get('email')
		const valid =
			/^[\w\.]+@([\w-]+\.)+[\w]{2,4}$/.test(email) &&
			/^.{40,250}$/.test(message) &&
			/^([a-zA-Z]{2,10})(\s[a-zA-Z]{2,10})?$/.test(name)
		if (!valid) {
			return 'Please make sure all fields are valid'
		}
		const fetched = await fetch(process.env.API_BASE_URL + '/contact', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, message, email }),
		})

		if (fetched.ok) return 'message sent'
		throw new Error()
	} catch (e) {
		return 'Something went wrong please try again'
		console.log(e)
	}
}

export const getBeats = async function (tags) {
	try {
		const res = await fetch(`${process.env.API_BASE_URL}`, {
			body: tags,
		})
		if (!res.ok) {
			throw new Error("couldn't get beats from server ")
		}
		const beats = await res.json()
		return beats
	} catch (err) {
		throw err
	}
}

export const getCategories = async () => {
	try {
		const res = await fetch(`${process.env.API_BASE_URL}/categories`)
		const categories = await res.json()
		return categories
	} catch (error) {
		throw new Error(error)
	}
}
