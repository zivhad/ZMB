import '@/app/css/categories.css'
import React from 'react'
import { SearchItem } from './SearchItem'

export const CategoriesNav = ({ categories, searchParams }) => {
	return (
		<search className='category-nav'>
			{categories.map((cat) => {
				return (
					<SearchItem
						searchParams={searchParams}
						className='search-item'
						category={cat}
						key={cat}
					></SearchItem>
				)
			})}
		</search>
	)
}
