'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function AuthPage() {

  const router = useRouter()

  const [isLogin, setIsLogin] = useState(true)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [loading, setLoading] = useState(false)

  const handleAuth = async (e) => {

    e.preventDefault()

    setLoading(true)

    if (isLogin) {

      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      setLoading(false)

      if (error) {
        alert(error.message)
        return
      }

      alert('Login successful')

      router.push('/dashboard')

    } else {

      const { error } =
        await supabase.auth.signUp({
          email,
          password,
        })

      setLoading(false)

      if (error) {
        alert(error.message)
        return
      }

      alert(
        'Account created successfully. Please login.'
      )

      setIsLogin(true)

      setEmail('')
      setPassword('')
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-sm">

        {/* TOP */}
        <div className="text-center">

          <h1 className="text-4xl font-bold">
            PhoneHub
          </h1>

          <p className="text-gray-500 mt-3">
            Dealer marketplace access
          </p>

        </div>

        {/* SWITCH */}
        <div className="grid grid-cols-2 gap-3 mt-8">

          <button
            onClick={() => setIsLogin(true)}
            className={`py-3 rounded-2xl font-semibold transition ${
              isLogin
                ? 'bg-black text-white'
                : 'bg-gray-100'
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setIsLogin(false)}
            className={`py-3 rounded-2xl font-semibold transition ${
              !isLogin
                ? 'bg-black text-white'
                : 'bg-gray-100'
            }`}
          >
            Create Account
          </button>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleAuth}
          className="space-y-5 mt-8"
        >

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email Address"
            required
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border p-4 rounded-2xl"
          />

          {/* PASSWORD */}
          <div className="relative">

            <input
              type={
                showPassword
                  ? 'text'
                  : 'password'
              }
              placeholder="Password"
              required
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border p-4 rounded-2xl pr-16"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-600"
            >

              {showPassword
                ? 'Hide'
                : 'Show'}

            </button>

          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-4 rounded-2xl text-lg font-semibold hover:bg-gray-800 transition"
          >

            {loading
              ? 'Please wait...'
              : isLogin
              ? 'Login'
              : 'Create Account'}

          </button>

        </form>

      </div>

    </main>
  )
}