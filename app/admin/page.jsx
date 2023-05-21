
import { PrismaClient } from '@prisma/client'
import AddProduct from '@components/addProduct.jsx'

const admin = () => {
  async function createNewProduct() {
    console.log('create new prod')
  }
  return (
    <AddProduct />
  )
}

export default admin