import React, { useState, useContext, useRef, useEffect } from 'react'
import LoadingSpinner from '@/components/LoadingSpinner'
import CheckMark from '@/public/svg/CheckMark'

import { onInputFocusContext } from '@/app/@modal/contact/page'

const Input = ({
	addStateFunc,
	validationDesc,
	regex,
	children,
	className,
	type = 'text',
	tag = 'input',
	marginTop,
	...rest
}) => {
	const onFocus = useContext(onInputFocusContext)
	const [loading, setLoading] = useState(false)
	const [err, setErr] = useState(false)
	const [checkMark, setCheckMark] = useState(false)
	const checkMarkObj = useRef()

	const regExp = new RegExp(regex)

	const Ct = tag
	let timeOutIdRef = useRef()
	useEffect(() => {
		addStateFunc(checkMarkObj)
	}, [])
	const validate = (e) => {
		setErr(false)
		setCheckMark(false)
		clearTimeout(timeOutIdRef.current)

		e.target.value && setLoading(true)
		timeOutIdRef.current = setTimeout(() => {
			setLoading(false)
			if (e.target.value) {
				const isError = !regExp.test(e.target.value, 'g')
				setErr(isError)
				setCheckMark(!isError)
				checkMarkObj.current = !isError

				addStateFunc(checkMarkObj)
			}
		}, 800)
	}

	return (
		<div className={className + ' input-container'}>
			<label className='label' htmlFor={children}>
				{children[0].toUpperCase() + children.slice(1)}
			</label>
			<Ct
				onFocus={onFocus}
				noValidate
				onChange={validate}
				className='form-input'
				type={type}
				id={children}
				name={children}
				{...rest}
			/>

			<label
				className='validation-desc'
				htmlFor={children}
				aria-label='Loading'
			>
				{validationDesc}
			</label>

			<label className='error-desc' htmlFor={children}>
				{err && <p>Please enter a valid {children}</p>}
				{loading && <LoadingSpinner className='form-spinner' />}
				{checkMark && !loading && <CheckMark />}
			</label>
		</div>
	)
}

export default Input
