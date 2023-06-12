import styles from '@styles/products.module.css'
import Product from '@components/product'
import { PrismaClient } from '@prisma/client'
import { db } from "@vercel/postgres";

const Products = async () => {
  const products = await getProducts()
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Category</h1>
      <ul className={styles.list}>
        {
          products.map((product, index) => {
            return (
              <li key={product.id}><Product product={product} /></li>
            )
          })
        }
      </ul>
    </div>
  )

}
async function getProducts() {
  async function getProductsWithPrisma() {
    const prisma = new PrismaClient()
    const products = await prisma.product.findMany()
    prisma.$disconnect()
    return products
  }
  async function getProductsWithVercel() {
    const client = await db.connect()
    const products = await client.sql`SELECT * FROM  Products`
    return products.rows
  }

  return process.env.DEV ? await getProductsWithPrisma() : await getProductsWithVercel()
}

export default Products
