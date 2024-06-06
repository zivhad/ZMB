'use client'
import { createContext } from 'react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useState } from 'react'
import { useRef } from 'react'
export const closeModalContext = createContext()
const Modal = ({ children }) => {
	const modalRef = useRef()
	const [close, setClose] = useState(false)
	const router = useRouter()
	const clickHandler = (e) => {
		e.target.addEventListener('animationend', () => {
			router.back()
		})
		setClose(true)
	}
	return (
		<div
			ref={modalRef}
			aria-label='dialog window'
			className={`modal ${close ? 'close-modal' : ''}`}
			onClick={clickHandler}
		>
			<closeModalContext.Provider value={{ setClose, modalRef }}>
				{children}
			</closeModalContext.Provider>
		</div>
	)
}

export default Modal
