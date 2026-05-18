'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function AdminPage() {

  const router = useRouter()

  const adminEmail =
    'anthonymalawa8@gmail.com'

  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [tradeIns, setTradeIns] = useState([])

  useEffect(() => {

    checkAdmin()

  }, [])

  const checkAdmin = async () => {

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {

      router.push('/auth')
      return
    }

    if (
      session.user.email !== adminEmail
    ) {

      router.push('/dashboard')
      return
    }

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
      .order('id', { ascending: false })

    if (!error) {
      setTradeIns(data)
    }
  }

  const updateDealerStatus = async (
    id,
    status
  ) => {

    const verified =
      status === 'approved'

    await supabase
      .from('products')
      .update({
        dealer_status: status,
        dealer_verified: verified,
      })
      .eq('id', id)

    fetchProducts()
  }

  const totalRevenue = orders.reduce(
    (total, order) =>
      total + Number(order.total || 0),
    0
  )

  const approvedDealers = products.filter(
    (product) => product.dealer_verified
  ).length

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-10">

      <div className="max-w-7xl mx-auto">

        {/* TOP NAV */}
        <div className="flex flex-wrap gap-4 mb-8">

          <Link href="/dashboard">

            <button className="bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition">
              ← Dealer Dashboard
            </button>

          </Link>

          <Link href="/dashboard/orders">

            <button className="border border-black px-6 py-3 rounded-2xl hover:bg-black hover:text-white transition">
              Orders Dashboard
            </button>

          </Link>

        </div>

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-4xl md:text-5xl font-bold">
            PhoneHub Admin
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Marketplace management dashboard
          </p>

        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          <div className="bg-white p-6 rounded-3xl shadow-sm">

            <p className="text-gray-500">
              Total Products
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {products.length}
            </h2>

          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm">

            <p className="text-gray-500">
              Revenue
            </p>

            <h2 className="text-4xl font-bold mt-3">
              KES {totalRevenue}
            </h2>

          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm">

            <p className="text-gray-500">
              Approved Dealers
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {approvedDealers}
            </h2>

          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm">

            <p className="text-gray-500">
              Trade-In Requests
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {tradeIns.length}
            </h2>

          </div>

        </div>

        {/* DEALER VERIFICATION */}
        <div className="bg-white rounded-3xl p-6 shadow-sm overflow-x-auto mb-10">

          <div className="mb-8">

            <h2 className="text-3xl font-bold">
              Dealer Verification
            </h2>

            <p className="text-gray-500 mt-2">
              Approve or reject marketplace dealers
            </p>

          </div>

          {products.length === 0 ? (

            <p className="text-gray-500">
              No dealer products yet.
            </p>

          ) : (

            <table className="w-full min-w-[900px]">

              <thead>

                <tr className="border-b text-left">

                  <th className="pb-5">
                    Product
                  </th>

                  <th className="pb-5">
                    Dealer
                  </th>

                  <th className="pb-5">
                    Phone
                  </th>

                  <th className="pb-5">
                    Location
                  </th>

                  <th className="pb-5">
                    Status
                  </th>

                  <th className="pb-5">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {products.map((product) => (

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
                            KES {product.price}
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="py-5 font-semibold">
                      {product.seller_name}
                    </td>

                    <td className="py-5">
                      {product.seller_phone}
                    </td>

                    <td className="py-5">
                      {product.seller_location}
                    </td>

                    <td className="py-5">

                      {product.dealer_status === 'approved' && (
                        <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                          Approved
                        </span>
                      )}

                      {product.dealer_status === 'pending' && (
                        <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-semibold">
                          Pending
                        </span>
                      )}

                      {product.dealer_status === 'rejected' && (
                        <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                          Rejected
                        </span>
                      )}

                    </td>

                    <td className="py-5">

                      <div className="flex gap-3">

                        <button
                          onClick={() =>
                            updateDealerStatus(
                              product.id,
                              'approved'
                            )
                          }
                          className="bg-black text-white px-4 py-2 rounded-2xl"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            updateDealerStatus(
                              product.id,
                              'rejected'
                            )
                          }
                          className="bg-red-100 text-red-700 px-4 py-2 rounded-2xl"
                        >
                          Reject
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          )}

        </div>

        {/* TRADE INS */}
        <div className="bg-white rounded-3xl p-6 shadow-sm overflow-x-auto">

          <div className="mb-8">

            <h2 className="text-3xl font-bold">
              Trade-In Requests
            </h2>

            <p className="text-gray-500 mt-2">
              Customers requesting device exchange
            </p>

          </div>

          {tradeIns.length === 0 ? (

            <p className="text-gray-500">
              No trade-in requests yet.
            </p>

          ) : (

            <table className="w-full min-w-[1100px]">

              <thead>

                <tr className="border-b text-left">

                  <th className="pb-5">
                    Device
                  </th>

                  <th className="pb-5">
                    Customer
                  </th>

                  <th className="pb-5">
                    Phone
                  </th>

                  <th className="pb-5">
                    Condition
                  </th>

                  <th className="pb-5">
                    Expected Price
                  </th>

                  <th className="pb-5">
                    Description
                  </th>

                </tr>

              </thead>

              <tbody>

                {tradeIns.map((trade) => (

                  <tr
                    key={trade.id}
                    className="border-b align-top"
                  >

                    <td className="py-5">

                      <div className="flex items-center gap-4">

                        {trade.image_url && (
                          <img
                            src={trade.image_url}
                            alt={trade.device_name}
                            className="w-16 h-16 rounded-2xl object-cover"
                          />
                        )}

                        <div>

                          <h3 className="font-bold">
                            {trade.device_name}
                          </h3>

                          <p className="text-gray-500 text-sm mt-1">
                            {trade.storage}
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="py-5 font-semibold">
                      {trade.customer_name}
                    </td>

                    <td className="py-5">
                      {trade.customer_phone}
                    </td>

                    <td className="py-5">
                      {trade.condition}
                    </td>

                    <td className="py-5 font-bold">
                      KES {trade.expected_price}
                    </td>

                    <td className="py-5 text-gray-600 max-w-sm">
                      {trade.description}
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