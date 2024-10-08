import { loadScript } from "@paypal/paypal-js";

let paypalLoaded = false;

export const initPayPal = async (): Promise<any> => {
  if (paypalLoaded) return window.paypal;

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    throw new Error("PayPal client ID is not defined in environment variables");
  }

  try {
    const paypal = await loadScript({ clientId });
    paypalLoaded = true;
    return paypal;
  } catch (error) {
    console.error("Failed to load the PayPal JS SDK script", error);
    throw error;
  }
};

export const createPayPalButton = (paypal: any, amount: number) => {
  return paypal.Buttons({
    createOrder: (data: any, actions: any) => {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: amount.toFixed(2)
          }
        }]
      });
    },
    onApprove: (data: any, actions: any) => {
      return actions.order.capture().then(function(details: any) {
        console.log('Transaction completed by ' + details.payer.name.given_name);
        // TODO: Call backend to save transaction
        return details;
      });
    }
  });
};
