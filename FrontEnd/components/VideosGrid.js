'use client'

import React, { useState, useEffect, useRef, useTransition } from 'react'

import YoutubePlayer from '@/components/YoutubePlayer'
import LoadingSpinner from '@/components/LoadingSpinner'

const VideosGrid = ({ searchParams }) => {
	const [beats, setBeats] = useState([{}])
	const [playersAreReady, setPlayersAreReady] = useState(false)
	const [isPending, startTRansition] = useTransition()
	const loadingRef = useRef(false)
	const YTPlayersAreReadySetRef = useRef(new Set())

	const queryString = new URLSearchParams(searchParams).toString()

	useEffect(() => {
		loadingRef.current = true

		YTPlayersAreReadySetRef.current = new Set()
		const getBeats = async function (tags) {
			try {
				setPlayersAreReady(false)
				const res = await fetch(
					`${process.env.NEXT_PUBLIC_API_BASE_URL}/beats/?${queryString}`
				)

				if (!res.ok) {
					throw new Error("couldn't get beats from server ")
				}
				const beats = await res.json()
				console.log(beats)

				setBeats(beats)
			} catch (err) {
				throw err
			}
		}
		startTRansition(() => {
			getBeats(searchParams.tags)
		})
	}, [searchParams])
	const addStateToReadySet = (isReadyRef, boolean) => {
		isReadyRef.current = boolean

		YTPlayersAreReadySetRef.current.add(isReadyRef)
		const arrayFromSet = [...YTPlayersAreReadySetRef.current]

		if (
			arrayFromSet.every((i) => {
				return i.current === true
			})
		) {
			setPlayersAreReady(true)
			loadingRef.current = false
		}
	}
	let animationDelay = 0

	return (
		<>
			{(beats.length !== 0 && (
				<section className='videos-container'>
					{beats.map((beat, i) => {
						animationDelay += 0.2
						if (beat.YTid) {
							return (
								<YoutubePlayer
									beatsState={beats}
									animationDelay={animationDelay}
									playersAreReady={playersAreReady}
									isPlayerReadyFunc={addStateToReadySet}
									key={beat.YTid}
									id={beat.YTid}
								/>
							)
						}
					})}
					{loadingRef.current && <LoadingSpinner className='videos-spinner' />}
				</section>
			)) || <p className='category-message'>No beats found for these tags</p>}
		</>
	)
}

export default VideosGrid
