import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with the secret key from the environment
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

interface RequestBody {
  productId: string;
  productName: string;
  productPrice: number;
  lensType: string;
  lensPrice: number;
  totalPrice: number;
}

export async function POST(req: Request) {
  // Parse the request body
  const { productId, productName, lensType, totalPrice }: RequestBody = await req.json();

  try {
    // Create a checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${productName} with ${lensType} lenses`,
            },
            unit_amount: Math.round(totalPrice * 100), // Stripe requires the amount in cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${productId}/select-lenses`,
    });

    // Respond with the session ID
    return NextResponse.json({ id: session.id });
  } catch (err: any) {
    // Handle errors and return a response
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
