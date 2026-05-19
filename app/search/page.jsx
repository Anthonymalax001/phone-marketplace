'use client'

import {
  Suspense,
  useEffect,
  useState
} from 'react'

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
    <main className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-10 py-8 lg:py-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold break-words">
            Search Results
          </h1>

          <p className="text-gray-500 mt-3 text-base sm:text-lg break-words">
            Showing results for "{query}"
          </p>

        </div>

        {/* LOADING */}
        {loading ? (

          <div className="bg-white rounded-3xl p-10 sm:p-16 text-center shadow-sm">

            <h2 className="text-2xl sm:text-3xl font-bold">
              Loading Products...
            </h2>

          </div>

        ) : products.length === 0 ? (

          <div className="bg-white rounded-3xl p-10 sm:p-16 text-center shadow-sm">

            <h2 className="text-2xl sm:text-3xl font-bold">
              No products found
            </h2>

            <p className="text-gray-500 mt-4 text-base sm:text-lg">
              Try another search keyword.
            </p>

          </div>

        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {products.map((product) => (

              <Link
                href={`/product/${product.id}`}
                key={product.id}
              >

                <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition duration-300 cursor-pointer h-full">

                  {/* IMAGE */}
                  <div className="relative">

                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-60 sm:h-64 object-cover"
                    />

                    {product.dealer_verified && (

                      <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">

                        VERIFIED

                      </div>

                    )}

                  </div>

                  {/* CONTENT */}
                  <div className="p-5">

                    <h2 className="text-xl sm:text-2xl font-bold line-clamp-1">
                      {product.name}
                    </h2>

                    <p className="text-gray-500 mt-2 text-sm sm:text-base">
                      {product.storage}
                    </p>

                    <h3 className="text-2xl sm:text-3xl font-bold mt-4">
                      KES {product.price}
                    </h3>

                    {/* SPECS */}
                    <div className="flex flex-wrap gap-2 mt-4">

                      {product.ram && (

                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                          {product.ram}
                        </div>

                      )}

                      {product.condition && (

                        <div className="bg-gray-100 px-3 py-1 rounded-full text-sm capitalize">
                          {product.condition}
                        </div>

                      )}

                    </div>

                    {/* DEALER */}
                    <div className="mt-5">

                      <p className="text-gray-500 text-sm">
                        Sold by
                      </p>

                      <h3 className="font-bold mt-1">
                        {product.seller_name}
                      </h3>

                    </div>

                    {/* BUTTON */}
                    <button className="w-full bg-black text-white py-3 rounded-2xl mt-6 hover:bg-gray-800 transition font-semibold">

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
    <Suspense
      fallback={

        <div className="min-h-screen bg-gray-100 flex items-center justify-center">

          <div className="bg-white rounded-3xl p-10 shadow-sm">

            <h2 className="text-2xl font-bold">
              Loading...
            </h2>

          </div>

        </div>

      }
    >

      <SearchContent />

    </Suspense>
  )
}