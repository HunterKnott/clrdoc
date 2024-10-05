import { loadStripe, Stripe } from '@stripe/stripe-js';

// Define Stripe instance as a promise, so we can type the return of getStripe
let stripePromise: Promise<Stripe | null>;

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);
  }
  return stripePromise;
};

// Define the shape of product details (you can adjust this type based on your specific use case)
interface ProductDetails {
  priceId: string;
  quantity: number;
  [key: string]: any;  // In case there are additional fields
}

interface CheckoutSession {
  id: string;
  url: string;
}

export async function createCheckoutSession(productDetails: ProductDetails): Promise<CheckoutSession> {
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productDetails),
  });

  if (!response.ok) {
    throw new Error('Failed to create checkout session');
  }

  const session: CheckoutSession = await response.json();
  return session;
}
