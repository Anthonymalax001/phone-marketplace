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

  useEffect(() => {

    fetchProducts()

  }, [query])

  const fetchProducts = async () => {

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${query}%`)

    if (!error) {
      setProducts(data)
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-10">

      <div className="max-w-7xl mx-auto">

        <div className="mb-10">

          <h1 className="text-4xl md:text-5xl font-bold">
            Search Results
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Showing results for "{query}"
          </p>

        </div>

        {products.length === 0 ? (

          <div className="bg-white rounded-3xl p-16 text-center">

            <h2 className="text-3xl font-bold">
              No products found
            </h2>

          </div>

        ) : (

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {products.map((product) => (

              <Link
                href={`/product/${product.id}`}
                key={product.id}
              >

                <div className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-lg transition cursor-pointer">

                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-64 object-cover rounded-2xl"
                  />

                  <div className="mt-5">

                    <h2 className="text-2xl font-bold">
                      {product.name}
                    </h2>

                    <p className="text-gray-500 mt-2">
                      {product.storage}
                    </p>

                    <h3 className="text-3xl font-bold mt-4">
                      KES {product.price}
                    </h3>

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