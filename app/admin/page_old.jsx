'use client'
import style from '@styles/addProducts.module.css'
import { useState } from 'react'
import Image from 'next/image'



const AddProducts = () => {
  function render_productForm(prod = null) {
    if (prod === null) return (
      <form className={style.formContainer} onSubmit={(event) => submitNewProduct(event, image)}>

        <fieldset>
          <label htmlFor="addProduct_name"></label>
          <legend>Name:</legend>
          <input defaultValue="" autoComplete='off' id='addProduct_name' type="text" />
        </fieldset>

        <fieldset>
          <label htmlFor="addProduct_descrip"></label>
          <legend>Description:</legend>
          <textarea defaultValue="" autoComplete='off' id='addProduct_descrip' type="text"
            onInput={(t) => {
              t.target.style.height = '';
              t.target.style.height = t.target.scrollHeight - 10 + "px" // 5px padding
            }}
          />
        </fieldset>

        <fieldset className={`${style.formPrice} addProduct_imagecontainer`}>
          <label htmlFor="addProduct_price"></label>
          <legend>Price</legend>
          <input defaultValue="" autoComplete='off' step="0.01" id='addProduct_price' type="number" />
        </fieldset>

        <fieldset className={style.formFile}>
          <legend>Image</legend>
          {
            !image ?
              <label htmlFor="addProduct_image">Select Image</label>
              :
              image.map((item, i) => {
                const pixels = getComputedStyle(document.querySelector('.addProduct_imagecontainer')).width
                document.querySelector('.addProduct_imagecontainer').style.maxHeight = pixels
                const width = (Number(pixels.slice(0, -2)) - 30) / 2.5
                console.log('width: ', width)
                return <Image key={i} src={item} width={width} height={width} alt='Selected Image' />
              })

          }

          <input
            style={{ display: 'none' }}
            autoComplete='off'
            id='addProduct_image'
            multiple
            type="file"
            accept='image/*'
            onChange={(e) => {
              onChange_addImage(e, setImage)
            }}
          />
        </fieldset>

        <input type="submit" value="Create New Product" />
      </form>
    )
    else {
      /*
          description: "4x4 enclosure"
          id: "6ee18e1f-e525-4b94-a860-bef33caff7af"
          image: []
          name: "Tent"
          price: "44.25"
      */
      console.log('returning modification for ', prod)
      return <form className={style.formContainer} onSubmit={(event) => modifyProduct(event, image)}>

        <fieldset>
          <label htmlFor="addProduct_name"></label>
          <legend>Name:</legend>
          <input autoComplete='off' id='addProduct_name' type="text" defaultValue={prod.name} />
        </fieldset>

        <fieldset>
          <label htmlFor="addProduct_descrip"></label>
          <legend>Description:</legend>
          <textarea autoComplete='off' id='addProduct_descrip' type="text" defaultValue={prod.description}
            onInput={(t) => {
              t.target.style.height = '';
              t.target.style.height = t.target.scrollHeight - 10 + "px" // 5px padding
            }}
          />
        </fieldset>

        <fieldset className={`${style.formPrice} addProduct_imagecontainer`}>
          <label htmlFor="addProduct_price"></label>
          <legend>Price</legend>
          <input autoComplete='off' defaultValue={prod.price} step="0.01" id='addProduct_price' type="number" />
        </fieldset>

        {/* <fieldset className={style.formFile}>
          <legend>Image</legend>
          {
            !image ?
              <label htmlFor="addProduct_image">Select Image</label>
              :
              image.map((item, i) => {
                const pixels = getComputedStyle(document.querySelector('.addProduct_imagecontainer')).width
                document.querySelector('.addProduct_imagecontainer').style.maxHeight = pixels
                const width = (Number(pixels.slice(0, -2)) - 30) / 2.5
                console.log('width: ', width)
                return <Image key={i} src={item} width={width} height={width} alt='Selected Image' />
              })

          }

          <input
            style={{ display: 'none' }}
            autoComplete='off'
            id='addProduct_image'
            multiple
            type="file"
            accept='image/*'
            onChange={(e) => {
              onChange_addImage(e, setImage)
            }}
          />
        </fieldset> */}

        <input type="submit" value="Save" />
      </form>
    }
  }
  
  const [image, setImage] = useState(false)
  const [edit, setEdit] = useState(false)
  const [product, setProduct] = useState(false)
  const [products, setProducts] = useState(false)

  const form = !edit ? render_productForm() :
    product === false ? null : render_productForm(product)

  if (edit && products === false) {
    getProductList().then(p => {
      setProducts(p)
    })
  }
  console.log('rendering')
  return (
    <div>
      <div className={style.adminActions}>
        <select name="adminAction" id="adminAction" defaultValue="add" onChange={e => onChange_actions(e, setEdit, setProducts)}>
          <option value="addProduct">Add Product</option>
          <option value="editProduct">Edit Product</option>
        </select>

        {
          edit && products !== false ?
            <select name='editProduct' id='editProduct' onChange={e => onChange_selectProduct(products.find(p => e.target.value === p.id), setProduct)}>
              <option value={null}>Select Product</option>
              {products.map((item, index) => {
                return <option key={index + 1} value={item.id} >{item.name}</option>
              })}
            </select>
            : null
        }

      </div>
      {
        form
      }
    </div>

  )
}


