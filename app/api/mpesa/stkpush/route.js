import { NextResponse } from 'next/server'

export async function POST(req) {

  try {

    const body = await req.json()

    const { phone, amount } = body

    const consumerKey =
      process.env.MPESA_CONSUMER_KEY

    const consumerSecret =
      process.env.MPESA_CONSUMER_SECRET

    const shortCode =
      process.env.MPESA_SHORTCODE

    const passKey =
      process.env.MPESA_PASSKEY

    // FORMAT PHONE
    let formattedPhone = phone

    if (formattedPhone.startsWith('0')) {
      formattedPhone =
        '254' + formattedPhone.slice(1)
    }

    // GET ACCESS TOKEN
    const auth =
      Buffer.from(
        `${consumerKey}:${consumerSecret}`
      ).toString('base64')

    const tokenResponse = await fetch(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    )

    const tokenData =
      await tokenResponse.json()

    const accessToken =
      tokenData.access_token

    // GENERATE TIMESTAMP
    const timestamp =
      new Date()
        .toISOString()
        .replace(/[^0-9]/g, '')
        .slice(0, 14)

    // GENERATE PASSWORD
    const password =
      Buffer.from(
        `${shortCode}${passKey}${timestamp}`
      ).toString('base64')

    // STK PUSH REQUEST
    const stkResponse = await fetch(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        method: 'POST',

        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({

          BusinessShortCode: shortCode,

          Password: password,

          Timestamp: timestamp,

          TransactionType:
            'CustomerPayBillOnline',

          Amount: amount,

          PartyA: formattedPhone,

          PartyB: shortCode,

          PhoneNumber: formattedPhone,

          CallBackURL:
            'https://example.com/callback',

          AccountReference:
            'PhoneHub',

          TransactionDesc:
            'PhoneHub Payment',
        }),
      }
    )

    const stkData =
      await stkResponse.json()

    console.log(stkData)

    return NextResponse.json({
      success: true,
      data: stkData,
    })

  } catch (error) {

    console.log(error)

    return NextResponse.json({
      success: false,
      error: 'STK Push failed',
    })

  }
}