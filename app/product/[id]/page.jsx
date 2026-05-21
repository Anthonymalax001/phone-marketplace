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

    if (!error && data) {

      setProduct(data)

      const wishlist =
        JSON.parse(
          localStorage.getItem('wishlist')
        ) || []

      const exists = wishlist.find(
        (item) => item.id === data.id
      )

      setWishlisted(!!exists)
    }
  }

  const addToCart = () => {

    const existingCart =
      JSON.parse(
        localStorage.getItem('cart')
      ) || []

    const alreadyExists = existingCart.find(
      (item) => item.id === product.id
    )

    if (alreadyExists) {

      alert('Product already in cart')
      return
    }

    const updatedCart = [
      ...existingCart,
      product,
    ]

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
      JSON.parse(
        localStorage.getItem('wishlist')
      ) || []

    const alreadyExists =
      existingWishlist.find(
        (item) => item.id === product.id
      )

    let updatedWishlist = []

    if (alreadyExists) {

      updatedWishlist =
        existingWishlist.filter(
          (item) =>
            item.id !== product.id
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

      <div className="min-h-screen flex items-center justify-center bg-gray-100">

        <div className="bg-white px-10 py-8 rounded-3xl shadow-sm">

          <h2 className="text-2xl font-bold text-black">
            Loading...
          </h2>

        </div>

      </div>

    )
  }

  return (

    <main className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-10 py-6 lg:py-10 overflow-x-hidden">

      <div className="max-w-7xl mx-auto">

        <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-10 grid lg:grid-cols-2 gap-8 lg:gap-12 shadow-sm">

          {/* IMAGE */}
          <div>

            <div className="relative overflow-hidden rounded-3xl bg-gray-100">

              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-[320px] sm:h-[450px] lg:h-[600px] object-cover"
              />

              <button
                onClick={toggleWishlist}
                className="absolute top-4 right-4 bg-white text-black p-3 rounded-full shadow-lg hover:scale-110 transition"
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
          <div className="text-black">

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">

              <div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight break-words text-black">
                  {product.name}
                </h1>

                <p className="text-gray-600 mt-3 text-base sm:text-lg">
                  Premium verified marketplace listing
                </p>

              </div>

              {product.dealer_verified && (

                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap w-fit">
                  VERIFIED
                </div>

              )}

            </div>

            {/* PRICE */}
            <div className="mt-8">

              <p className="text-gray-500 text-sm">
                Price
              </p>

              <h2 className="text-4xl sm:text-5xl font-bold mt-2 break-words text-black">
                KES {product.price}
              </h2>

            </div>

            {/* SPECS */}
            <div className="grid grid-cols-2 gap-4 mt-8">

              {[
                ['Storage', product.storage],
                ['RAM', product.ram],
                ['Condition', product.condition],
                ['Battery Health', product.battery_health || 'N/A']
              ].map(([label, value]) => (

                <div
                  key={label}
                  className="bg-gray-50 border border-gray-200 p-4 sm:p-5 rounded-2xl"
                >

                  <p className="text-gray-500 text-sm">
                    {label}
                  </p>

                  <h3 className="text-lg sm:text-xl font-bold mt-2 text-black capitalize">
                    {value}
                  </h3>

                </div>

              ))}

            </div>

            {/* DESCRIPTION */}
            <div className="mt-10">

              <h2 className="text-2xl font-bold mb-4 text-black">
                Device Description
              </h2>

              <p className="text-gray-700 leading-7 sm:leading-8 text-base sm:text-lg break-words">
                {product.description}
              </p>

            </div>

            {/* DEALER */}
            <div className="bg-gray-50 border border-gray-200 rounded-3xl p-5 sm:p-6 mt-10">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>

                  <p className="text-gray-500 text-sm">
                    Sold by
                  </p>

                  <h2 className="text-2xl font-bold mt-1 break-words text-black">
                    {product.seller_name || 'Tech Dealer'}
                  </h2>

                </div>

                <div
                  className={`px-4 py-2 rounded-full text-sm font-semibold w-fit ${
                    product.dealer_verified
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >

                  {product.dealer_verified
                    ? 'Verified Dealer'
                    : 'Pending Verification'}

                </div>

              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-6">

                <div className="bg-white border border-gray-200 p-5 rounded-2xl">

                  <p className="text-gray-500 text-sm">
                    Phone Number
                  </p>

                  <h3 className="text-base sm:text-lg font-bold mt-2 break-words text-black">
                    {product.seller_phone || 'Not Provided'}
                  </h3>

                </div>

                <div className="bg-white border border-gray-200 p-5 rounded-2xl">

                  <p className="text-gray-500 text-sm">
                    Shop Location
                  </p>

                  <h3 className="text-base sm:text-lg font-bold mt-2 break-words text-black">
                    {product.seller_location || 'Nairobi, Kenya'}
                  </h3>

                </div>

              </div>

            </div>

            {/* ACTIONS */}
            <div className="grid sm:grid-cols-2 gap-4 mt-10">

              <a
                href={`https://wa.me/${String(product.seller_phone)
                  .replace(/\+/g, '')
                  .replace(/\s/g, '')
                  .replace(/^0/, '254')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >

                <button className="w-full bg-black text-white py-4 rounded-2xl text-base sm:text-lg hover:bg-gray-800 transition font-semibold">

                  Chat on WhatsApp

                </button>

              </a>

              <button
                onClick={addToCart}
                className="border-2 border-black bg-white text-black py-4 rounded-2xl text-base sm:text-lg hover:bg-black hover:text-white transition font-semibold"
              >

                Add To Cart

              </button>

            </div>

            <button
              onClick={toggleWishlist}
              className={`w-full py-4 rounded-2xl text-base sm:text-lg mt-4 transition font-semibold ${
                wishlisted
                  ? 'bg-red-500 text-white'
                  : 'bg-white border-2 border-black text-black hover:bg-black hover:text-white'
              }`}
            >

              {wishlisted
                ? 'Saved To Wishlist ❤️'
                : 'Save To Wishlist'}

            </button>

            {/* BUYER PROTECTION */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 sm:p-6 mt-10">

              <h3 className="text-2xl font-bold text-black">
                Buyer Protection
              </h3>

              <div className="mt-5 space-y-4 text-gray-700 text-sm sm:text-base">

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