import VideosGrid from '@/components/VideosGrid'
import { CategoriesNav } from '@/components/search/CategoriesNav'

/* import { useState, useEffect, useRef, useTransition } from 'react' */

export default async function Home({ searchParams }) {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`)
	const categories = await res.json()

	return (
		<>
			<CategoriesNav categories={categories} searchParams={searchParams} />
			<VideosGrid searchParams={searchParams} />
		</>
	)
}
