'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function CheckoutPage() {

  const [cart, setCart] = useState([])

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [county, setCounty] = useState('')
  const [town, setTown] = useState('')
  const [address, setAddress] = useState('')

  const [loading, setLoading] = useState(false)

  useEffect(() => {

    const savedCart =
      JSON.parse(localStorage.getItem('cart')) || []

    setCart(savedCart)

  }, [])

  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price),
    0
  )

  const deliveryFee =
    subtotal > 100000 ? 0 : 500

  const totalPrice =
    subtotal + deliveryFee

  const handlePhoneChange = (e) => {

    let value = e.target.value

    value = value.replace(/\D/g, '')

    if (value.length > 10) {
      value = value.slice(0, 10)
    }

    setPhone(value)
  }

  const handleCheckout = async () => {

    if (
      !fullName ||
      !phone ||
      !county ||
      !town ||
      !address
    ) {
      alert('Please fill all required fields')
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from('orders')
      .insert([
        {
          customer_name: fullName,
          customer_phone: phone,
          customer_email: email,

          county,
          town,
          address,

          products: cart,

          subtotal,
          delivery_fee: deliveryFee,
          total: totalPrice,

          payment_method: 'M-Pesa',
          payment_status: 'pending',
        },
      ])

    setLoading(false)

    if (error) {
      alert(error.message)
      return
    }

    alert('Order placed successfully!')

    localStorage.removeItem('cart')

    window.dispatchEvent(new Event('cartUpdated'))

    window.location.href = '/'
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 md:p-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">

          <div>
            <h1 className="text-5xl font-bold">
              Checkout
            </h1>

            <p className="text-gray-500 mt-3">
              Complete your order securely
            </p>
          </div>

          <Link href="/cart">
            <button className="border border-black px-6 py-3 rounded-2xl">
              Back To Cart
            </button>
          </Link>

        </div>

        {cart.length === 0 ? (

          <div className="bg-white rounded-3xl p-16 text-center">

            <h2 className="text-4xl font-bold">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mt-4">
              Add products before checkout.
            </p>

            <Link href="/">
              <button className="bg-black text-white px-8 py-4 rounded-2xl mt-8">
                Continue Shopping
              </button>
            </Link>

          </div>

        ) : (

          <div className="grid lg:grid-cols-3 gap-8">

            {/* DELIVERY FORM */}
            <div className="lg:col-span-2">

              <div className="bg-white rounded-3xl p-8">

                <h2 className="text-3xl font-bold mb-8">
                  Delivery Information
                </h2>

                <div className="space-y-5">

                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full border p-4 rounded-2xl"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />

                  <input
                    type="tel"
                    placeholder="07XXXXXXXX"
                    className="w-full border p-4 rounded-2xl"
                    value={phone}
                    onChange={handlePhoneChange}
                  />

                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full border p-4 rounded-2xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="County"
                    className="w-full border p-4 rounded-2xl"
                    value={county}
                    onChange={(e) => setCounty(e.target.value)}
                  />

                  <input
                    type="text"
                    placeholder="Town / Area"
                    className="w-full border p-4 rounded-2xl"
                    value={town}
                    onChange={(e) => setTown(e.target.value)}
                  />

                  <textarea
                    placeholder="Full Delivery Address"
                    className="w-full border p-4 rounded-2xl h-40"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />

                </div>

              </div>

              {/* PAYMENT */}
              <div className="bg-white rounded-3xl p-8 mt-8">

                <h2 className="text-3xl font-bold mb-8">
                  Payment Method
                </h2>

                <div className="space-y-4">

                  <div className="border p-5 rounded-2xl flex items-center justify-between">

                    <div>
                      <h3 className="text-xl font-bold">
                        M-Pesa
                      </h3>

                      <p className="text-gray-500 mt-1">
                        Pay securely via STK Push
                      </p>
                    </div>

                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm">
                      Recommended
                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* ORDER SUMMARY */}
            <div>

              <div className="bg-white rounded-3xl p-6 sticky top-10">

                <h2 className="text-3xl font-bold">
                  Order Summary
                </h2>

                <div className="space-y-5 mt-8">

                  {cart.map((product) => (

                    <div
                      key={product.id}
                      className="flex items-center gap-4"
                    >

                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-20 h-20 object-cover rounded-2xl"
                      />

                      <div className="flex-1">

                        <h3 className="font-bold">
                          {product.name}
                        </h3>

                        <p className="text-gray-500 text-sm mt-1">
                          {product.storage}
                        </p>

                      </div>

                      <h3 className="font-bold">
                        KES {product.price}
                      </h3>

                    </div>

                  ))}

                </div>

                <div className="border-t mt-8 pt-6 space-y-4">

                  <div className="flex items-center justify-between">

                    <p className="text-gray-500">
                      Subtotal
                    </p>

                    <h3 className="font-bold">
                      KES {subtotal}
                    </h3>

                  </div>

                  <div className="flex items-center justify-between">

                    <p className="text-gray-500">
                      Delivery Fee
                    </p>

                    <h3 className="font-bold">
                      {deliveryFee === 0
                        ? 'FREE'
                        : `KES ${deliveryFee}`}
                    </h3>

                  </div>

                  <div className="flex items-center justify-between">

                    <p className="text-gray-500">
                      Total
                    </p>

                    <h3 className="text-3xl font-bold">
                      KES {totalPrice}
                    </h3>

                  </div>

                </div>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="w-full bg-black text-white py-4 rounded-2xl mt-8 text-lg hover:bg-gray-800 transition disabled:opacity-50"
                >
                  {loading
                    ? 'Processing...'
                    : 'Place Order'}
                </button>

                <p className="text-center text-sm text-gray-500 mt-5">
                  Secure verified electronics marketplace checkout.
                </p>

              </div>

            </div>

          </div>

        )}

      </div>

    </main>
  )
}