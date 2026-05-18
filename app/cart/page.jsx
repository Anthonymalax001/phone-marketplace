'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CartPage() {

  const router = useRouter()

  const [cart, setCart] = useState([])

  useEffect(() => {

    const savedCart =
      JSON.parse(localStorage.getItem('cart')) || []

    setCart(savedCart)

  }, [])

  const removeFromCart = (id) => {

    const updatedCart =
      cart.filter((item) => item.id !== id)

    setCart(updatedCart)

    localStorage.setItem(
      'cart',
      JSON.stringify(updatedCart)
    )

    window.dispatchEvent(new Event('cartUpdated'))
  }

  const totalPrice = cart.reduce(
    (total, item) => total + Number(item.price),
    0
  )

  const deliveryFee = 500

  const finalTotal = totalPrice + deliveryFee

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        {/* TOP */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5 mb-10">

          <div>

            <h1 className="text-5xl font-bold">
              Shopping Cart
            </h1>

            <p className="text-gray-500 mt-3 text-lg">
              {cart.length} items in your cart
            </p>

          </div>

          <Link href="/">
            <button className="border border-black px-6 py-3 rounded-2xl hover:bg-black hover:text-white transition">
              Continue Shopping
            </button>
          </Link>

        </div>

        {cart.length === 0 ? (

          <div className="bg-white rounded-3xl p-16 text-center">

            <h2 className="text-3xl font-bold">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mt-4">
              Add iPhones, Androids & electronics to continue.
            </p>

          </div>

        ) : (

          <div className="grid lg:grid-cols-3 gap-8">

            {/* CART ITEMS */}
            <div className="lg:col-span-2 space-y-6">

              {cart.map((product) => (

                <div
                  key={product.id}
                  className="bg-white rounded-3xl p-5 flex flex-col md:flex-row gap-5 shadow-sm"
                >

                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full md:w-40 h-40 object-cover rounded-2xl"
                  />

                  <div className="flex-1">

                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                      <div>

                        <h2 className="text-3xl font-bold">
                          {product.name}
                        </h2>

                        <p className="text-gray-500 mt-2">
                          {product.storage} • {product.ram}
                        </p>

                        <div className="flex gap-2 mt-4 flex-wrap">

                          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                            {product.condition}
                          </div>

                          {product.verified && (
                            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                              Verified
                            </div>
                          )}

                        </div>

                      </div>

                      <div className="text-3xl font-bold">
                        KES {Number(product.price).toLocaleString()}
                      </div>

                    </div>

                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="mt-6 border border-red-500 text-red-500 px-5 py-3 rounded-2xl hover:bg-red-500 hover:text-white transition"
                    >
                      Remove Item
                    </button>

                  </div>

                </div>

              ))}

            </div>

            {/* SUMMARY */}
            <div>

              <div className="bg-white rounded-3xl p-8 sticky top-10 shadow-sm">

                <h2 className="text-3xl font-bold">
                  Order Summary
                </h2>

                <div className="space-y-5 mt-8">

                  <div className="flex items-center justify-between text-lg">

                    <p className="text-gray-500">
                      Items
                    </p>

                    <p className="font-semibold">
                      {cart.length}
                    </p>

                  </div>

                  <div className="flex items-center justify-between text-lg">

                    <p className="text-gray-500">
                      Subtotal
                    </p>

                    <p className="font-semibold">
                      KES {totalPrice.toLocaleString()}
                    </p>

                  </div>

                  <div className="flex items-center justify-between text-lg">

                    <p className="text-gray-500">
                      Delivery Fee
                    </p>

                    <p className="font-semibold">
                      KES {deliveryFee.toLocaleString()}
                    </p>

                  </div>

                  <div className="border-t pt-5 flex items-center justify-between">

                    <h3 className="text-2xl font-bold">
                      Total
                    </h3>

                    <h3 className="text-3xl font-bold">
                      KES {finalTotal.toLocaleString()}
                    </h3>

                  </div>

                </div>

                <button
                  onClick={() => router.push('/checkout')}
                  className="w-full bg-black text-white py-5 rounded-2xl mt-10 text-lg hover:bg-gray-800 transition"
                >
                  Proceed to Checkout
                </button>

                <p className="text-sm text-gray-500 mt-5 text-center">
                  Secure checkout with M-Pesa integration coming next.
                </p>

              </div>

            </div>

          </div>

        )}

      </div>

    </main>
  )
}