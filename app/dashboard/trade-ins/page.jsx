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
    <main className="min-h-screen bg-gray-100 px-4 py-6 md:px-10 md:py-10 overflow-x-hidden">

      <div className="max-w-7xl mx-auto">

        {/* TOP */}
        <div className="flex flex-wrap gap-4 mb-8">

          <Link href="/dashboard">

            <button className="bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition font-semibold">
              ← Back To Dashboard
            </button>

          </Link>

        </div>

        {/* HEADER */}
        <div className="mb-10">

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black">
            Trade-In Requests
          </h1>

          <p className="text-gray-700 mt-3 text-base sm:text-lg lg:text-xl">
            Review customer exchange requests
          </p>

        </div>

        {/* EMPTY */}
        {tradeIns.length === 0 ? (

          <div className="bg-white rounded-3xl p-10 shadow-sm text-center">

            <h2 className="text-2xl sm:text-3xl font-bold text-black">
              No Trade-In Requests Yet
            </h2>

            <p className="text-gray-600 mt-4">
              Customer requests will appear here.
            </p>

          </div>

        ) : (

          <div className="grid gap-6">

            {tradeIns.map((trade) => (

              <div
                key={trade.id}
                className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm"
              >

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                  <div>

                    <h2 className="text-2xl sm:text-3xl font-bold text-black break-words">
                      {trade.device_name}
                    </h2>

                    <p className="text-gray-700 mt-2 break-words">
                      Submitted by {trade.customer_name}
                    </p>

                  </div>

                  <div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        trade.status === 'Approved'
                          ? 'bg-green-100 text-green-700'
                          : trade.status === 'Rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {trade.status}
                    </span>

                  </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mt-8">

                  <div className="bg-gray-50 p-5 rounded-2xl">

                    <p className="text-gray-600 text-sm">
                      Customer Phone
                    </p>

                    <h3 className="font-bold text-base sm:text-lg mt-2 text-black break-words">
                      {trade.customer_phone}
                    </h3>

                  </div>

                  <div className="bg-gray-50 p-5 rounded-2xl">

                    <p className="text-gray-600 text-sm">
                      Storage
                    </p>

                    <h3 className="font-bold text-base sm:text-lg mt-2 text-black">
                      {trade.storage}
                    </h3>

                  </div>

                  <div className="bg-gray-50 p-5 rounded-2xl">

                    <p className="text-gray-600 text-sm">
                      Condition
                    </p>

                    <h3 className="font-bold text-base sm:text-lg mt-2 text-black">
                      {trade.condition}
                    </h3>

                  </div>

                  <div className="bg-gray-50 p-5 rounded-2xl">

                    <p className="text-gray-600 text-sm">
                      Expected Price
                    </p>

                    <h3 className="font-bold text-base sm:text-lg mt-2 text-black break-words">
                      KES {trade.expected_price}
                    </h3>

                  </div>

                </div>

                <div className="bg-gray-50 p-5 rounded-2xl mt-6">

                  <p className="text-gray-600 text-sm">
                    Description
                  </p>

                  <p className="mt-3 text-base sm:text-lg text-black leading-7 break-words">
                    {trade.description}
                  </p>

                </div>

                <div className="flex gap-4 mt-6 flex-wrap">

                  <button
                    onClick={() =>
                      updateStatus(trade.id, 'Approved')
                    }
                    className="bg-black text-white px-6 py-3 rounded-2xl hover:bg-gray-800 transition font-semibold"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(trade.id, 'Rejected')
                    }
                    className="bg-red-100 text-red-700 px-6 py-3 rounded-2xl hover:bg-red-200 transition font-semibold"
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