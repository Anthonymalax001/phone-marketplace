'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

function SearchContent() {

  const searchParams = useSearchParams()

  const query =
    searchParams.get('q') || ''

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    fetchProducts()

  }, [query])

  const fetchProducts = async () => {

    setLoading(true)

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('dealer_verified', true)
      .ilike('name', `%${query}%`)
      .order('id', { ascending: false })

    if (!error && data) {
      setProducts(data)
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-10 py-8 overflow-x-hidden">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black break-words">
            Search Results
          </h1>

          <p className="text-gray-600 mt-3 text-base sm:text-lg break-words">
            Showing results for "
            <span className="font-semibold text-black">
              {query}
            </span>
            "
          </p>

        </div>

        {/* LOADING */}
        {loading ? (

          <div className="bg-white rounded-3xl p-10 sm:p-16 text-center shadow-sm">

            <h2 className="text-2xl sm:text-3xl font-bold text-black">
              Loading Products...
            </h2>

          </div>

        ) : products.length === 0 ? (

          <div className="bg-white rounded-3xl p-10 sm:p-16 text-center shadow-sm">

            <h2 className="text-3xl font-bold text-black">
              No products found
            </h2>

            <p className="text-gray-500 mt-4 text-base sm:text-lg">
              Try searching another device.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {products.map((product) => (

              <Link
                href={`/product/${product.id}`}
                key={product.id}
              >

                <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition duration-300 h-full">

                  {/* IMAGE */}
                  <div className="relative">

                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-56 sm:h-64 object-cover"
                    />

                    {product.dealer_verified && (

                      <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
                        VERIFIED
                      </div>

                    )}

                  </div>

                  {/* CONTENT */}
                  <div className="p-5">

                    <h2 className="text-xl sm:text-2xl font-bold text-black line-clamp-1">
                      {product.name}
                    </h2>

                    <p className="text-2xl font-bold mt-4 text-black">
                      KES {product.price}
                    </p>

                    {/* SPECS */}
                    <div className="flex flex-wrap gap-2 mt-4">

                      {product.storage && (

                        <div className="bg-gray-200 text-black px-3 py-1 rounded-full text-sm font-medium">
                          {product.storage}
                        </div>

                      )}

                      {product.ram && (

                        <div className="bg-gray-200 text-black px-3 py-1 rounded-full text-sm font-medium">
                          {product.ram}
                        </div>

                      )}

                      {product.condition && (

                        <div className="bg-gray-200 text-black px-3 py-1 rounded-full text-sm font-medium capitalize">
                          {product.condition}
                        </div>

                      )}

                    </div>

                    {/* DEALER */}
                    <div className="mt-5">

                      <p className="text-gray-500 text-sm">
                        Sold by
                      </p>

                      <h3 className="font-bold text-black mt-1 line-clamp-1">
                        {product.seller_name || 'Verified Dealer'}
                      </h3>

                    </div>

                    {/* BUTTON */}
                    <button className="w-full bg-black text-white py-4 rounded-2xl mt-6 hover:bg-gray-800 transition font-semibold">
                      View Device
                    </button>

                  </div>

                </div>

              </Link>

            ))}

          </div>

        )}

      </div>

    </main>
  )
}

export default function SearchPage() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  )
}