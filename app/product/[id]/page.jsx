'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Heart } from 'lucide-react'
import { supabase } from '../../../lib/supabase'

export default function ProductPage() {

  const params = useParams()
  const router = useRouter()

  const [product, setProduct] = useState(null)
  const [wishlisted, setWishlisted] = useState(false)

  useEffect(() => {
    if (params?.id) {
      fetchProduct()
    }
  }, [params])

  const fetchProduct = async () => {

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single()

    if (!error) {

      setProduct(data)

      const wishlist =
        JSON.parse(localStorage.getItem('wishlist')) || []

      const exists = wishlist.find(
        (item) => item.id === data.id
      )

      setWishlisted(!!exists)
    }
  }

  const addToCart = () => {

    const existingCart =
      JSON.parse(localStorage.getItem('cart')) || []

    const alreadyExists = existingCart.find(
      (item) => item.id === product.id
    )

    if (alreadyExists) {
      alert('Product already in cart')
      return
    }

    const updatedCart = [...existingCart, product]

    localStorage.setItem(
      'cart',
      JSON.stringify(updatedCart)
    )

    window.dispatchEvent(
      new Event('cartUpdated')
    )

    alert('Added to cart')

    router.push('/cart')
  }

  const toggleWishlist = () => {

    const existingWishlist =
      JSON.parse(localStorage.getItem('wishlist')) || []

    const alreadyExists = existingWishlist.find(
      (item) => item.id === product.id
    )

    let updatedWishlist = []

    if (alreadyExists) {

      updatedWishlist =
        existingWishlist.filter(
          (item) => item.id !== product.id
        )

      setWishlisted(false)

    } else {

      updatedWishlist = [
        ...existingWishlist,
        product,
      ]

      setWishlisted(true)
    }

    localStorage.setItem(
      'wishlist',
      JSON.stringify(updatedWishlist)
    )

    window.dispatchEvent(
      new Event('wishlistUpdated')
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading...
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-10">

      <div className="max-w-7xl mx-auto">

        {/* TOP SECTION */}
        <div className="bg-white rounded-3xl p-5 md:p-10 grid lg:grid-cols-2 gap-10 shadow-sm">

          {/* IMAGE */}
          <div>

            <div className="relative overflow-hidden rounded-3xl">

              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition duration-500"
              />

              {/* WISHLIST */}
              <button
                onClick={toggleWishlist}
                className="absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:scale-110 transition"
              >

                <Heart
                  size={24}
                  className={
                    wishlisted
                      ? 'fill-red-500 text-red-500'
                      : 'text-black'
                  }
                />

              </button>

            </div>

            {/* BADGES */}
            <div className="flex flex-wrap gap-3 mt-5">

              {product.dealer_verified && (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                  ✓ Verified Dealer
                </div>
              )}

              {product.warranty && (
                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                  {product.warranty} Warranty
                </div>
              )}

              {product.battery_health && (
                <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold">
                  🔋 {product.battery_health}
                </div>
              )}

            </div>

          </div>

          {/* DETAILS */}
          <div>

            <div className="flex items-start justify-between gap-4">

              <div>

                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  {product.name}
                </h1>

                <p className="text-gray-500 mt-3 text-lg">
                  Premium verified electronics marketplace listing
                </p>

              </div>

              {product.dealer_verified && (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap">
                  VERIFIED
                </div>
              )}

            </div>

            {/* PRICE */}
            <div className="mt-8">

              <p className="text-gray-500 text-sm">
                Price
              </p>

              <h2 className="text-5xl font-bold mt-2">
                KES {product.price}
              </h2>

            </div>

            {/* SPECS */}
            <div className="grid grid-cols-2 gap-4 mt-8">

              <div className="bg-gray-50 p-5 rounded-2xl">

                <p className="text-gray-500 text-sm">
                  Storage
                </p>

                <h3 className="text-xl font-bold mt-2">
                  {product.storage}
                </h3>

              </div>

              <div className="bg-gray-50 p-5 rounded-2xl">

                <p className="text-gray-500 text-sm">
                  RAM
                </p>

                <h3 className="text-xl font-bold mt-2">
                  {product.ram}
                </h3>

              </div>

              <div className="bg-gray-50 p-5 rounded-2xl">

                <p className="text-gray-500 text-sm">
                  Condition
                </p>

                <h3 className="text-xl font-bold mt-2 capitalize">
                  {product.condition}
                </h3>

              </div>

              <div className="bg-gray-50 p-5 rounded-2xl">

                <p className="text-gray-500 text-sm">
                  Battery Health
                </p>

                <h3 className="text-xl font-bold mt-2">
                  {product.battery_health || 'N/A'}
                </h3>

              </div>

            </div>

            {/* DESCRIPTION */}
            <div className="mt-10">

              <h2 className="text-2xl font-bold mb-4">
                Device Description
              </h2>

              <p className="text-gray-700 leading-8 text-lg">
                {product.description}
              </p>

            </div>

            {/* DEALER */}
            <div className="bg-gray-50 rounded-3xl p-6 mt-10">

              <div className="flex items-center justify-between gap-4">

                <div>

                  <p className="text-gray-500 text-sm">
                    Sold by
                  </p>

                  <h2 className="text-2xl font-bold mt-1">
                    {product.seller_name || 'Tech Dealer'}
                  </h2>

                </div>

                <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  product.dealer_verified
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {product.dealer_verified
                    ? 'Verified Dealer'
                    : 'Pending Verification'}
                </div>

              </div>

              <div className="grid md:grid-cols-2 gap-5 mt-6">

                <div className="bg-white p-5 rounded-2xl">

                  <p className="text-gray-500 text-sm">
                    Phone Number
                  </p>

                  <h3 className="text-lg font-bold mt-2">
                    {product.seller_phone || 'Not Provided'}
                  </h3>

                </div>

                <div className="bg-white p-5 rounded-2xl">

                  <p className="text-gray-500 text-sm">
                    Shop Location
                  </p>

                  <h3 className="text-lg font-bold mt-2">
                    {product.seller_location || 'Nairobi, Kenya'}
                  </h3>

                </div>

              </div>

            </div>

            {/* ACTIONS */}
            <div className="grid md:grid-cols-2 gap-4 mt-10">

              <a
  href={`https://wa.me/${String(product.seller_phone)
    .replace(/\+/g, '')
    .replace(/\s/g, '')
    .replace(/^0/, '254')}`}
  target="_blank"
  rel="noopener noreferrer"
  className="w-full"
>

  <button className="w-full bg-black text-white py-4 rounded-2xl text-lg hover:bg-gray-800 transition font-semibold">
    Chat on WhatsApp
  </button>

</a>

              <button
                onClick={addToCart}
                className="border border-black py-4 rounded-2xl text-lg hover:bg-black hover:text-white transition font-semibold"
              >
                Add To Cart
              </button>

            </div>

            {/* WISHLIST BUTTON */}
            <button
              onClick={toggleWishlist}
              className={`w-full py-4 rounded-2xl text-lg mt-4 transition font-semibold ${
                wishlisted
                  ? 'bg-red-500 text-white'
                  : 'bg-white border border-black hover:bg-black hover:text-white'
              }`}
            >

              {wishlisted
                ? 'Saved To Wishlist ❤️'
                : 'Save To Wishlist'}

            </button>

            {/* BUYER PROTECTION */}
            <div className="bg-gray-50 rounded-2xl p-6 mt-10">

              <h3 className="text-2xl font-bold">
                Buyer Protection
              </h3>

              <div className="mt-5 space-y-4 text-gray-700">

                <p>
                  ✓ Verified seller & device checks
                </p>

                <p>
                  ✓ Secure transactions
                </p>

                <p>
                  ✓ Return policy available
                </p>

                <p>
                  ✓ Trade-in support
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </main>
  )
}