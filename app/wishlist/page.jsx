'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function WishlistPage() {

  const [wishlist, setWishlist] = useState([])

  useEffect(() => {

    const savedWishlist =
      JSON.parse(localStorage.getItem('wishlist')) || []

    setWishlist(savedWishlist)

  }, [])

  const removeFromWishlist = (id) => {

    const updatedWishlist =
      wishlist.filter((item) => item.id !== id)

    setWishlist(updatedWishlist)

    localStorage.setItem(
      'wishlist',
      JSON.stringify(updatedWishlist)
    )

    window.dispatchEvent(new Event('wishlistUpdated'))
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

          <div>

            <h1 className="text-4xl md:text-5xl font-bold">
              Wishlist
            </h1>

            <p className="text-gray-500 mt-3">
              {wishlist.length} saved items
            </p>

          </div>

          <Link href="/">
            <button className="border border-black px-6 py-3 rounded-2xl hover:bg-black hover:text-white transition">
              Continue Shopping
            </button>
          </Link>

        </div>

        {wishlist.length === 0 ? (

          <div className="bg-white rounded-3xl p-10 md:p-16 text-center">

            <h2 className="text-3xl font-bold">
              Your wishlist is empty
            </h2>

            <p className="text-gray-500 mt-4">
              Save devices you love and come back later.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {wishlist.map((product) => (

              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition"
              >

                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-64 object-cover"
                />

                <div className="p-5">

                  <div className="flex items-center justify-between gap-3">

                    <h2 className="text-2xl font-bold line-clamp-1">
                      {product.name}
                    </h2>

                    {product.verified && (
                      <div className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                        VERIFIED
                      </div>
                    )}

                  </div>

                  <p className="text-2xl font-bold mt-4">
                    KES {product.price}
                  </p>

                  <div className="flex gap-2 flex-wrap mt-4">

                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {product.storage}
                    </div>

                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {product.ram}
                    </div>

                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-6">

                    <Link href={`/product/${product.id}`}>

                      <button className="w-full bg-black text-white py-3 rounded-2xl hover:bg-gray-800 transition">
                        View
                      </button>

                    </Link>

                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="border border-red-500 text-red-500 py-3 rounded-2xl hover:bg-red-500 hover:text-white transition"
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