import { PrismaClient } from '@prisma/client'
import { db } from "@vercel/postgres";

export const POST = async (request, { params }) => {
  const body = await request.json()
  const dev = process.env.DEV

  if (body.modify) {
    const res = dev ?
      await modifyWithPrisma(body.product)
      : await modifyWithVercel(body.product)

    return new Response(JSON.stringify({ products: res.products, product: res.product }), { status: 200 })
  } else if (!body.modify && body.delete) {
    const res = dev ?
      await deleteWithPrisma(body.productId)
      : await deleteWithVercel(body.productId)

    return new Response(JSON.stringify({ message: 'Product deleted', }), { status: 200 })
  } else {
    const res = dev ?
      await createWithPrisma(body.product)
      : await createWithVercel(body.product)

    return new Response(JSON.stringify({ dev, products: res.products, product: res.product }), { status: 200 })
  }
}

export const GET = (async (request) => {
  const res = process.env.DEV ?
    await getWithPrisma()
    : await getWithVercel()

  return new Response(JSON.stringify({ products: res }), { status: 200 })

})

export const DELETE = async (request, { params }) => {
  console.log('checkpoint1')
  return;
  const body = await request.json()
  console.log('checkpoint1', body)
  const dev = process.env.DEV

  const res = dev ? await deleteWithPrisma(body.productId)
    : await deleteWithVercel(body.productId)


  return new Response(JSON.stringify({ message: 'Product deleted', }), { status: 200 })
}
// Dev
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
async function modifyWithPrisma(product_raw) {
  const prisma = new PrismaClient()

  const product = await prisma.product.update({
    where: { id: product_raw.id },
    data: {
      name: product_raw.name,
      description: product_raw.description,
      price: product_raw.price,
      image: product_raw.image,
    }
  })

  const products = await prisma.product.findMany()

  prisma.$disconnect()

  return {
    products,
    product
  }
}
async function getWithPrisma() {
  const prisma = new PrismaClient()
  const products = await prisma.product.findMany()
  prisma.$disconnect()
  return products
}
async function deleteWithPrisma(id) {
  const prisma = new PrismaClient()

  await prisma.product.delete({
    where: { id }
  })

  prisma.$disconnect()
  return
}

// Production
async function createWithVercel(product_raw) {
  const client = await db.connect()

  try {
    // ALTER TABLE Products ADD COLUMN image varchar(255);
    // await client.sql`DROP TABLE IF EXISTS Products`
    // await client.sql`ALTER TABLE Products ADD COLUMN image varchar(255) `
    // await client.sql`CREATE TABLE Products ( name varchar(255), description varchar(255), price varchar(255), image text )`
    console.log('good image: ', product_raw.image.slice(1, 30))
    console.log('good image: ', product_raw.image.slice(-20, -1))
    await client.sql`INSERT INTO Products (name, description, price, image) VALUES (${product_raw.name},${product_raw.description},${product_raw.price},${product_raw.image})`
  } catch (e) {
    console.log('there was an error in server at [ createWithVercel ] - ', e)
    return { products: null, product: null }
  }

  const products = await client.sql`SELECT * FROM Products`
  return { product: null, products }
}
async function modifyWithVercel(product_raw) {
}
async function getWithVercel() {
  const client = await db.connect()
  console.log('getting with vercel')
  try {
    const products = await client.sql`SELECT * FROM  Products`
    console.log('succesfully retrieved with vercel')
    return products.rows
  } catch (e) {
    console.log('failed to query database with vercel')
  }
}
async function deleteWithVercel() {
  return
}


