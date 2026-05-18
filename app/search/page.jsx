'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function SearchPage() {

  const searchParams = useSearchParams()

  const query =
    searchParams.get('q') || ''

  const [products, setProducts] = useState([])

  const [sort, setSort] =
    useState('latest')

  const [condition, setCondition] =
    useState('all')

  useEffect(() => {
    fetchProducts()
  }, [query, sort, condition])

  const fetchProducts = async () => {

    let request = supabase
      .from('products')
      .select('*')
      .or(
        `name.ilike.%${query}%,description.ilike.%${query}%`
      )

    // CONDITION FILTER
    if (condition !== 'all') {
      request = request.eq(
        'condition',
        condition
      )
    }

    // SORTING
    if (sort === 'low') {
      request = request.order(
        'price',
        { ascending: true }
      )
    }

    else if (sort === 'high') {
      request = request.order(
        'price',
        { ascending: false }
      )
    }

    else {
      request = request.order(
        'id',
        { ascending: false }
      )
    }

    const { data, error } =
      await request

    if (!error) {
      setProducts(data)
    }

  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 md:px-10 py-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-4xl md:text-5xl font-bold">
            Search Results
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Showing results for "{query}"
          </p>

        </div>

        {/* FILTERS */}
        <div className="bg-white rounded-3xl p-5 mb-10 flex flex-col md:flex-row gap-5 md:items-center md:justify-between">

          <div className="flex flex-col sm:flex-row gap-4">

            {/* SORT */}
            <select
              value={sort}
              onChange={(e) =>
                setSort(e.target.value)
              }
              className="border rounded-2xl px-5 py-3"
            >

              <option value="latest">
                Latest
              </option>

              <option value="low">
                Price: Low to High
              </option>

              <option value="high">
                Price: High to Low
              </option>

            </select>

            {/* CONDITION */}
            <select
              value={condition}
              onChange={(e) =>
                setCondition(e.target.value)
              }
              className="border rounded-2xl px-5 py-3"
            >

              <option value="all">
                All Conditions
              </option>

              <option value="New">
                New
              </option>

              <option value="Used">
                Used
              </option>

              <option value="Refurbished">
                Refurbished
              </option>

            </select>

          </div>

          <div className="text-gray-500">
            {products.length} products found
          </div>

        </div>

        {/* PRODUCTS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {products.map((product) => (

            <div
              key={product.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition"
            >

              <img
                src={product.image_url}
                alt={product.name}
                className="h-64 w-full object-cover"
              />

              <div className="p-5">

                <div className="flex items-center justify-between gap-3">

                  <h2 className="text-2xl font-bold line-clamp-1">
                    {product.name}
                  </h2>

                  {product.verified && (
                    <div className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full whitespace-nowrap">
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

                  <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {product.condition}
                  </div>

                </div>

                <div className="mt-5">

                  <p className="text-gray-500 text-sm">
                    Sold by
                  </p>

                  <Link
                    href={`/dealer/${product.dealer_slug}`}
                  >
                    <h3 className="font-bold hover:underline cursor-pointer mt-1">
                      {product.seller_name}
                    </h3>
                  </Link>

                </div>

                <Link href={`/product/${product.id}`}>
                  <button className="w-full bg-black text-white py-4 rounded-2xl mt-6">
                    View Device
                  </button>
                </Link>

              </div>

            </div>

          ))}

        </div>

      </div>

    </main>
  )
}