// generateAccessToken.ts

const PAYPAL_BASE_URL: string = process.env.PAYPAL_BASE_URL as string;
const PAYPAL_CLIENT_ID: string = process.env.PAYPAL_CLIENT_ID as string;
const PAYPAL_SECRET: string = process.env.PAYPAL_SECRET as string;

interface AccessTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

const encodeCredentials = (clientId: string, secret: string): string => {
  return Buffer.from(`${clientId}:${secret}`).toString('base64');
};

export async function generateAccessToken(): Promise<AccessTokenResponse> {
  try {
    const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodeCredentials(PAYPAL_CLIENT_ID, PAYPAL_SECRET)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'grant_type': 'client_credentials',
      }),
    });

    if (!response.ok) {
      throw new Error(`Error fetching PayPal access token: ${response.statusText}`);
    }

    const data: AccessTokenResponse = await response.json();
    console.log(data);

    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function convertVNDToUSD(vndAmount: number): Promise<number> {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY; // Add your ExchangeRate-API key here
    const apiUrl = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/VND`;
  
    try {
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        throw new Error(`Error fetching exchange rates: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      // Get the exchange rate for VND to USD
      const usdRate = data.conversion_rates.USD;
  
      // Convert VND to USD
      const usdAmount = vndAmount * usdRate;
      
      return usdAmount;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to convert VND to USD.');
    }
  }
  

  export async function createPayPalOrder(vndAmount: number): Promise<any> { // Set return type to `any`
    const PAYPAL_BASE_URL: string = process.env.PAYPAL_BASE_URL as string;
  
    try {
      // Convert VND to USD
      const usdAmount = await convertVNDToUSD(vndAmount);
      console.log(`Converted amount: ${vndAmount} VND is approximately ${usdAmount} USD`);
  
      // Step 1: Get the access token using the helper function
      const accessToken = (await generateAccessToken()).access_token;
  
      // Step 2: Create the PayPal order
      const response: any = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`, // Dynamic token here
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: "d9f80740-38f0-11e8-b467-0ed5f89f718b",
              amount: {
                currency_code: "USD",
                value: usdAmount.toFixed(2), // Use the converted USD amount
                breakdown: {
                  item_total: {
                    currency_code: "USD",
                    value: usdAmount.toFixed(2) // Use the converted USD amount
                  }
                }
              }
            }
          ],
          application_context: {
            return_url: process.env.BASE_URL + "/payment-return?method=paypal",
            cancel_url: process.env.BASE_URL + "/payment-return?method=paypal",
            shipping_preference: "NO_SHIPPING",
            user_action: "PAY_NOW",
            brand_name: "TicketResell",
          }
        })
      });
  
      if (!response.ok) {
        throw new Error(`Error creating PayPal order: ${response.statusText}`);
      }
  
      const data: any = await response.json(); // Set response data to any
      const approveLink = data.links.find((link: { rel: string }) => link.rel === 'approve')?.href;
  
      console.log('Approve link:', approveLink); // Log the approve link
  
      return approveLink;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  
