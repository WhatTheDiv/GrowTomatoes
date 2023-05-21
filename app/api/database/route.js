// import { PrismaClient } from '@prisma/client'
import { db } from "@vercel/postgres";

export const POST = async (request, { params }) => {
  const body = await request.json()

  // const res = await createWithPrisma(body.product)
  const res = await createWithVercel(body.product)

  return new Response(JSON.stringify({ products: res.products, product: res.product }), { status: 200 })

}

export const GET = (async (request) => {
  const res = await getWithVercel()
  return new Response(JSON.stringify({ products: res }), { status: 200 })

})

export const DELETE = async (request, { params }) => {
  const body = await request.JSON()
  const prisma = new PrismaClient()

  const product = await prisma.product.delete({
    where: {
      id: body.deleteThisProduct_id
    }
  })

  prisma.$disconnect()
  return new Response(JSON.stringify({
    product: product ? product : null,
    message: 'Product deleted',
  }), { status: 200 })
}

async function createWithPrisma(product_raw) {
  const prisma = new PrismaClient()

  const product = await prisma.product.create({
    data: { ...product_raw }, select: {
      name: true,
      description: true,
      price: true
    }
  })
  const products = await prisma.product.findMany()

  prisma.$disconnect()

  return {
    products,
    product
  }
}
async function createWithVercel(product_raw) {
  const client = await db.connect()

  try {
    // await client.sql`CREATE TABLE Products ( name varchar(255), description varchar(255), price varchar(255) )`
    await client.sql`INSERT INTO Products (name, description, price) VALUES (${product_raw.name},${product_raw.description},${product_raw.price})`
  } catch (e) {
    console.log('there was an error', e)
    return { products: null, product: null }
  }

  const products = await client.sql`SELECT * FROM Products`
  return { product: null, products }
}
async function getWithVercel() {
  const client = await db.connect()
  try {
    const products = await client.sql`SELECT * FROM  Products`
    console.log('succesfully retrieved with vercel')
    return products.rows
  } catch (e) {
    console.log('failed to query database with vercel')
  }
}

