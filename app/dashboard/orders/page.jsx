'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import LogoutButton from '../../../components/LogoutButton'

export default function OrdersDashboard() {

  const router = useRouter()

  const [orders, setOrders] = useState([])
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

    fetchOrders()
  }

  const fetchOrders = async () => {

    setLoading(true)

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('id', { ascending: false })

    if (!error) {
      setOrders(data)
    }

    setLoading(false)
  }

  const updateStatus = async (
    id,
    status
  ) => {

    const { error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)

    if (!error) {

      setOrders((prev) =>
        prev.map((order) =>
          order.id === id
            ? { ...order, status }
            : order
        )
      )

      alert('Order updated successfully')
    }
  }

  const totalRevenue = orders.reduce(
    (total, order) =>
      total + Number(order.total || 0),
    0
  )

  const pendingOrders = orders.filter(
    (order) =>
      (order.status || '').toLowerCase() === 'pending'
  ).length

  const deliveredOrders = orders.filter(
    (order) =>
      (order.status || '').toLowerCase() === 'delivered'
  ).length

  const getStatusColor = (status) => {

    switch ((status || '').toLowerCase()) {

      case 'paid':
        return 'bg-blue-100 text-blue-700'

      case 'shipped':
        return 'bg-yellow-100 text-yellow-700'

      case 'delivered':
        return 'bg-green-100 text-green-700'

      case 'cancelled':
        return 'bg-red-100 text-red-700'

      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">

      <div className="max-w-7xl mx-auto">

        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

          <div className="flex flex-wrap gap-3">

            <Link href="/dashboard">

              <button className="bg-black text-white px-5 py-3 rounded-2xl hover:bg-gray-800 transition text-sm sm:text-base">
                ← Dashboard
              </button>

            </Link>

            {userEmail === adminEmail && (

              <Link href="/admin">

                <button className="border border-black px-5 py-3 rounded-2xl hover:bg-black hover:text-white transition text-sm sm:text-base">
                  Admin Panel
                </button>

              </Link>

            )}

          </div>

          <LogoutButton />

        </div>

        {/* HEADER */}
        <div className="mb-8">

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            Orders Dashboard
          </h1>

          <p className="text-gray-500 mt-3 text-base sm:text-lg">
            Manage customer orders & deliveries
          </p>

        </div>

        {/* ANALYTICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <p className="text-gray-500">
              Total Orders
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold mt-3">
              {orders.length}
            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <p className="text-gray-500">
              Revenue
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold mt-3 break-words">
              KES {totalRevenue}
            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <p className="text-gray-500">
              Pending Orders
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold mt-3">
              {pendingOrders}
            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <p className="text-gray-500">
              Delivered Orders
            </p>

            <h2 className="text-3xl sm:text-4xl font-bold mt-3">
              {deliveredOrders}
            </h2>

          </div>

        </div>

        {/* LOADING */}
        {loading ? (

          <div className="bg-white rounded-3xl p-10 sm:p-16 text-center">

            <h2 className="text-2xl sm:text-3xl font-bold">
              Loading Orders...
            </h2>

          </div>

        ) : orders.length === 0 ? (

          <div className="bg-white rounded-3xl p-10 sm:p-16 text-center">

            <h2 className="text-3xl sm:text-4xl font-bold">
              No orders yet
            </h2>

            <p className="text-gray-500 mt-4">
              Orders will appear here after checkout.
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {orders.map((order) => (

              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm"
              >

                <div className="flex flex-col gap-8">

                  {/* TOP */}
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                    {/* CUSTOMER */}
                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-3">

                        <h2 className="text-2xl sm:text-3xl font-bold break-words">
                          {order.full_name || 'Customer'}
                        </h2>

                        <div
                          className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.status)}`}
                        >
                          {order.status || 'pending'}
                        </div>

                      </div>

                      {/* INFO GRID */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mt-8">

                        <div>

                          <p className="text-gray-500 text-sm">
                            Phone Number
                          </p>

                          <h3 className="font-bold text-base sm:text-lg mt-1 break-words">
                            {order.phone}
                          </h3>

                        </div>

                        <div>

                          <p className="text-gray-500 text-sm">
                            County
                          </p>

                          <h3 className="font-bold text-base sm:text-lg mt-1">
                            {order.county}
                          </h3>

                        </div>

                        <div>

                          <p className="text-gray-500 text-sm">
                            Town
                          </p>

                          <h3 className="font-bold text-base sm:text-lg mt-1">
                            {order.town}
                          </h3>

                        </div>

                        <div>

                          <p className="text-gray-500 text-sm">
                            Payment Method
                          </p>

                          <h3 className="font-bold text-base sm:text-lg mt-1 capitalize">
                            {order.payment_method || 'mpesa'}
                          </h3>

                        </div>

                        <div>

                          <p className="text-gray-500 text-sm">
                            Delivery Fee
                          </p>

                          <h3 className="font-bold text-base sm:text-lg mt-1">
                            KES {order.delivery_fee || 0}
                          </h3>

                        </div>

                        <div>

                          <p className="text-gray-500 text-sm">
                            Order Date
                          </p>

                          <h3 className="font-bold text-base sm:text-lg mt-1">
                            {new Date(
                              order.created_at
                            ).toLocaleDateString()}
                          </h3>

                        </div>

                      </div>

                      {/* ADDRESS */}
                      <div className="mt-8">

                        <p className="text-gray-500 text-sm">
                          Delivery Address
                        </p>

                        <h3 className="font-bold text-base sm:text-lg mt-2 break-words">
                          {order.address}
                        </h3>

                      </div>

                    </div>

                    {/* TOTAL + STATUS */}
                    <div className="w-full lg:w-[320px] bg-gray-50 rounded-3xl p-6">

                      <p className="text-gray-500 text-sm">
                        Order Total
                      </p>

                      <h2 className="text-3xl sm:text-5xl font-bold mt-3 break-words">
                        KES {order.total}
                      </h2>

                      <div className="mt-8">

                        <p className="text-gray-500 text-sm mb-3">
                          Update Order Status
                        </p>

                        <select
                          value={order.status || 'pending'}
                          onChange={(e) =>
                            updateStatus(order.id, e.target.value)
                          }
                          className="w-full border px-4 py-4 rounded-2xl font-semibold text-base outline-none"
                        >

                          <option value="pending">
                            Pending
                          </option>

                          <option value="paid">
                            Paid
                          </option>

                          <option value="shipped">
                            Shipped
                          </option>

                          <option value="delivered">
                            Delivered
                          </option>

                          <option value="cancelled">
                            Cancelled
                          </option>

                        </select>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  )
}