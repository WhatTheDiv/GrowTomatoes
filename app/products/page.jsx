import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const products = async () => {
  const products = await prisma.product.findMany()
  console.log(`Product List `)
  console.table(products)
  return (
    <div>products</div>
  )
}

export default products
