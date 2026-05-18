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
    <section className="px-4 sm:px-6 md:px-10 py-14 bg-white">

      <div className="max-w-7xl mx-auto">

        <div className="mb-10">

          <h2 className="text-4xl md:text-5xl font-bold">
            Browse Categories
          </h2>

          <p className="text-gray-500 mt-3 text-lg">
            Explore verified electronics instantly
          </p>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">

          {categories.map((category) => {

            const Icon = category.icon

            return (

              <Link
                key={category.name}
                href={`/search?q=${category.query}`}
              >

                <div className="bg-gray-100 hover:bg-black hover:text-white transition rounded-3xl p-8 text-center cursor-pointer">

                  <div className="flex justify-center mb-5">
                    <Icon size={42} />
                  </div>

                  <h3 className="text-xl font-bold">
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