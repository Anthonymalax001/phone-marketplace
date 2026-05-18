'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'

export default function TradeInsPage() {

  const [tradeIns, setTradeIns] = useState([])

  useEffect(() => {
    fetchTradeIns()
  }, [])

  const fetchTradeIns = async () => {

    const { data, error } = await supabase
      .from('trade_ins')
      .select('*')
      .order('created_at', { ascending: false })

    if (!error) {
      setTradeIns(data)
    }
  }

  const updateStatus = async (id, status) => {

    await supabase
      .from('trade_ins')
      .update({ status })
      .eq('id', id)

    fetchTradeIns()
  }

  return (
    <main className="min-h-screen bg-gray-100 p-4 md:p-10">

      <div className="max-w-7xl mx-auto">

        {/* TOP */}
        <div className="flex flex-wrap gap-4 mb-8">

          <Link href="/dashboard">

            <button className="bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition">
              ← Back To Dashboard
            </button>

          </Link>

        </div>

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-5xl font-bold">
            Trade-In Requests
          </h1>

          <p className="text-gray-600 mt-3 text-xl">
            Review customer exchange requests
          </p>

        </div>

        {/* EMPTY */}
        {tradeIns.length === 0 ? (

          <div className="bg-white rounded-3xl p-10 shadow-sm text-center">

            <h2 className="text-3xl font-bold">
              No Trade-In Requests Yet
            </h2>

            <p className="text-gray-500 mt-4">
              Customer requests will appear here.
            </p>

          </div>

        ) : (

          <div className="grid gap-6">

            {tradeIns.map((trade) => (

              <div
                key={trade.id}
                className="bg-white rounded-3xl p-6 shadow-sm"
              >

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                  <div>

                    <h2 className="text-3xl font-bold">
                      {trade.device_name}
                    </h2>

                    <p className="text-gray-500 mt-2">
                      Submitted by {trade.customer_name}
                    </p>

                  </div>

                  <div>

                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      trade.status === 'Approved'
                        ? 'bg-green-100 text-green-700'
                        : trade.status === 'Rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {trade.status}
                    </span>

                  </div>

                </div>

                <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">

                  <div className="bg-gray-50 p-5 rounded-2xl">

                    <p className="text-gray-500 text-sm">
                      Customer Phone
                    </p>

                    <h3 className="font-bold text-lg mt-2">
                      {trade.customer_phone}
                    </h3>

                  </div>

                  <div className="bg-gray-50 p-5 rounded-2xl">

                    <p className="text-gray-500 text-sm">
                      Storage
                    </p>

                    <h3 className="font-bold text-lg mt-2">
                      {trade.storage}
                    </h3>

                  </div>

                  <div className="bg-gray-50 p-5 rounded-2xl">

                    <p className="text-gray-500 text-sm">
                      Condition
                    </p>

                    <h3 className="font-bold text-lg mt-2">
                      {trade.condition}
                    </h3>

                  </div>

                  <div className="bg-gray-50 p-5 rounded-2xl">

                    <p className="text-gray-500 text-sm">
                      Expected Price
                    </p>

                    <h3 className="font-bold text-lg mt-2">
                      KES {trade.expected_price}
                    </h3>

                  </div>

                </div>

                <div className="bg-gray-50 p-5 rounded-2xl mt-6">

                  <p className="text-gray-500 text-sm">
                    Description
                  </p>

                  <p className="mt-3 text-lg text-gray-700">
                    {trade.description}
                  </p>

                </div>

                <div className="flex gap-4 mt-6 flex-wrap">

                  <button
                    onClick={() =>
                      updateStatus(trade.id, 'Approved')
                    }
                    className="bg-black text-white px-6 py-3 rounded-2xl"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(trade.id, 'Rejected')
                    }
                    className="bg-red-100 text-red-700 px-6 py-3 rounded-2xl"
                  >
                    Reject
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  )
}