'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'
import LogoutButton from '../../components/LogoutButton'

export default function Dashboard() {

  const router = useRouter()

  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [tradeIns, setTradeIns] = useState([])
  const [loading, setLoading] = useState(true)

  const [userEmail, setUserEmail] =
    useState('')

  const adminEmail =
    'anthonymalawa8@gmail.com'

  useEffect(() => {

    checkUser()

  }, [])

  const checkUser = async () => {

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {

      router.push('/auth')
      return
    }

    setUserEmail(session.user.email)

    await Promise.all([
      fetchProducts(),
      fetchOrders(),
      fetchTradeIns(),
    ])

    setLoading(false)
  }

  const fetchProducts = async () => {

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false })

    if (!error && data) {
      setProducts(data)
    }
  }

  const fetchOrders = async () => {

    const { data, error } = await supabase
      .from('orders')
      .select('*')

    if (!error && data) {
      setOrders(data)
    }
  }

  const fetchTradeIns = async () => {

    const { data, error } = await supabase
      .from('trade_ins')
      .select('*')

    if (!error && data) {
      setTradeIns(data)
    }
  }

  const totalRevenue = orders.reduce(
    (total, order) =>
      total + Number(order.total || 0),
    0
  )

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

          <div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              Dealer Dashboard
            </h1>

            <p className="mt-3 text-gray-600 text-base sm:text-lg lg:text-xl">
              Welcome to your marketplace control center.
            </p>

          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 flex-wrap">

            <Link href="/dashboard/add-product">

              <button className="w-full sm:w-auto bg-black text-white px-6 py-4 rounded-2xl hover:bg-gray-800 transition font-semibold">
                Add Product
              </button>

            </Link>

            {userEmail === adminEmail && (

              <Link href="/admin">

                <button className="w-full sm:w-auto border border-black px-6 py-4 rounded-2xl hover:bg-black hover:text-white transition font-semibold">
                  Admin Panel
                </button>

              </Link>

            )}

            <div className="w-full sm:w-auto">
              <LogoutButton />
            </div>

          </div>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mt-10">

          <div className="bg-white p-6 rounded-3xl shadow-sm">

            <h2 className="text-xl sm:text-2xl font-bold">
              Products
            </h2>

            <p className="text-4xl sm:text-5xl font-bold mt-4">
              {products.length}
            </p>

            <p className="mt-3 text-gray-600 text-sm sm:text-base">
              Total listings uploaded
            </p>

          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm">

            <h2 className="text-xl sm:text-2xl font-bold">
              Orders
            </h2>

            <p className="text-4xl sm:text-5xl font-bold mt-4">
              {orders.length}
            </p>

            <p className="mt-3 text-gray-600 text-sm sm:text-base">
              Customer purchases
            </p>

          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm">

            <h2 className="text-xl sm:text-2xl font-bold">
              Trade-Ins
            </h2>

            <p className="text-4xl sm:text-5xl font-bold mt-4">
              {tradeIns.length}
            </p>

            <p className="mt-3 text-gray-600 text-sm sm:text-base">
              Exchange requests
            </p>

          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm">

            <h2 className="text-xl sm:text-2xl font-bold">
              Revenue
            </h2>

            <p className="text-3xl sm:text-4xl font-bold mt-4 break-words">
              KES {totalRevenue}
            </p>

            <p className="mt-3 text-gray-600 text-sm sm:text-base">
              Marketplace earnings
            </p>

          </div>

        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 mt-10 shadow-sm">

          <h2 className="text-2xl sm:text-3xl font-bold">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

            <Link href="/dashboard/add-product">

              <div className="border rounded-3xl p-6 hover:bg-gray-50 transition cursor-pointer">

                <h3 className="text-xl sm:text-2xl font-bold">
                  Add Product
                </h3>

                <p className="text-gray-500 mt-3">
                  Upload a new phone listing
                </p>

              </div>

            </Link>

            <Link href="/admin">

              <div className="border rounded-3xl p-6 hover:bg-gray-50 transition cursor-pointer">

                <h3 className="text-xl sm:text-2xl font-bold">
                  Trade-Ins
                </h3>

                <p className="text-gray-500 mt-3">
                  Review exchange requests
                </p>

              </div>

            </Link>

            <Link href="/dashboard/orders">

              <div className="border rounded-3xl p-6 hover:bg-gray-50 transition cursor-pointer">

                <h3 className="text-xl sm:text-2xl font-bold">
                  Orders
                </h3>

                <p className="text-gray-500 mt-3">
                  Manage customer purchases
                </p>

              </div>

            </Link>

          </div>

        </div>

        {/* RECENT PRODUCTS */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 mt-10 shadow-sm">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

            <div>

              <h2 className="text-2xl sm:text-3xl font-bold">
                Recent Products
              </h2>

              <p className="text-gray-500 mt-2">
                Latest marketplace uploads
              </p>

            </div>

          </div>

          {loading ? (

            <div className="py-16 text-center">

              <h2 className="text-2xl font-bold">
                Loading Dashboard...
              </h2>

            </div>

          ) : products.length === 0 ? (

            <p className="text-gray-500">
              No products uploaded yet.
            </p>

          ) : (

            <div className="space-y-5">

              {products.slice(0, 5).map((product) => (

                <div
                  key={product.id}
                  className="border rounded-3xl p-4 sm:p-5"
                >

                  <div className="flex flex-col sm:flex-row gap-5">

                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full sm:w-28 h-56 sm:h-28 rounded-2xl object-cover"
                    />

                    <div className="flex-1">

                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                        <div>

                          <h3 className="text-xl sm:text-2xl font-bold">
                            {product.name}
                          </h3>

                          <p className="text-gray-500 mt-1">
                            {product.ram}
                          </p>

                        </div>

                        <div className="text-left lg:text-right">

                          <p className="text-2xl font-bold">
                            KES {product.price}
                          </p>

                          <p className="text-gray-500 mt-1 capitalize">
                            {product.condition}
                          </p>

                        </div>

                      </div>

                      <div className="flex flex-wrap gap-3 mt-5">

                        <div className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                          {product.storage}
                        </div>

                        <div className="bg-gray-100 px-4 py-2 rounded-full text-sm">
                          {product.seller_name}
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </main>
  )
}