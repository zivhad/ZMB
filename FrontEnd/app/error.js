'use client'
import React from 'react'
import '@/app/css/error.css'

const error = ({ error }) => {
	return <div className='error-div'>{error.message}</div>
}

export default error
