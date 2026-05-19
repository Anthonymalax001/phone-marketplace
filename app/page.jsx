'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import Categories from '../components/Categories'

export default function HomePage() {

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {

    setLoading(true)

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('dealer_verified', true)
      .order('id', { ascending: false })

    console.log('PRODUCTS:', data)
    console.log('ERROR:', error)

    if (!error && data) {
      setProducts(data)
    }

    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-100 overflow-x-hidden">

      {/* HERO */}
      <section className="bg-black text-white px-4 sm:px-6 lg:px-10 py-16 lg:py-24">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">

          {/* LEFT */}
          <div>

            <div className="inline-block bg-white/10 px-4 py-2 rounded-full text-xs sm:text-sm mb-6">
              VERIFIED ELECTRONICS MARKETPLACE
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
              Buy Verified Phones & Electronics
            </h1>

            <p className="text-gray-300 mt-6 text-base sm:text-lg lg:text-xl leading-8 max-w-2xl">
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
            <div className="grid grid-cols-3 gap-6 mt-12">

              <div>

                <h2 className="text-2xl lg:text-4xl font-bold">
                  100+
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  Devices
                </p>

              </div>

              <div>

                <h2 className="text-2xl lg:text-4xl font-bold">
                  24/7
                </h2>

                <p className="text-gray-400 text-sm mt-1">
                  Support
                </p>

              </div>

              <div>

                <h2 className="text-2xl lg:text-4xl font-bold">
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
              className="rounded-3xl shadow-2xl w-full h-[300px] sm:h-[450px] lg:h-[520px] object-cover"
            />

            {/* FLOATING CARD */}
            <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:w-72 bg-white text-black rounded-3xl p-5 shadow-2xl">

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

      {/* FEATURED PRODUCTS */}
      <section className="px-4 sm:px-6 lg:px-10 py-16">

        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-10">

            <div>

              <h2 className="text-4xl lg:text-5xl font-bold">
                Featured Products
              </h2>

              <p className="text-gray-500 mt-3 text-base lg:text-lg">
                Verified devices from trusted dealers
              </p>

            </div>

            <Link href="/search?q=iphone">

              <button className="border border-black px-6 py-3 rounded-2xl hover:bg-black hover:text-white transition">
                Explore Marketplace
              </button>

            </Link>

          </div>

          {/* LOADING */}
          {loading ? (

            <div className="bg-white rounded-3xl p-16 text-center">

              <h2 className="text-3xl font-bold">
                Loading Products...
              </h2>

            </div>

          ) : products.length === 0 ? (

            <div className="bg-white rounded-3xl p-16 text-center">

              <h2 className="text-4xl font-bold">
                No Products Found
              </h2>

              <p className="text-gray-500 mt-4 text-lg">
                Add products from the dashboard.
              </p>

            </div>

          ) : (

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
                    <div className="flex flex-wrap gap-2 mt-4">

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

          )}

        </div>

      </section>

    </main>
  )
}