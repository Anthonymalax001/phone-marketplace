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
    <main className="min-h-screen bg-gray-100 p-4 md:p-10">

      <div className="max-w-7xl mx-auto">

        {/* TOP BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">

          <div className="flex flex-wrap gap-4">

            <Link href="/dashboard">

              <button className="bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition">
                ← Dashboard
              </button>

            </Link>

            {userEmail === adminEmail && (

              <Link href="/admin">

                <button className="border border-black px-6 py-3 rounded-2xl hover:bg-black hover:text-white transition">
                  Admin Panel
                </button>

              </Link>

            )}

          </div>

          <LogoutButton />

        </div>

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-4xl md:text-5xl font-bold">
            Orders Dashboard
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Manage customer orders & deliveries
          </p>

        </div>

        {/* ANALYTICS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <p className="text-gray-500">
              Total Orders
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {orders.length}
            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <p className="text-gray-500">
              Revenue
            </p>

            <h2 className="text-4xl font-bold mt-3">
              KES {totalRevenue}
            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <p className="text-gray-500">
              Pending Orders
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {pendingOrders}
            </h2>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <p className="text-gray-500">
              Delivered Orders
            </p>

            <h2 className="text-4xl font-bold mt-3">
              {deliveredOrders}
            </h2>

          </div>

        </div>

        {/* LOADING */}
        {loading ? (

          <div className="bg-white rounded-3xl p-16 text-center">

            <h2 className="text-3xl font-bold">
              Loading Orders...
            </h2>

          </div>

        ) : orders.length === 0 ? (

          <div className="bg-white rounded-3xl p-16 text-center">

            <h2 className="text-4xl font-bold">
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
                className="bg-white rounded-3xl p-6 md:p-8 shadow-sm"
              >

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">

                  {/* LEFT */}
                  <div className="flex-1">

                    <div className="flex flex-wrap items-center gap-4">

                      <h2 className="text-3xl font-bold">
                        {order.full_name || 'Customer'}
                      </h2>

                      <div
                        className={`px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.status)}`}
                      >
                        {order.status || 'pending'}
                      </div>

                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

                      <div>

                        <p className="text-gray-500 text-sm">
                          Phone Number
                        </p>

                        <h3 className="font-bold text-lg mt-1">
                          {order.phone}
                        </h3>

                      </div>

                      <div>

                        <p className="text-gray-500 text-sm">
                          County
                        </p>

                        <h3 className="font-bold text-lg mt-1">
                          {order.county}
                        </h3>

                      </div>

                      <div>

                        <p className="text-gray-500 text-sm">
                          Town
                        </p>

                        <h3 className="font-bold text-lg mt-1">
                          {order.town}
                        </h3>

                      </div>

                      <div>

                        <p className="text-gray-500 text-sm">
                          Payment Method
                        </p>

                        <h3 className="font-bold text-lg mt-1 capitalize">
                          {order.payment_method || 'mpesa'}
                        </h3>

                      </div>

                      <div>

                        <p className="text-gray-500 text-sm">
                          Delivery Fee
                        </p>

                        <h3 className="font-bold text-lg mt-1">
                          KES {order.delivery_fee || 0}
                        </h3>

                      </div>

                      <div>

                        <p className="text-gray-500 text-sm">
                          Order Date
                        </p>

                        <h3 className="font-bold text-lg mt-1">
                          {new Date(
                            order.created_at
                          ).toLocaleDateString()}
                        </h3>

                      </div>

                    </div>

                    <div className="mt-8">

                      <p className="text-gray-500 text-sm">
                        Delivery Address
                      </p>

                      <h3 className="font-bold text-lg mt-2">
                        {order.address}
                      </h3>

                    </div>

                  </div>

                  {/* RIGHT */}
                  <div className="xl:text-right">

                    <p className="text-gray-500 text-sm">
                      Order Total
                    </p>

                    <h2 className="text-5xl font-bold mt-2">
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
                        className="border px-5 py-4 rounded-2xl font-semibold text-lg"
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

            ))}

          </div>

        )}

      </div>

    </main>
  )
}