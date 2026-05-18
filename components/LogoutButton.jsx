'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function LogoutButton() {

  const router = useRouter()

  const handleLogout = async () => {

    await supabase.auth.signOut()

    router.push('/auth')
  }

  return (

    <button
      onClick={handleLogout}
      className="bg-red-500 text-white px-6 py-3 rounded-2xl hover:bg-red-600 transition font-semibold"
    >
      Logout
    </button>

  )
}