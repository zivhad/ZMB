'use client'
import { useRouter } from 'next/navigation'
import { closeModalContext } from '@/components/Modal'
import { useContext, useEffect, useRef } from 'react'
import CheckMark from '@/public/svg/CheckMark'
import { useState } from 'react'
import React from 'react'
import Input from '@/components/Input'
import { submitContactForm } from '@/app/actions/actions'
import Button from '@/components/search/Button'
import { createContext } from 'react'

export const onInputFocusContext = createContext()

const Contact = () => {
	const router = useRouter()
	const [inputStateSet, setInputStateSet] = useState(new Set())
	const [isFormValid, setIsFormValid] = useState(false)
	const buttonRef = useRef()

	const addToStateSet = function (stateObj) {
		setInputStateSet(new Set([...inputStateSet, stateObj]))
		const newSetMimic = new Set([...inputStateSet, stateObj])

		const flatArr = []
		newSetMimic.forEach((i) => {
			flatArr.push(i.current)
		})

		setIsFormValid(
			flatArr.every((i) => {
				return i === true
			})
		)
	}

	const [formStatus, setFormStatus] = useState('')
	const contactFormHandler = async function (data) {
		try {
			const response = await submitContactForm(data)

			setFormStatus(response)
		} catch (err) {
			return err
		}
	}
	const { setClose: setCloseModal, modalRef } = useContext(closeModalContext)

	const onXClick = () => {
		setCloseModal(true)
		modalRef.current.addEventListener('animationend', () => {
			router.back()
		})
	}
	return (
		<form
			noValidate
			action={contactFormHandler}
			onClick={(e) => {
				e.stopPropagation()
			}}
			className='form'
		>
			<fieldset className='fieldset'>
				{formStatus === 'message sent' && (
					<dialog className='message-sent'>
						<CheckMark listener={true} style={{ width: '50' }} />{' '}
						<p>Message Sent</p>
					</dialog>
				)}
				<h2 className='contact-use-title'>
					Contact-us <div onClick={onXClick} className='x-mark' />
				</h2>
				<onInputFocusContext.Provider
					value={() => {
						setFormStatus('')
					}}
				>
					<Input
						addStateFunc={addToStateSet}
						type='name'
						marginTop='7%'
						regex='^([a-zA-Z]{2,10})(\s[a-zA-Z]{2,10})?$'
					>
						name
					</Input>
					<Input
						addStateFunc={addToStateSet}
						type='email'
						regex='^[\w\.]+@([\w-]+\.)+[\w]{2,4}$'
						marginTop='7%'
					>
						email
					</Input>
					<Input
						addStateFunc={addToStateSet}
						marginTop='7%'
						tag='textarea'
						rows='9'
						regex='^.{40,250}$'
						validationDesc='40-250 characters'
					>
						message
					</Input>
				</onInputFocusContext.Provider>
				<Button ref={buttonRef} type='submit' disabled={!isFormValid}>
					Submit
				</Button>

				<p className='form_status'>
					{formStatus !== 'message sent' && formStatus}
				</p>
			</fieldset>
		</form>
	)
}

export default Contact
