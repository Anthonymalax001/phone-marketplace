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

    switch (status) {

      case 'paid':
        return 'bg-blue-100 text-blue-700'

      case 'shipped':
        return 'bg-yellow-100 text-yellow-700'

      case 'delivered':
        return 'bg-green-100 text-green-700'

      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-10">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-5xl font-bold">
            My Orders
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Track your electronics purchases
          </p>

        </div>

        {orders.length === 0 ? (

          <div className="bg-white rounded-3xl p-16 text-center">

            <h2 className="text-3xl font-bold">
              No orders yet
            </h2>

            <p className="text-gray-500 mt-4">
              Your purchases will appear here.
            </p>

          </div>

        ) : (

          <div className="space-y-6">

            {orders.map((order) => (

              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 shadow-sm"
              >

                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

                  <div>

                    <p className="text-gray-500 text-sm">
                      ORDER ID
                    </p>

                    <h2 className="text-2xl font-bold mt-1">
                      #{order.id}
                    </h2>

                  </div>

                  <div>

                    <p className="text-gray-500 text-sm">
                      CUSTOMER
                    </p>

                    <h3 className="font-bold mt-1">
                      {order.full_name}
                    </h3>

                  </div>

                  <div>

                    <p className="text-gray-500 text-sm">
                      PHONE
                    </p>

                    <h3 className="font-bold mt-1">
                      {order.phone}
                    </h3>

                  </div>

                  <div>

                    <p className="text-gray-500 text-sm">
                      TOTAL
                    </p>

                    <h3 className="text-2xl font-bold mt-1">
                      KES {order.total}
                    </h3>

                  </div>

                  <div>

                    <p className="text-gray-500 text-sm mb-2">
                      STATUS
                    </p>

                    <div className={`inline-block px-4 py-2 rounded-full text-sm font-semibold capitalize ${getStatusColor(order.status)}`}>
                      {order.status}
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