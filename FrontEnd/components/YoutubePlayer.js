'use client'
import { React, useEffect, useRef } from 'react'

const YoutubePlayer = ({
	beatsState,
	id,
	isPlayerReadyFunc,
	playersAreReady,
	animationDelay,
}) => {
	const isPlayerReadyRef = useRef()
	const youtubeDivRef = useRef()

	useEffect(() => {
		isPlayerReadyFunc(isPlayerReadyRef, false)
		const player = new window.YT.Player(`${id}`, {
			videoId: id,
			playerVars: {
				color: 'white',
				controls: 1,
				playsinline: 1,
				rel: 0,
			},
			events: {
				onReady,
				onStateChange,
			},
		})

		function onReady(event) {
			event.target.stopVideo()
		}
		function onStateChange(event) {
			if (event.data === -1) {
				isPlayerReadyFunc(isPlayerReadyRef, true)
			}
		}

		youtubeDivRef.current.style.animationDelay = animationDelay + 's'
		return () => {
			player.destroy()
		}
	}, [beatsState])

	return (
		<div
			ref={youtubeDivRef}
			aria-label='video'
			className={'youtube-div' + (playersAreReady ? ' scale' : '')}
		>
			<div id={`${id}`}></div>
		</div>
	)
}

export default YoutubePlayer
