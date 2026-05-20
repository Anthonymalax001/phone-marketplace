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

    const sellerName =
      decodeURIComponent(params.seller)

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

      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

        <div className="bg-white rounded-3xl px-8 py-6 shadow-sm">

          <h2 className="text-2xl font-bold text-black text-center">
            Loading Dealer Store...
          </h2>

        </div>

      </div>

    )
  }

  return (

    <main className="min-h-screen bg-gray-100 overflow-x-hidden">

      {/* HERO */}
      <section className="bg-black text-white px-4 sm:px-6 lg:px-10 py-14 sm:py-16">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            {/* LEFT */}
            <div>

              <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-xs sm:text-sm mb-5">
                VERIFIED DEALER
              </div>

              <h1 className="text-4xl sm:text-5xl font-bold break-words">
                {dealer.name}
              </h1>

              <p className="mt-5 text-base sm:text-xl text-gray-300 leading-7 max-w-2xl">
                Trusted smartphone & electronics
                dealer marketplace.
              </p>

            </div>

            {/* RIGHT CARD */}
            <div className="bg-white/10 rounded-3xl p-6 w-full lg:w-[340px] backdrop-blur-sm">

              <h2 className="text-2xl font-bold text-white">
                Dealer Information
              </h2>

              <div className="space-y-5 mt-6">

                <div>

                  <p className="text-gray-400 text-sm">
                    Phone
                  </p>

                  <h3 className="text-base sm:text-lg font-semibold break-words">
                    {dealer.phone}
                  </h3>

                </div>

                <div>

                  <p className="text-gray-400 text-sm">
                    Location
                  </p>

                  <h3 className="text-base sm:text-lg font-semibold break-words">
                    {dealer.location}
                  </h3>

                </div>

                <a
                  href={`https://wa.me/${String(dealer.phone)
                    .replace(/\+/g, '')
                    .replace(/\s/g, '')
                    .replace(/^0/, '254')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >

                  <button className="w-full bg-white text-black py-4 rounded-2xl font-semibold hover:bg-gray-200 transition">

                    Chat on WhatsApp

                  </button>

                </a>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* PRODUCTS */}
      <section className="px-4 sm:px-6 lg:px-10 py-14 sm:py-16">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="mb-10">

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">
              Dealer Listings
            </h2>

            <p className="text-gray-600 mt-3 text-base sm:text-lg">
              {products.length} products available
            </p>

          </div>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

            {products.map((product) => (

              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition duration-300"
              >

                {/* IMAGE */}
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-56 sm:h-64 w-full object-cover"
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

                    <div className="bg-gray-100 text-black px-3 py-1 rounded-full text-sm capitalize font-medium">
                      {product.condition}
                    </div>

                  </div>

                  {/* BUTTON */}
                  <Link href={`/product/${product.id}`}>

                    <button className="w-full bg-black text-white py-4 rounded-2xl mt-6 hover:bg-gray-800 transition font-semibold">

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