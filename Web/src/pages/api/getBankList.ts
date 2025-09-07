import type { NextApiRequest, NextApiResponse } from 'next';
import {vnpay} from '@/module/vnpay'; // Import your vnpay library
import { Bank  } from 'vnpay';



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const bankList: Bank[] = await vnpay.getBankList(); // Fetch bank list from vnpay
    res.status(200).json(bankList); // Send bank list as JSON response

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bank list' });
  }
}
