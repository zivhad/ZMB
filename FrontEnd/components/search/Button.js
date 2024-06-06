import React from 'react'
import { useFormStatus } from 'react-dom'
import { forwardRef } from 'react'

const Button = forwardRef(({ children, onClick, ...rest }, ref) => {
	const { pending } = useFormStatus()

	return (
		<button ref={ref} className='form_button' {...rest}>
			{pending ? (
				<span className='submit-animation'> Submitting.... </span>
			) : (
				<span> Submit </span>
			)}
		</button>
	)
})

export default Button
