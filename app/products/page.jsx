

const Products = async () => {
  async function getProducts() {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    }
    const url = process.env.SERVER_HOST + '/api/database'
    console.log('url: ', url)
    const data = await fetch(url, options)
    console.log('status: ', data.status)
    console.log('data: ', data)
    // const res = await data.json()


    // return res.products
    console.log(data)
    return []
  }

  console.log('checkpoint')
  const products = await getProducts()
  console.log('products: ', products)

  return (
    <div>
      <h1>Product List</h1>
      <ul>
        {products.map((item, index) => {
          return (
            <li key={index}>
              <span>{item.name} </span>
              <span>{item.price} </span>
              <span>{item.description} </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}





export default Products
