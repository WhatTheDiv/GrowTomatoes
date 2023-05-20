import Image from 'next/image'
import Icon_Tomato from '@assets/icons/tomato.png'
import style from '@styles/logo.module.css'

export const logo =  ({ scale }) => {


  return (
    <div className={`${style.container} logo`}>
      <Image
        className={style.image}
        src={Icon_Tomato}
        height={20}
        alt='logo'
      />
      <h1 className={style.name}>Grow Tomatoes</h1>
    </div>
  )
}

export default logo
