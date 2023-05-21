import React from 'react'
import style from '@styles/nav.module.css'
import Logo from '@components/logo.jsx'
import Link from 'next/link'

export const nav = () => {
  return (
    <div className={style.container}>
      <Link href='/'>  <Logo /> </Link>
    </div>
  )
}

export default nav
