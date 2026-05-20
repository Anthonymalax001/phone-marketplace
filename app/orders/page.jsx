'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function OrdersPage() {

  const [orders, setOrders] = useState([])

  useEffect(() => {

    fetchOrders()

  }, [])

  const fetchOrders = async () => {

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('id', { ascending: false })

    if (!error) {
      setOrders(data)
    }
  }

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

    <main className="min-h-screen bg-gray-100 px-4 py-6 sm:px-6 lg:px-10 lg:py-10 overflow-x-hidden">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">
            My Orders
          </h1>

          <p className="text-gray-600 mt-3 text-base sm:text-lg">
            Track your electronics purchases
          </p>

        </div>

        {/* EMPTY */}
        {orders.length === 0 ? (

          <div className="bg-white rounded-3xl p-10 sm:p-16 text-center shadow-sm">

            <h2 className="text-3xl sm:text-4xl font-bold text-black">
              No orders yet
            </h2>

            <p className="text-gray-500 mt-4 text-base sm:text-lg">
              Your purchases will appear here.
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {orders.map((order) => (

              <div
                key={order.id}
                className="bg-white rounded-3xl p-5 sm:p-6 lg:p-8 shadow-sm"
              >

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">

                  {/* ORDER ID */}
                  <div>

                    <p className="text-gray-500 text-sm">
                      ORDER ID
                    </p>

                    <h2 className="text-2xl font-bold text-black mt-2 break-words">
                      #{order.id}
                    </h2>

                  </div>

                  {/* CUSTOMER */}
                  <div>

                    <p className="text-gray-500 text-sm">
                      CUSTOMER
                    </p>

                    <h3 className="font-bold text-black text-base sm:text-lg mt-2 break-words">
                      {order.full_name || order.customer_name}
                    </h3>

                  </div>

                  {/* PHONE */}
                  <div>

                    <p className="text-gray-500 text-sm">
                      PHONE
                    </p>

                    <h3 className="font-bold text-black text-base sm:text-lg mt-2 break-words">
                      {order.phone || order.customer_phone}
                    </h3>

                  </div>

                  {/* TOTAL */}
                  <div>

                    <p className="text-gray-500 text-sm">
                      TOTAL
                    </p>

                    <h3 className="text-2xl font-bold text-black mt-2 break-words">
                      KES {Number(order.total || 0).toLocaleString()}
                    </h3>

                  </div>

                  {/* STATUS */}
                  <div>

                    <p className="text-gray-500 text-sm mb-3">
                      STATUS
                    </p>

                    <div
                      className={`inline-block px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.status)}`}
                    >

                      {order.status || 'pending'}

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