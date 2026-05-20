'use client'

import { useState } from 'react'
import { supabase } from '../../../lib/supabase'

export default function AddProductPage() {

  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [condition, setCondition] = useState('')
  const [storage, setStorage] = useState('')
  const [ram, setRam] = useState('')
  const [description, setDescription] = useState('')
  const [warranty, setWarranty] = useState('')
  const [batteryHealth, setBatteryHealth] = useState('')

  const [sellerName, setSellerName] = useState('')
  const [sellerPhone, setSellerPhone] = useState('')
  const [sellerLocation, setSellerLocation] = useState('')
  const [dealerSlug, setDealerSlug] = useState('')

  const [imageFile, setImageFile] = useState(null)

  const uploadImage = async () => {

    if (!imageFile) return null

    const fileName = `${Date.now()}-${imageFile.name}`

    const { error } = await supabase.storage
      .from('products')
      .upload(fileName, imageFile)

    if (error) {
      alert(error.message)
      return null
    }

    const { data } = supabase.storage
      .from('products')
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  const addProduct = async () => {

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert('You must login first')
      return
    }

    const uploadedImageUrl = await uploadImage()

    const { error } = await supabase
      .from('products')
      .insert([
        {
          seller_id: user.id,

          seller_name: sellerName,
          seller_phone: sellerPhone,
          seller_location: sellerLocation,
          dealer_slug: dealerSlug,

          name,
          price,
          condition,
          storage,
          ram,
          description,

          image_url: uploadedImageUrl,

          verified: true,
          warranty,
          battery_health: batteryHealth,
        },
      ])

    if (error) {

      alert(error.message)

    } else {

      alert('Product added successfully!')

      setName('')
      setPrice('')
      setCondition('')
      setStorage('')
      setRam('')
      setDescription('')
      setWarranty('')
      setBatteryHealth('')

      setSellerName('')
      setSellerPhone('')
      setSellerLocation('')
      setDealerSlug('')

      setImageFile(null)
    }
  }

  return (

    <main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-10 lg:py-10 overflow-x-hidden">

      <div className="max-w-3xl mx-auto bg-white p-5 sm:p-8 rounded-3xl shadow-sm">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-3xl sm:text-4xl font-bold text-black">
            Dealer Product Upload
          </h1>

          <p className="text-gray-600 mt-3 text-base sm:text-lg leading-7">
            Upload verified iPhones, Androids,
            laptops, consoles and trade-in devices.
          </p>

        </div>

        <div className="space-y-6">

          {/* DEALER INFO */}
          <div className="bg-gray-50 p-5 sm:p-6 rounded-3xl">

            <h2 className="text-2xl font-bold text-black mb-5">
              Dealer Information
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Dealer / Shop Name"
                className="w-full border border-gray-300 p-4 rounded-2xl bg-white text-black placeholder:text-gray-500 outline-none focus:border-black"
                value={sellerName}
                onChange={(e) =>
                  setSellerName(e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Dealer Slug (example: iphone-hub)"
                className="w-full border border-gray-300 p-4 rounded-2xl bg-white text-black placeholder:text-gray-500 outline-none focus:border-black"
                value={dealerSlug}
                onChange={(e) =>
                  setDealerSlug(e.target.value)
                }
              />

              <input
                type="tel"
                placeholder="Seller Phone (2547XXXXXXXX)"
                className="w-full border border-gray-300 p-4 rounded-2xl bg-white text-black placeholder:text-gray-500 outline-none focus:border-black"
                value={sellerPhone}
                maxLength={12}
                onChange={(e) => {

                  const numbersOnly =
                    e.target.value.replace(/\D/g, '')

                  if (numbersOnly.length <= 12) {
                    setSellerPhone(numbersOnly)
                  }

                }}
              />

              <input
                type="text"
                placeholder="Shop Location"
                className="w-full border border-gray-300 p-4 rounded-2xl bg-white text-black placeholder:text-gray-500 outline-none focus:border-black"
                value={sellerLocation}
                onChange={(e) =>
                  setSellerLocation(e.target.value)
                }
              />

            </div>

          </div>

          {/* PRODUCT INFO */}
          <div className="bg-gray-50 p-5 sm:p-6 rounded-3xl">

            <h2 className="text-2xl font-bold text-black mb-5">
              Product Information
            </h2>

            <div className="space-y-4">

              <input
                type="text"
                placeholder="Product name"
                className="w-full border border-gray-300 p-4 rounded-2xl bg-white text-black placeholder:text-gray-500 outline-none focus:border-black"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

              <input
                type="number"
                placeholder="Price"
                className="w-full border border-gray-300 p-4 rounded-2xl bg-white text-black placeholder:text-gray-500 outline-none focus:border-black"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Condition (New / Used / Refurbished)"
                className="w-full border border-gray-300 p-4 rounded-2xl bg-white text-black placeholder:text-gray-500 outline-none focus:border-black"
                value={condition}
                onChange={(e) =>
                  setCondition(e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Storage"
                className="w-full border border-gray-300 p-4 rounded-2xl bg-white text-black placeholder:text-gray-500 outline-none focus:border-black"
                value={storage}
                onChange={(e) =>
                  setStorage(e.target.value)
                }
              />

              <input
                type="text"
                placeholder="RAM"
                className="w-full border border-gray-300 p-4 rounded-2xl bg-white text-black placeholder:text-gray-500 outline-none focus:border-black"
                value={ram}
                onChange={(e) =>
                  setRam(e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Warranty"
                className="w-full border border-gray-300 p-4 rounded-2xl bg-white text-black placeholder:text-gray-500 outline-none focus:border-black"
                value={warranty}
                onChange={(e) =>
                  setWarranty(e.target.value)
                }
              />

              <input
                type="text"
                placeholder="Battery Health"
                className="w-full border border-gray-300 p-4 rounded-2xl bg-white text-black placeholder:text-gray-500 outline-none focus:border-black"
                value={batteryHealth}
                onChange={(e) =>
                  setBatteryHealth(e.target.value)
                }
              />

              <input
                type="file"
                className="w-full border border-gray-300 p-4 rounded-2xl bg-white text-black file:mr-4 file:px-4 file:py-2 file:border-0 file:rounded-xl file:bg-black file:text-white"
                onChange={(e) =>
                  setImageFile(e.target.files[0])
                }
              />

              <textarea
                placeholder="Description"
                className="w-full border border-gray-300 p-4 rounded-2xl h-40 bg-white text-black placeholder:text-gray-500 outline-none focus:border-black resize-none"
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />

            </div>

          </div>

          {/* BUTTON */}
          <button
            onClick={addProduct}
            className="w-full bg-black text-white py-5 rounded-2xl text-lg hover:bg-gray-800 transition font-semibold"
          >
            Upload Product
          </button>

        </div>

      </div>

    </main>

  )
}