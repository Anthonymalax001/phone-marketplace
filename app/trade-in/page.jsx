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

    // FORCE PHONE TO 10 DIGITS
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
    <main className="min-h-screen bg-gray-100 p-4 md:p-10">

      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 md:p-10 shadow-sm">

        <div className="mb-10">

          <h1 className="text-5xl font-bold">
            Trade-In Your Device
          </h1>

          <p className="text-gray-500 mt-4 text-lg">
            Exchange your old phone for a better deal.
          </p>

        </div>

        <form
          onSubmit={submitTradeIn}
          className="space-y-6"
        >

          <input
            type="text"
            name="customer_name"
            placeholder="Your Name"
            value={form.customer_name}
            onChange={handleChange}
            required
            className="w-full border p-4 rounded-2xl"
          />

          <div>

            <input
              type="text"
              name="customer_phone"
              placeholder="07XXXXXXXX"
              value={form.customer_phone}
              onChange={handleChange}
              required
              className="w-full border p-4 rounded-2xl"
            />

            <p className="text-sm text-gray-500 mt-2">
              Must be exactly 10 digits
            </p>

          </div>

          <input
            type="text"
            name="device_name"
            placeholder="Device Name"
            value={form.device_name}
            onChange={handleChange}
            required
            className="w-full border p-4 rounded-2xl"
          />

          <input
            type="text"
            name="storage"
            placeholder="Storage e.g 128GB"
            value={form.storage}
            onChange={handleChange}
            className="w-full border p-4 rounded-2xl"
          />

          <input
            type="text"
            name="condition"
            placeholder="Condition e.g Excellent"
            value={form.condition}
            onChange={handleChange}
            className="w-full border p-4 rounded-2xl"
          />

          <input
            type="text"
            name="expected_price"
            placeholder="Expected Price"
            value={form.expected_price}
            onChange={handleChange}
            className="w-full border p-4 rounded-2xl"
          />

          <textarea
            name="description"
            placeholder="Describe the device condition..."
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="w-full border p-4 rounded-2xl"
          />

          {/* IMAGE */}
          <div>

            <label className="block mb-3 font-semibold">
              Upload Device Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={uploadImage}
              className="w-full border p-4 rounded-2xl"
            />

            {imageUploading && (
              <p className="mt-3 text-blue-600">
                Uploading image...
              </p>
            )}

            {form.image_url && (
              <img
                src={form.image_url}
                alt="Preview"
                className="w-full h-64 object-cover rounded-2xl mt-5"
              />
            )}

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl text-lg font-semibold"
          >

            {loading
              ? 'Submitting...'
              : 'Submit Trade-In'}

          </button>

        </form>

      </div>

    </main>
  )
}