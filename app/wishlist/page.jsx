'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function WishlistPage() {

  const [wishlist, setWishlist] = useState([])

  useEffect(() => {

    const savedWishlist =
      JSON.parse(
        localStorage.getItem('wishlist')
      ) || []

    setWishlist(savedWishlist)

  }, [])

  const removeFromWishlist = (id) => {

    const updatedWishlist =
      wishlist.filter(
        (item) => item.id !== id
      )

    setWishlist(updatedWishlist)

    localStorage.setItem(
      'wishlist',
      JSON.stringify(updatedWishlist)
    )

    window.dispatchEvent(
      new Event('wishlistUpdated')
    )
  }

  return (

    <main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-10 lg:py-10 overflow-x-hidden">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

          <div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">
              Wishlist
            </h1>

            <p className="text-gray-600 mt-3 text-base sm:text-lg">
              {wishlist.length} saved items
            </p>

          </div>

          <Link href="/">

            <button className="border border-black bg-white text-black px-6 py-3 rounded-2xl hover:bg-black hover:text-white transition font-semibold w-full sm:w-auto">

              Continue Shopping

            </button>

          </Link>

        </div>

        {/* EMPTY */}
        {wishlist.length === 0 ? (

          <div className="bg-white rounded-3xl p-10 sm:p-16 text-center shadow-sm">

            <h2 className="text-3xl sm:text-4xl font-bold text-black">
              Your wishlist is empty
            </h2>

            <p className="text-gray-500 mt-4 text-base sm:text-lg">
              Save devices you love and come back later.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {wishlist.map((product) => (

              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition duration-300"
              >

                {/* IMAGE */}
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-56 sm:h-64 object-cover"
                />

                {/* CONTENT */}
                <div className="p-5">

                  <div className="flex items-start justify-between gap-3">

                    <h2 className="text-xl sm:text-2xl font-bold text-black line-clamp-2 break-words">
                      {product.name}
                    </h2>

                    {product.verified && (

                      <div className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full whitespace-nowrap font-semibold">

                        VERIFIED

                      </div>

                    )}

                  </div>

                  {/* PRICE */}
                  <p className="text-2xl font-bold text-black mt-4 break-words">
                    KES {Number(product.price).toLocaleString()}
                  </p>

                  {/* SPECS */}
                  <div className="flex flex-wrap gap-2 mt-4">

                    <div className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm font-medium">
                      {product.storage}
                    </div>

                    <div className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm font-medium">
                      {product.ram}
                    </div>

                    {product.condition && (

                      <div className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm capitalize font-medium">

                        {product.condition}

                      </div>

                    )}

                  </div>

                  {/* BUTTONS */}
                  <div className="grid grid-cols-2 gap-3 mt-6">

                    <Link href={`/product/${product.id}`}>

                      <button className="w-full bg-black text-white py-3 rounded-2xl hover:bg-gray-800 transition font-semibold">

                        View

                      </button>

                    </Link>

                    <button
                      onClick={() =>
                        removeFromWishlist(product.id)
                      }
                      className="border border-red-500 text-red-500 py-3 rounded-2xl hover:bg-red-500 hover:text-white transition font-semibold"
                    >

                      Remove

                    </button>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>

  )
}