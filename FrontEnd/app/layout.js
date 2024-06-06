import '@/app/css/youtube-player.css'
import './css/globals.css'
import './css/button.css'
import './css/form.css'
import '@/app/test/css.css'

import Navbar from '@/components/nav/Navbar'
import NavItem from '@/components/nav/NavItem'
import ZMB from '@/public/svg/zmb-logo'
import CartIcon from '@/public/svg/CartIcon'
import PersonIcon from '@/public/svg/PersonIcon'
import Script from 'next/script'

export const metadata = {
	title: 'zivmakesbeats',
	description: 'Hip-Hop Instrumentals Store',
}

export default async function RootLayout({ children, modal, cart }) {
	return (
		<html lang='en' suppressHydrationWarning>
			<head>
				<Script
					src='https://www.youtube.com/iframe_api'
					strategy='beforeInteractive'
				/>
			</head>
			<body>
				{modal}
				{cart}

				<Navbar>
					<NavItem href='/' className='margin-right-auto'>
						<ZMB></ZMB>
					</NavItem>
					<NavItem href='/contact'>Contact</NavItem>
					<NavItem href='/login'>Login</NavItem>
					<NavItem href='/cart' className='margin-left-auto'>
						<CartIcon></CartIcon>
					</NavItem>
					<NavItem href='/login'>
						<PersonIcon></PersonIcon>
					</NavItem>
				</Navbar>
				{children}
			</body>
		</html>
	)
}
