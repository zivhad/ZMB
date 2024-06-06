import React from 'react'
import Link from 'next/link'

const NavItem = ({ children, className, href }) => {
	return (
		<Link href={href} className={`${className} nav-item`}>
			{children}
		</Link>
	)
}

export default NavItem
