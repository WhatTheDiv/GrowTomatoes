import React from 'react'
import style from '@styles/nav.module.css'
import Logo from '@components/logo.jsx'

export const nav = () => {
  return (
    <div className={style.container}>
      <Logo />
    </div>
  )
}

export default nav
