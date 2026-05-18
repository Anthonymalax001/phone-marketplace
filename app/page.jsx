'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import Categories from '../components/Categories'

export default function HomePage() {

  const [products, setProducts] = useState([])

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false })

    if (!error) {
      setProducts(data)
    }

  }

  return (
    <main className="min-h-screen bg-gray-100">

      {/* HERO */}
      <section className="bg-black text-white px-4 sm:px-6 md:px-10 py-14 md:py-20 overflow-hidden">

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT */}
          <div>

            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-xs sm:text-sm mb-6">
              VERIFIED ELECTRONICS MARKETPLACE
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold leading-tight">
              Buy Verified Phones & Electronics
            </h1>

            <p className="text-gray-300 mt-6 md:mt-8 leading-8 text-base sm:text-lg md:text-xl max-w-2xl">
              Discover verified iPhones, Samsung devices,
              gaming consoles, laptops and accessories
              from trusted Kenyan dealers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-10">

              <Link href="/search?q=iphone">
                <button className="w-full sm:w-auto bg-white text-black px-8 py-4 rounded-2xl text-lg font-semibold hover:scale-[1.02] transition">
                  Shop iPhones
                </button>
              </Link>

              <Link href="/search?q=samsung">
                <button className="w-full sm:w-auto border border-white px-8 py-4 rounded-2xl text-lg hover:bg-white hover:text-black transition">
                  Samsung Deals
                </button>
              </Link>

            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-4 mt-12">

              <div>
                <h2 className="text-2xl md:text-4xl font-bold">
                  100+
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  Devices
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-4xl font-bold">
                  24/7
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  Support
                </p>
              </div>

              <div>
                <h2 className="text-2xl md:text-4xl font-bold">
                  Secure
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  Payments
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT */}
          <div className="relative">

            <img
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9"
              alt="Phones"
              className="rounded-3xl shadow-2xl w-full h-[300px] sm:h-[450px] object-cover"
            />

            {/* FLOATING CARD */}
            <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-72 bg-white text-black rounded-3xl p-5 shadow-2xl">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-gray-500 text-sm">
                    Trending
                  </p>

                  <h3 className="text-xl font-bold mt-1">
                    iPhone 15 Pro
                  </h3>
                </div>

                <div className="bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full">
                  VERIFIED
                </div>

              </div>

              <p className="text-2xl font-bold mt-4">
                KES 135,000
              </p>

            </div>

          </div>

        </div>

      </section>

      {/* CATEGORIES */}
      <Categories />

      {/* FEATURED */}
      <section className="px-4 sm:px-6 md:px-10 py-14 md:py-16">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

            <div>

              <h2 className="text-4xl md:text-5xl font-bold">
                Featured Products
              </h2>

              <p className="text-gray-500 mt-3 text-base md:text-lg">
                Verified devices from trusted dealers
              </p>

            </div>

            <Link href="/search?q=iphone">

              <button className="border border-black px-6 py-3 rounded-2xl hover:bg-black hover:text-white transition">
                Explore Marketplace
              </button>

            </Link>

          </div>

          {/* PRODUCTS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

            {products.map((product) => (

              <div
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-1 transition duration-300"
              >

                <div className="relative">

                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="h-64 w-full object-cover"
                  />

                  {product.dealer_verified && (
                    <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full font-semibold">
                      VERIFIED
                    </div>
                  )}

                </div>

                <div className="p-5">

                  <h2 className="text-2xl font-bold line-clamp-1">
                    {product.name}
                  </h2>

                  <p className="text-2xl font-bold mt-4">
                    KES {product.price}
                  </p>

                  {/* SPECS */}
                  <div className="flex gap-2 flex-wrap mt-4">

                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {product.storage}
                    </div>

                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                      {product.ram}
                    </div>

                    <div className="bg-gray-100 px-3 py-1 rounded-full text-sm capitalize">
                      {product.condition}
                    </div>

                  </div>

                  {/* DEALER */}
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