'use client'

import Link from 'next/link'

import {
  ShoppingCart,
  Repeat,
  Search
} from 'lucide-react'

import {
  useEffect,
  useState
} from 'react'

export default function Navbar() {

  const [cartCount, setCartCount] = useState(0)

  useEffect(() => {

    const updateCartCount = () => {

      const cart =
        JSON.parse(
          localStorage.getItem('cart')
        ) || []

      setCartCount(cart.length)
    }

    updateCartCount()

    window.addEventListener(
      'cartUpdated',
      updateCartCount
    )

    return () => {

      window.removeEventListener(
        'cartUpdated',
        updateCartCount
      )
    }

  }, [])

  return (

    <nav className="bg-white border-b sticky top-0 z-50">

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4">

        {/* TOP NAV */}
        <div className="flex items-center justify-between gap-2">

          {/* LOGO */}
          <Link href="/">

            <h1 className="text-xl sm:text-3xl font-bold cursor-pointer whitespace-nowrap text-black">
              PhoneHub
            </h1>

          </Link>

          {/* DESKTOP SEARCH */}
          <div className="flex-1 hidden lg:block">

            <form
              action="/search"
              method="GET"
              className="relative max-w-2xl mx-auto"
            >

              <input
                type="text"
                name="q"
                placeholder="Search iPhones, Samsung, PS5..."
                className="w-full border-2 border-gray-300 rounded-2xl px-5 py-3 pr-14 outline-none focus:border-black bg-white text-black placeholder:text-gray-600"
              />

              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700"
              >

                <Search size={20} />

              </button>

            </form>

          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2">

            {/* TRADE IN */}
            <Link href="/trade-in">

              <button className="flex items-center gap-1 border border-gray-300 px-2 sm:px-4 py-3 rounded-2xl hover:bg-gray-100 transition font-semibold whitespace-nowrap text-xs sm:text-base text-black bg-white">

                <Repeat size={15} />

                <span>
                  Trade-In
                </span>

              </button>

            </Link>

            {/* DEALER LOGIN */}
            <Link href="/auth">

              <button className="bg-black text-white px-3 sm:px-5 py-3 rounded-2xl hover:bg-gray-800 transition font-semibold text-xs sm:text-base whitespace-nowrap">
                Dealer Login
              </button>

            </Link>

            {/* CART */}
            <Link href="/cart">

              <div className="relative cursor-pointer">

                <div className="border border-gray-300 p-3 rounded-2xl hover:bg-gray-100 transition bg-white">

                  <ShoppingCart
                    size={20}
                    className="text-black"
                  />

                </div>

                {cartCount > 0 && (

                  <div className="absolute -top-2 -right-2 bg-black text-white min-w-[22px] h-[22px] px-1 rounded-full text-xs flex items-center justify-center font-bold">

                    {cartCount}

                  </div>

                )}

              </div>

            </Link>

          </div>

        </div>

        {/* MOBILE SEARCH */}
        <div className="mt-4 lg:hidden">

          <form
            action="/search"
            method="GET"
            className="relative"
          >

            <input
              type="text"
              name="q"
              placeholder="Search phones..."
              className="w-full border-2 border-gray-300 rounded-2xl px-5 py-3 pr-14 outline-none focus:border-black bg-white text-black placeholder:text-gray-600"
            />

            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700"
            >

              <Search size={20} />

            </button>

          </form>

        </div>

      </div>

    </nav>

  )
}