'use client'
import style from '@styles/addProducts.module.css'
import { useState } from 'react'
import Image from 'next/image'



const AddProducts = () => {
  function resetForm() {
    document.querySelector(`.${style.formContainer}`)?.reset()
    setAction('addProduct')
    setProduct(false)
    setProducts(false)
    setImageArray([])
  }
  const [action, setAction] = useState('addProduct')
  const [product, setProduct] = useState(false)
  const [products, setProducts] = useState(false)
  const [imageArray, setImageArray] = useState([])


  const select_action = renderAction(action, setAction, setProducts, setProduct, setImageArray)
  const select_product = renderProduct(action, products, setProduct, setImageArray)
  const form = renderForm(action, product, imageArray, setImageArray, resetForm)

  console.log('... rendering admin')

  return (
    <div>
      <div className={style.adminActions}>
        {select_action}
        {select_product}
      </div>

      {form}
    </div>

  )
}
function renderAction(action, setAction, setProducts, setProduct, setImageArray) {
  async function onChange_action(e, setA, setP, setPr, setI) {
    const newAction = e.target.value
    document.querySelector(`.${style.formContainer}`)?.reset()
    if (newAction === 'editProduct') {
      console.log('Fetching product list ... ')
      let products = []
      const options = {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
      const url = "/api/database"

      try {
        const res = await fetch(url, options)
        if (!res.ok) throw 'bad server response: ' + res.status
        const data = await res.json()
        console.log('product list: ', data.products)
        products = data.products

      } catch (e) {
        console.log('Error retrieving products in renderAction() (', e, ')')
        products = []

      }

      setP(products)
    }
    else if (newAction === 'addProduct') {
      setP(false)
      setPr(false)
    }
    setA(newAction)
    setI([])
  }

  return (
    <select name="adminAction" id="adminAction" value={action} onChange={e => onChange_action(e, setAction, setProducts, setProduct, setImageArray)}>
      <option value="addProduct">Add Product</option>
      <option value="editProduct">Edit Product</option>
    </select>
  )
}
function renderProduct(action, products, setProduct, setImageArray) {
  function onChange_selectProduct(e, pure_products, setP) {
    const prod = pure_products.find(p => e.target.value === p.id)
    document.querySelector(`.${style.formContainer}`)?.reset()
    setP(prod)
    setImageArray([])
  }

  if (!action || !products) return null
  else return (
    <select
      name='editProduct'
      id='editProduct'
      onChange={e => onChange_selectProduct(e, products, setProduct, setImageArray)}
    >
      <option key={-1} value={null}>Select Product</option>
      {products.map((item, index) => {
        return <option key={index} value={item.id} >{item.name}</option>
      })}
    </select>
  )
}
function renderForm(action, product, imageArray, setImageArray, resetForm) {
  async function submitNewProduct(e, rs) {
    e.preventDefault();
    const inputs = e.target.querySelectorAll('input, textarea')
    const [n, d, p, i] = inputs
    const name = n.value ? n.value : 'Test_name'
    const description = d.value ? d.value : 'test description'
    const price = p.value ? Number(p.value).toFixed(2) : '11.11'
    const image = i.files ? await image_fileArrayToBase64StringArray(i.files) : []
    const product = { name, description, price, image }
    console.log('sending product: ', product)
    const options = {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        product
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
      alert('Sucessfully updated ' + product.name)
      rs()
    }
    catch (e) {
      console.error('Error! failed to add new product -', e)
      alert("Failed to create new product :'( ")
    }
  }
  async function submitModifyProduct(e, rs, id, imgarr) {
    e.preventDefault();
    const inputs = e.target.querySelectorAll('input, textarea')
    const [n, d, p, i] = inputs
    const name = n.value ? n.value : 'Test_name'
    const description = d.value ? d.value : 'test description'
    const price = p.value ? Number(p.value).toFixed(2) : '11.11'
    const image = i.files ? await image_fileArrayToBase64StringArray(i.files) : []
    imgarr.forEach(item => image.push(item))
    const product = { name, description, price, image, id }
    console.log('modifying product: ', product)
    const options = {
      method: "POST",
      headers: {
        "Content-Type": 'application/json'
      },
      body: JSON.stringify({
        product,
        modify: true
      })

    }
    const url = '/api/database'
    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        console.warn('call response: ', response)
        throw response.status
      }
      const data = await response.json()
      console.log('Good data! - ', data)
      alert('Sucessfully updated ' + product.name)
    }
    catch (e) {
      console.error('Error! failed to add new product -', e)
      alert("Failed to modify " + product.name + " :'( ")
    }

    rs()

  }
  async function onChange_addImage(e, array, setArray) {

    const filesArray = await image_fileArrayToBase64StringArray(e.target.files)
    setArray([...array, ...filesArray])
    return
  }
  async function delete_product(rs) {

    const options = {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ modify: false, delete: true, productId: product.id })
    }
    const url = '/api/database'


    try {
      const res = await fetch(url, options)
      if (!res.ok) {
        console.log('failed to delete product, server status: ', res.status)
        throw 'server call failed'
      }
      const data = await res.json()
      console.log('Sucessfully deleted ', product.name, ' - ', data)
      alert('Sucessfully deleted ', product.name)
    } catch (e) {
      console.log('failed at delete_product() with error ', e)
      alert('Failed to delete ' + product.name)
    }
    rs()

  }

  console.log('loading form ... ')
  const fv = { // form variable blanks
    submitMethod: null,
    name: "",
    description: "",
    price: "",
    imageArray: [],
    submitMessage: "",
    imageMessage: "",
    delete: null
  }

  if (action === 'editProduct' && !product) return null
  else if (action === 'editProduct' && product) {
    fv.submitMethod = submitModifyProduct
    fv.name = product.name
    fv.description = product.description
    fv.price = product.price
    fv.imageArray = [...product.image]
    console.log('imageArray length: ', product.image.length)
    fv.submitMessage = "Update " + product.name
    fv.imageMessage = "Add Image"
    fv.delete = <input style={{ background: 'red' }} onClick={() => delete_product(resetForm)} type="button" value={"Delete " + product.name} />

    imageArray.forEach(img => fv.imageArray.push(img))
  }
  else if (action === 'addProduct') {
    fv.submitMethod = submitNewProduct
    fv.submitMessage = 'Create New Product'
    fv.imageMessage = "Select Image"
    imageArray.forEach(img => fv.imageArray.push(img))
  }

  return <form className={style.formContainer} onSubmit={e => fv.submitMethod(e, resetForm, product.id, product.image)}> {/* Removed passed 'image' variable */}

    <fieldset>
      <label htmlFor="addProduct_name"></label>
      <legend>Name:</legend>
      <input defaultValue={fv.name} autoComplete='off' id='addProduct_name' type="text" />
    </fieldset>

    <fieldset>
      <label htmlFor="addProduct_descrip"></label>
      <legend>Description:</legend>
      <textarea defaultValue={fv.description} autoComplete='off' id='addProduct_descrip' type="text"
        onInput={(t) => {
          t.target.style.height = '';
          t.target.style.height = t.target.scrollHeight - 10 + "px" // 5px padding
        }}
      />
    </fieldset>

    <fieldset className={`${style.formPrice} addProduct_imagecontainer`}>
      <label htmlFor="addProduct_price"></label>
      <legend>Price</legend>
      <input defaultValue={fv.price} autoComplete='off' step="0.01" id='addProduct_price' type="number" />
    </fieldset>

    <fieldset className={style.formFile}>
      <legend>Image</legend>
      <label htmlFor="addProduct_image">{fv.imageMessage}</label>
      {
        fv.imageArray.map((item, i) => {
          let pixels, width;
          pixels = document.querySelector('.addProduct_imagecontainer') ? getComputedStyle(document.querySelector('.addProduct_imagecontainer'))?.width : 0
          /* const pixels = getComputedStyle(document.querySelector('.addProduct_imagecontainer'))?.width */
          if (pixels > 0) {
            document.querySelector('.addProduct_imagecontainer').style.maxHeight = pixels
            width = pixels && (Number(pixels.slice(0, -2)) - 30) / 2.5
            console.log('width: ', width)

          }
          return <Image key={i} src={item} width={width || 100} height={width || 100} alt='Selected Image' />
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
          onChange_addImage(e, imageArray, setImageArray)
        }}
      />
    </fieldset>

    <input type="submit" value={fv.submitMessage} />
    {fv.delete}
  </form >
}
async function image_fileArrayToBase64StringArray(f_array) {
  if (f_array.length <= 0) return []
  return new Promise((res, rej) => {
    const files = f_array
    const reader = new FileReader()
    let i = 0
    const arr = []
    console.log('files', files)

    reader.onloadend = () => {
      console.log('Loaded index [', i, ']')
      arr.push(reader.result)
      i++
      if (i >= files.length) res(arr)
      else setTimeout(() => { reader.readAsDataURL(files[i]) }, 100)
    }
    reader.onerror = e => {
      console.log('There was an error reading files at index [', i, ']: ', e)
      rej([])
    }
    console.log('running file ', i, ': ', files[i])
    reader.readAsDataURL(files[i])
  })
}


export default AddProducts