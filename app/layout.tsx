import './globals.css'
import Navbar from '../components/Navbar'
import WhatsAppButton from '../components/WhatsAppButton'

export const metadata = {
  title: 'PhoneHub',
  description: 'Kenya smartphone & electronics marketplace',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">

      <body className="bg-gray-100">

        <Navbar />

        {children}

        <WhatsAppButton />

      </body>

    </html>
  )
}