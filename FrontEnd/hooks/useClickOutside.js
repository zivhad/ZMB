'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

const useOutsideClick = (callback) => {
	const ref = React.useRef()
	const router = useRouter()

	React.useEffect(() => {
		const handleClick = (event) => {
			console.log(event)

			if (event.target.localName === 'a') {
				return router.push(event.target.href)
			}
			if (
				event.target.classList.contains('modal') ||
				event.target.form ||
				event.target.className === 'x-mark'
			) {
				return
			}
			if (ref.current && !ref.current.contains(event.target)) {
				callback()
				console.log(event)
			}
		}

		document.addEventListener('click', handleClick)

		return () => {
			document.removeEventListener('click', handleClick)
		}
	}, [ref])

	return ref
}

export default useOutsideClick
