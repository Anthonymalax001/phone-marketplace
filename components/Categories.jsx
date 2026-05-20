'use client'

import Link from 'next/link'

import {
  Smartphone,
  Laptop,
  Gamepad2,
  Headphones,
} from 'lucide-react'

export default function Categories() {

  const categories = [
    {
      name: 'iPhones',
      icon: Smartphone,
      query: 'iphone',
    },
    {
      name: 'Samsung',
      icon: Smartphone,
      query: 'samsung',
    },
    {
      name: 'Laptops',
      icon: Laptop,
      query: 'laptop',
    },
    {
      name: 'Gaming',
      icon: Gamepad2,
      query: 'ps5',
    },
    {
      name: 'Accessories',
      icon: Headphones,
      query: 'airpods',
    },
  ]

  return (

    <section className="px-4 sm:px-6 lg:px-10 py-14 bg-white overflow-x-hidden">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">
            Browse Categories
          </h2>

          <p className="text-gray-600 mt-3 text-base sm:text-lg">
            Explore verified electronics instantly
          </p>

        </div>

        {/* CATEGORIES */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">

          {categories.map((category) => {

            const Icon = category.icon

            return (

              <Link
                key={category.name}
                href={`/search?q=${category.query}`}
              >

                <div className="bg-white border border-gray-200 hover:bg-black hover:text-white transition-all duration-300 rounded-3xl p-6 sm:p-8 text-center cursor-pointer shadow-sm hover:shadow-xl">

                  <div className="flex justify-center mb-5 text-black hover:text-white">

                    <Icon size={38} />

                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-black group-hover:text-white">
                    {category.name}
                  </h3>

                </div>

              </Link>

            )

          })}

        </div>

      </div>

    </section>

  )
}