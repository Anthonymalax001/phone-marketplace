'use client'

import { MessageCircle } from 'lucide-react'

export default function WhatsAppButton() {

  const phoneNumber = '254796244313'

  const message =
    'Hello PhoneHub, I need assistance.'

  const whatsappURL =
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`

  return (

    <a
      href={whatsappURL}
      target="_blank"
      rel="noopener noreferrer"
      className="
        fixed
        bottom-6
        right-6
        z-50
        bg-green-500
        hover:bg-green-600
        text-white
        p-4
        rounded-full
        shadow-2xl
        transition
        hover:scale-110
      "
    >

      <MessageCircle size={30} />

    </a>
  )
}