
import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const partnerCode = "MOMONPMB20210629";
const accessKey = "Q2XhhSdgpKUlQ4Ky";
const secretKey = "k6B53GQKSjktZGJBK2MyrDa7w9S6RyCf";
const ipnUrl = process.env.BASE_URL + "/payment-return?method=momo";
const redirectUrl = process.env.BASE_URL + "/payment-return?method=momo";
const orderInfo = "Demo tích hợp SDK MOMO";
const extraData = "eyJ1c2VybmFtZSI6ICJtb21vIn0=";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { requestId, orderId, amount } = req.body;

    // Validate input
    if (!requestId || !orderId || !amount) {
      return res.status(400).json({ error: 'requestId, orderId, and amount are required.' });
    }

    // Build the signature string
    const signatureString = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;

    // Create SHA256 signature
    const signature = crypto.createHmac('sha256', secretKey).update(signatureString).digest('hex');

    // Prepare the MoMo payment request payload
    const payload = {
      partnerCode,
      partnerName: "Tên doanh nghiệp SDK4ME",
      storeId: partnerCode + "_1",
      requestId,
      amount,
      orderId,
      orderInfo,
      redirectUrl,
      ipnUrl,
      requestType: "captureWallet",
      extraData,
      lang: "vi",
      signature,
    };

    // Send the payment request to MoMo API
    try {
      const response = await fetch("https://test-payment.momo.vn/v2/gateway/api/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      // Return the MoMo response
      res.status(response.ok ? 200 : 500).json(responseData);
    } catch (error) {
      console.error("Error calling MoMo API:", error);
      res.status(500).json({ error: 'Failed to create MoMo payment.' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: 'Method not allowed' });
  }
}
