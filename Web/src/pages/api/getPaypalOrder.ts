import type { NextApiRequest, NextApiResponse } from 'next';
import { createPayPalOrder } from '@/module/paypal';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check if the request method is POST
  if (req.method === 'POST') {
    const { vndAmount } = req.body; // Extract vndAmount from the request body

    if (typeof vndAmount !== 'number' || vndAmount <= 0) {
      return res.status(400).json({ error: 'Invalid VND amount. It must be a positive number.' });
    }

    try {
      const order = await createPayPalOrder(vndAmount); // Pass vndAmount to createPayPalOrder
      res.status(200).json({ paymentUrl:  order}); // Return order ID and status
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: 'Failed to create PayPal order' });
    }
  } else {
    // If the method is not POST, return a 405 Method Not Allowed error
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
