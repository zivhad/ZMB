import React from 'react'
import { useRef } from 'react'
import { timeout } from '@/utils/timeoutFunction'
import { useEffect } from 'react'
import { closeModalContext } from '@/components/Modal'
import { useContext } from 'react'
import { useRouter } from 'next/navigation'

const CheckMark = (props) => {
	const checkMarkRef = useRef()
	const router = useRouter()
	const { setClose: setCloseModal, modalRef } = useContext(closeModalContext)

	useEffect(() => {
		if (props.listener) {
			checkMarkRef.current.addEventListener('animationend', async () => {
				await timeout(1300)
				setCloseModal(true)
				modalRef.current.addEventListener('animationend', () => {
					router.back()
				})
			})
		}
	}, [checkMarkRef])

	return (
		<svg
			{...props}
			ref={checkMarkRef}
			className='check-mark'
			xmlns='http://www.w3.org/2000/svg'
			width='24'
			height='24'
			viewBox='0 0 24 24'
		>
			<path d='M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z' />
		</svg>
	)
}

export default CheckMark
