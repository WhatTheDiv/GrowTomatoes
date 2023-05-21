

const Products = async () => {

  const products = await getProducts()

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
async function getProducts() {
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }
  const data = await fetch('http://localhost:3000/api/database', options)
  // console.log('data: ', data)
  const res = await data.json()


  return res.products
}


export default Products
