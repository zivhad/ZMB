'use client'

import CheckMark from '@/public/svg/CheckMark'
import { useState } from 'react'
import React from 'react'
import Input from '@/components/Input'
import { submitContactForm } from '@/app/actions/actions'
import Button from '@/components/search/Button'
import { createContext } from 'react'
export const onInputFocusContext = createContext()

const Contact = () => {
	const [inputStateSet, setInputStateSet] = useState(new Set())

	const addToStateSet = function (stateObj) {
		setInputStateSet((state) => {
			return new Set([...state, stateObj])
		})
	}

	const flatArr = []

	inputStateSet.forEach((i) => {
		flatArr.push(i.value)
	})

	const isFormValid = !flatArr.includes(false)
	const [formStatus, setFormStatus] = useState('')
	const contactFormHandler = async function (data) {
		try {
			const response = await submitContactForm(data)

			setFormStatus(response)
		} catch (err) {
			return err
		}
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
				<h2 className='contact-use-title'>Contact-us</h2>
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
				<Button disabled={isFormValid} type='submit'>
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
