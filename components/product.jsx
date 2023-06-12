"use client"
import styles from '@styles/product.module.css'
import Image from 'next/image'
import GenericIcon from '@assets/icons/box.png'

export default function Product(props) {
  const product = props.product

  return (
    <div className={styles.container}>

      <div className={styles.image}>
        <Image
          src={product['image'][0]}
          width={80}
          height={80}
          alt={product.name}
        />
      </div>

      <div className={styles.body}>
        <div className={styles.title}> <h3>{product.name}</h3></div>
        <div className={styles.description}> <p>{product.description}</p></div>
        <div className={styles.bottomRow}>
          <p>{product.price}</p>
          <p>Add to Cart</p>
        </div>
      </div>
    </div>
  )
}