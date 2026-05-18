import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(req) {

  try {

    const body = await req.json()

    const {
      customer_name,
      customer_phone,
      customer_email,
      county,
      town,
      address,
      products,
      subtotal,
      delivery_fee,
      total,
    } = body

    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          customer_name,
          customer_phone,
          customer_email,
          county,
          town,
          address,
          products,
          subtotal,
          delivery_fee,
          total,
        },
      ])
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)

  } catch (error) {

    return NextResponse.json(
      { error: 'Server error' },
      { status: 500 }
    )
  }
}