async function submitNewProduct(e, i) {
  e.preventDefault();
  const inputs = e.target.querySelectorAll('input, textarea')
  const [n, d, p] = inputs
  const name = n.value ? n.value : 'Test_name'
  const description = d.value ? d.value : 'test description'
  const price = p.value ? Number(p.value).toFixed(2) : '11.11'
  const image = i ? i : []

  const options = {
    method: "POST",
    headers: {
      "Content-Type": 'application/json'
    },
    body: JSON.stringify({
      product: {
        name,
        description,
        price,
        image
      }
    })

  }
  try {
    const response = await fetch('/api/database', options)
    if (!response.ok) {
      console.warn('call response: ', response)
      throw response.status
    }
    const data = await response.json()
    console.log('Good data! - ', data)
  }
  catch (e) {
    console.error('Error! failed to add new product -', e)
    alert("Failed to create new product :'( ")
  }

}
async function modifyProduct() {
  console.log('modifying ... ')
}
async function getProductList() {

  console.log('Fetching product list ... ')
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  }
  const url = "/api/database"

  try {
    const res = await fetch(url, options)
    if (res.status !== 200) throw 'bad server response: ' + res.status
    const data = await res.json()
    console.log('data list: ', data)
    return data.products
  } catch (e) {
    console.log('Error retrieving products in getProductList() (', e, ')')
    return []
  }
}
function onChange_addImage(e, setimg) {
  const files = e.target.files
  const reader = new FileReader()

  if (files.length === 1) {
    reader.onloadend = () => {
      console.log('loaded.')
      setimg([reader.result])
    }
    reader.readAsDataURL(files[0])
  }



  else if (files.length > 1) {
    const arr = []
    let i = 0

    reader.onloadend = () => {
      arr.push(reader.result)
      i++
      if (i >= files.length) setimg(arr)
      else setTimeout(() => { reader.readAsDataURL(files[i]) }, 100)
    }

    reader.readAsDataURL(files[i])


  }
}
function onChange_actions(e, setEdit, setProduct) {
  console.log('diagnostic')
  const selection = e.target.value
  if (selection === 'editProduct') {
    console.log('setting edit to true')
    setEdit(true)
  }
  else if (selection === 'addProduct') {
    console.log('setting edit to false')
    setEdit(false)
    setProduct(false)
  }

}
function onChange_selectProduct(prod, setProduct) {
  if (prod === null) setProduct(false)
  else setProduct(prod)
}

export default AddProducts