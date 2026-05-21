'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function TradeInPage() {

  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)

  const [form, setForm] = useState({
    customer_name: '',
    customer_phone: '',
    device_name: '',
    storage: '',
    condition: '',
    expected_price: '',
    description: '',
    image_url: '',
  })

  const handleChange = (e) => {

    let value = e.target.value

    // PHONE VALIDATION
    if (e.target.name === 'customer_phone') {

      value = value.replace(/\D/g, '')

      if (value.length > 10) {
        value = value.slice(0, 10)
      }
    }

    setForm({
      ...form,
      [e.target.name]: value,
    })
  }

  const uploadImage = async (e) => {

    const file = e.target.files[0]

    if (!file) return

    setImageUploading(true)

    const fileName = `${Date.now()}-${file.name}`

    const { error } = await supabase.storage
      .from('tradein-images')
      .upload(fileName, file)

    if (error) {

      alert('Image upload failed')
      setImageUploading(false)
      return
    }

    const {
      data: { publicUrl },
    } = supabase.storage
      .from('tradein-images')
      .getPublicUrl(fileName)

    setForm({
      ...form,
      image_url: publicUrl,
    })

    setImageUploading(false)
  }

  const submitTradeIn = async (e) => {

    e.preventDefault()

    if (form.customer_phone.length !== 10) {

      alert('Phone number must be exactly 10 digits')
      return
    }

    if (!form.image_url) {

      alert('Please upload device image')
      return
    }

    setLoading(true)

    const { error } = await supabase
      .from('trade_ins')
      .insert([form])

    setLoading(false)

    if (error) {

      alert('Something went wrong')

    } else {

      alert('Trade-in request submitted successfully')

      setForm({
        customer_name: '',
        customer_phone: '',
        device_name: '',
        storage: '',
        condition: '',
        expected_price: '',
        description: '',
        image_url: '',
      })
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 sm:px-6 lg:px-10 py-6 lg:py-10 overflow-x-hidden">

      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-3xl shadow-sm p-5 sm:p-8 lg:p-10">

          {/* HEADER */}
          <div className="mb-10">

            <div className="inline-flex items-center bg-black text-white px-4 py-2 rounded-full text-sm font-semibold mb-5">
              TRADE-IN PROGRAM
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Trade-In Your Device
            </h1>

            <p className="text-gray-500 mt-4 text-base sm:text-lg leading-7">
              Exchange your old phone, laptop or console for a better deal.
            </p>

          </div>

          {/* FORM */}
          <form
            onSubmit={submitTradeIn}
            className="space-y-8"
          >

            {/* CUSTOMER INFO */}
            <div className="bg-gray-50 rounded-3xl p-5 sm:p-6">

              <h2 className="text-2xl font-bold mb-6">
                Customer Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Full Name
                  </label>

                  <input
                    type="text"
                    name="customer_name"
                    placeholder="Your Name"
                    value={form.customer_name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 bg-white px-5 py-4 rounded-2xl outline-none focus:border-black transition"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    name="customer_phone"
                    placeholder="07XXXXXXXX"
                    value={form.customer_phone}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 bg-white px-5 py-4 rounded-2xl outline-none focus:border-black transition"
                  />

                  <p className="text-xs text-gray-500 mt-2">
                    Must be exactly 10 digits
                  </p>

                </div>

              </div>

            </div>

            {/* DEVICE INFO */}
            <div className="bg-gray-50 rounded-3xl p-5 sm:p-6">

              <h2 className="text-2xl font-bold mb-6">
                Device Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Device Name
                  </label>

                  <input
                    type="text"
                    name="device_name"
                    placeholder="iPhone 13 Pro Max"
                    value={form.device_name}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-200 bg-white px-5 py-4 rounded-2xl outline-none focus:border-black transition"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Storage
                  </label>

                  <input
                    type="text"
                    name="storage"
                    placeholder="128GB"
                    value={form.storage}
                    onChange={handleChange}
                    className="w-full border border-gray-200 bg-white px-5 py-4 rounded-2xl outline-none focus:border-black transition"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Condition
                  </label>

                  <input
                    type="text"
                    name="condition"
                    placeholder="Excellent"
                    value={form.condition}
                    onChange={handleChange}
                    className="w-full border border-gray-200 bg-white px-5 py-4 rounded-2xl outline-none focus:border-black transition"
                  />

                </div>

                <div>

                  <label className="block text-sm font-semibold mb-2">
                    Expected Price
                  </label>

                  <input
                    type="text"
                    name="expected_price"
                    placeholder="KES 85000"
                    value={form.expected_price}
                    onChange={handleChange}
                    className="w-full border border-gray-200 bg-white px-5 py-4 rounded-2xl outline-none focus:border-black transition"
                  />

                </div>

              </div>

              {/* DESCRIPTION */}
              <div className="mt-5">

                <label className="block text-sm font-semibold mb-2">
                  Device Description
                </label>

                <textarea
                  name="description"
                  placeholder="Describe the device condition, scratches, battery health, accessories included..."
                  value={form.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full border border-gray-200 bg-white px-5 py-4 rounded-2xl outline-none focus:border-black transition resize-none"
                />

              </div>

            </div>

            {/* IMAGE */}
            <div className="bg-gray-50 rounded-3xl p-5 sm:p-6">

              <h2 className="text-2xl font-bold mb-6">
                Device Images
              </h2>

              <div className="border-2 border-dashed border-gray-300 rounded-3xl p-6 bg-white">

                <input
                  type="file"
                  accept="image/*"
                  onChange={uploadImage}
                  className="w-full text-sm"
                />

                {imageUploading && (

                  <div className="mt-5 bg-blue-50 text-blue-700 px-4 py-3 rounded-2xl font-medium">
                    Uploading image...
                  </div>

                )}

                {form.image_url && (

                  <div className="mt-6">

                    <img
                      src={form.image_url}
                      alt="Preview"
                      className="w-full h-[250px] sm:h-[350px] object-cover rounded-3xl"
                    />

                  </div>

                )}

              </div>

            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading || imageUploading}
              className="w-full bg-black text-white py-5 rounded-2xl text-base sm:text-lg font-semibold hover:bg-gray-800 transition disabled:opacity-50"
            >

              {loading
                ? 'Submitting Request...'
                : 'Submit Trade-In Request'}

            </button>

          </form>

        </div>

      </div>

    </main>
  )
}