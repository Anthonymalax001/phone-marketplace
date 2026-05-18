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

    fetchProducts()
    fetchOrders()
    fetchTradeIns()
  }

  const fetchProducts = async () => {

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false })

    if (!error) {
      setProducts(data)
    }
  }

  const fetchOrders = async () => {

    const { data, error } = await supabase
      .from('orders')
      .select('*')

    if (!error) {
      setOrders(data)
    }
  }

  const fetchTradeIns = async () => {

    const { data, error } = await supabase
      .from('trade_ins')
      .select('*')

    if (!error) {
      setTradeIns(data)
    }
  }

  const totalRevenue = orders.reduce(
    (total, order) =>
      total + Number(order.total || 0),
    0
  )

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          <div>

            <h1 className="text-5xl font-bold">
              Dealer Dashboard
            </h1>

            <p className="mt-4 text-gray-600 text-xl">
              Welcome to your marketplace control center.
            </p>

          </div>

          <div className="flex gap-4 flex-wrap items-center">

            <Link href="/dashboard/add-product">

              <button className="bg-black text-white px-6 py-4 rounded-2xl hover:bg-gray-800 transition">
                Add Product
              </button>

            </Link>

            {userEmail === adminEmail && (

              <Link href="/admin">

                <button className="border border-black px-6 py-4 rounded-2xl hover:bg-black hover:text-white transition">
                  Admin Panel
                </button>

              </Link>

            )}

            <LogoutButton />

          </div>

        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">

          <div className="bg-white p-6 rounded-3xl shadow-sm">

            <h2 className="text-2xl font-bold">
              Products
            </h2>

            <p className="text-5xl font-bold mt-4">
              {products.length}
            </p>

            <p className="mt-3 text-gray-600">
              Total listings uploaded
            </p>

          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm">

            <h2 className="text-2xl font-bold">
              Orders
            </h2>

            <p className="text-5xl font-bold mt-4">
              {orders.length}
            </p>

            <p className="mt-3 text-gray-600">
              Customer purchases
            </p>

          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm">

            <h2 className="text-2xl font-bold">
              Trade-Ins
            </h2>

            <p className="text-5xl font-bold mt-4">
              {tradeIns.length}
            </p>

            <p className="mt-3 text-gray-600">
              Exchange requests
            </p>

          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm">

            <h2 className="text-2xl font-bold">
              Revenue
            </h2>

            <p className="text-4xl font-bold mt-4">
              KES {totalRevenue}
            </p>

            <p className="mt-3 text-gray-600">
              Marketplace earnings
            </p>

          </div>

        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-white rounded-3xl p-6 mt-10 shadow-sm">

          <h2 className="text-3xl font-bold">
            Quick Actions
          </h2>

          <div className="grid md:grid-cols-3 gap-5 mt-6">

            <Link href="/dashboard/add-product">

              <div className="border rounded-3xl p-6 hover:bg-gray-50 transition cursor-pointer">

                <h3 className="text-2xl font-bold">
                  Add Product
                </h3>

                <p className="text-gray-500 mt-3">
                  Upload a new phone listing
                </p>

              </div>

            </Link>

            <Link href="/admin">

              <div className="border rounded-3xl p-6 hover:bg-gray-50 transition cursor-pointer">

                <h3 className="text-2xl font-bold">
                  Trade-Ins
                </h3>

                <p className="text-gray-500 mt-3">
                  Review exchange requests
                </p>

              </div>

            </Link>

            <Link href="/dashboard/orders">

              <div className="border rounded-3xl p-6 hover:bg-gray-50 transition cursor-pointer">

                <h3 className="text-2xl font-bold">
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
        <div className="bg-white rounded-3xl p-6 mt-10 shadow-sm overflow-x-auto">

          <div className="flex items-center justify-between mb-8">

            <div>

              <h2 className="text-3xl font-bold">
                Recent Products
              </h2>

              <p className="text-gray-500 mt-2">
                Latest marketplace uploads
              </p>

            </div>

          </div>

          {products.length === 0 ? (

            <p className="text-gray-500">
              No products uploaded yet.
            </p>

          ) : (

            <table className="w-full min-w-[900px]">

              <thead>

                <tr className="border-b text-left">

                  <th className="pb-5">
                    Product
                  </th>

                  <th className="pb-5">
                    Price
                  </th>

                  <th className="pb-5">
                    Storage
                  </th>

                  <th className="pb-5">
                    Condition
                  </th>

                  <th className="pb-5">
                    Dealer
                  </th>

                </tr>

              </thead>

              <tbody>

                {products.slice(0, 5).map((product) => (

                  <tr
                    key={product.id}
                    className="border-b"
                  >

                    <td className="py-5">

                      <div className="flex items-center gap-4">

                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-16 h-16 rounded-2xl object-cover"
                        />

                        <div>

                          <h3 className="font-bold">
                            {product.name}
                          </h3>

                          <p className="text-gray-500 text-sm mt-1">
                            {product.ram}
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="py-5 font-bold">
                      KES {product.price}
                    </td>

                    <td className="py-5">
                      {product.storage}
                    </td>

                    <td className="py-5 capitalize">
                      {product.condition}
                    </td>

                    <td className="py-5">
                      {product.seller_name}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

      </div>

    </main>
  )
}