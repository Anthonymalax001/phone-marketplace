'use client'

import Link from 'next/link'
import {
  ShoppingCart,
  Repeat
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

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between gap-4">

        {/* LOGO */}
        <Link href="/">

          <h1 className="text-2xl md:text-3xl font-bold cursor-pointer">
            PhoneHub
          </h1>

        </Link>

        {/* SEARCH */}
        <div className="flex-1 hidden md:block">

          <form
            action="/search"
            method="GET"
            className="relative"
          >

            <input
              type="text"
              name="q"
              placeholder="Search iPhones, Samsung, PS5..."
              className="w-full border rounded-2xl px-5 py-3 pr-14 outline-none focus:border-black"
            />

            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2"
            >
              🔍
            </button>

          </form>

        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-3">

          {/* TRADE IN */}
          <Link href="/trade-in">

            <button className="hidden md:flex items-center gap-2 border px-4 py-3 rounded-2xl hover:bg-gray-100 transition font-semibold">

              <Repeat size={18} />

              Trade-In

            </button>

          </Link>

          {/* DEALER LOGIN */}
          <Link href="/auth">

            <button className="bg-black text-white px-5 py-3 rounded-2xl hover:bg-gray-800 transition font-semibold">

              Dealer Login

            </button>

          </Link>

          {/* CART */}
          <Link href="/cart">

            <div className="relative cursor-pointer">

              <div className="border p-3 rounded-2xl hover:bg-gray-100 transition">

                <ShoppingCart size={24} />

              </div>

              {cartCount > 0 && (

                <div className="absolute -top-2 -right-2 bg-black text-white w-6 h-6 rounded-full text-xs flex items-center justify-center font-bold">

                  {cartCount}

                </div>

              )}

            </div>

          </Link>

        </div>

      </div>

      {/* MOBILE SEARCH */}
      <div className="px-4 pb-4 md:hidden">

        <form
          action="/search"
          method="GET"
          className="relative"
        >

          <input
            type="text"
            name="q"
            placeholder="Search phones..."
            className="w-full border rounded-2xl px-5 py-3 pr-14 outline-none focus:border-black"
          />

          <button
            type="submit"
            className="absolute right-4 top-1/2 -translate-y-1/2"
          >
            🔍
          </button>

        </form>

      </div>

    </nav>
  )
}