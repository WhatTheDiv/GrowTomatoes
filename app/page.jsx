import Link from 'next/link'
import style from '@styles/home.module.css'

const Home = () => {
  console.log(' -------------------')
  console.log('  *  Heartbeat   * ')
  console.log(' -------------------')
  return (
    <div className={style.container}>
      <p className={style.bodyDescrip}>The one stop shop for all your your growing needs</p>
      <div className={style.bodyNav}>
        <Link href='/products'>View Productss</Link>
        <input
          type="button"
          value="Search"
        />
        <Link href='/admin'>Add Product</Link>
      </div>
    </div>
  )
}

export default Home