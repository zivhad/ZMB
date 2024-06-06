'use client'
import React from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

export const SearchItem = ({ category, searchParams }) => {
	const router = useRouter()
	const pathname = usePathname()

	const clickHandler = () => {
		let queryArray
		if (!searchParams.tags) {
			queryArray = [category]
		}
		if (searchParams.tags) {
			queryArray = searchParams.tags.split(',')
			if (queryArray.includes(category)) {
				queryArray.splice(queryArray.indexOf(category), 1)
			} else {
				queryArray.push(category)
			}
		}
		let queryString = new URLSearchParams({ tags: queryArray }).toString()
		if (!queryArray.length) {
			queryString = ''
		}

		router.push(pathname + '?' + queryString)
	}

	return (
		<button
			onClick={clickHandler}
			className={
				'search-item ' + (searchParams.tags?.includes(category) ? 'active' : '')
			}
		>
			{category}
		</button>
	)
}
