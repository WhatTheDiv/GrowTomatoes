'use client'
import style from '@styles/addProducts.module.css'
import { useState } from 'react'
import Image from 'next/image'



const AddProducts = () => {
  const [image, setImage] = useState(false)
  return (
    <form className={style.container} onSubmit={(event) => submitNewProduct(event, image)}>
      <p>Add Products</p>
      <fieldset>
        <label htmlFor="addProduct_name"></label>
        <legend>Name:</legend>
        <input autoComplete='off' id='addProduct_name' type="text" />
      </fieldset>

      <fieldset>
        <label htmlFor="addProduct_descrip"></label>
        <legend>Description:</legend>
        <textarea autoComplete='off' id='addProduct_descrip' type="text"
          onInput={(t) => {
            t.target.style.height = '';
            t.target.style.height = t.target.scrollHeight - 10 + "px" // 5px padding
          }}
        />
      </fieldset>

      <fieldset className={`${style.formPrice} addProduct_imagecontainer`}>
        <label htmlFor="addProduct_price"></label>
        <legend>Price</legend>
        <input autoComplete='off' step="0.01" id='addProduct_price' type="number" />
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
      console.warn(response)
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

export default AddProducts