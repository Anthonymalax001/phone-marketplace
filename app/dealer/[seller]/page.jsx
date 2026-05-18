'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function DealerStorefront() {

  const params = useParams()

  const [products, setProducts] = useState([])
  const [dealer, setDealer] = useState(null)

  useEffect(() => {
    if (params?.seller) {
      fetchDealerProducts()
    }
  }, [params])

  const fetchDealerProducts = async () => {

    const sellerName = decodeURIComponent(params.seller)

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('seller_name', sellerName)

    if (!error && data.length > 0) {
      setProducts(data)

      setDealer({
        name: data[0].seller_name,
        phone: data[0].seller_phone,
        location: data[0].seller_location,
      })
    }
  }

  if (!dealer) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl">
        Loading Dealer Store...
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-100">

      {/* HERO */}
      <section className="bg-black text-white px-6 md:px-10 py-16">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

            <div>

              <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-sm mb-5">
                VERIFIED DEALER
              </div>

              <h1 className="text-5xl font-bold">
                {dealer.name}
              </h1>

              <p className="mt-5 text-xl text-gray-300">
                Trusted smartphone & electronics dealer marketplace.
              </p>

            </div>

            <div className="bg-white/10 rounded-3xl p-6 min-w-[300px]">

              <h2 className="text-2xl font-bold">
                Dealer Information
              </h2>

              <div className="space-y-4 mt-5">

                <div>
                  <p className="text-gray-400 text-sm">
                    Phone
                  </p>

                  <h3 className="text-lg font-semibold">
                    {dealer.phone}
                  </h3>
                </div>

                <div>
                  <p className="text-gray-400 text-sm">
                    Location
                  </p>

                  <h3 className="text-lg font-semibold">
                    {dealer.location}
                  </h3>
                </div>

                <a
                  href={`https://wa.me/${dealer.phone}`}
                  target="_blank"
                >
                  <button className="w-full bg-white text-black py-4 rounded-2xl font-semibold mt-3">
                    Chat on WhatsApp
                  </button>
                </a>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* PRODUCTS */}
      <section className="px-6 md:px-10 py-16">

        <div className="max-w-7xl mx-auto">

          <div className="flex items-center justify-between mb-10">

            <div>
              <h2 className="text-4xl font-bold">
                Dealer Listings
              </h2>

              <p className="text-gray-500 mt-2">
                {products.length} products available
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">

            {products.map((product) => (

              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition"
              >

                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-64 w-full object-cover"
                />

                <div className="p-5">

                  <div className="flex items-center justify-between">

                    <h2 className="text-2xl font-bold">
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

                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {product.condition}
                    </div>

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

      </section>

    </main>
  )
}