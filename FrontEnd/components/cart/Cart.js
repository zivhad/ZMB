'use client'
import React from 'react'
import useOutsideClick from '@/hooks/useClickOutside'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const Cart = () => {
	const [close, setClose] = useState(false)

	const router = useRouter()
	const outsideClickFunction = () => {
		setClose(true)
		ref.current.addEventListener('animationend', (event) => {
			router.back()
		})
	}

	const ref = useOutsideClick(outsideClickFunction)
	return (
		<div
			ref={ref}
			aria-label='cart'
			className={`cart-container ${close ? 'close' : ''}`}
		>
			Cart
		</div>
	)
}

export default Cart
