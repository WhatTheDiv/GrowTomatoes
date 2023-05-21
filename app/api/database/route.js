import { PrismaClient } from '@prisma/client'

export const POST = async (request, { params }) => {
  const body = await request.json()
  const prisma = new PrismaClient()
  const product = await prisma.product.create({
    data: { ...body.product }, select: {
      name: true,
      description: true,
      price: true
    }
  })
  const products = await prisma.product.findMany()

  prisma.$disconnect()
  return new Response(JSON.stringify({ products, product: product || null }), { status: 200 })

}

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

