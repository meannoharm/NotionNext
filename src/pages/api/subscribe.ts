import subscribeToMailchimpApi from '@/lib/mailchimp';

import type { NextApiRequest, NextApiResponse } from 'next';

/**
 * 接受邮件订阅
 * @param {*} req
 * @param {*} res
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { email, firstName, lastName } = req.body;
    try {
      const response = await subscribeToMailchimpApi(
        email,
        firstName,
        lastName,
      );
      const data = await response.json();
      console.log('data', data);
      res
        .status(200)
        .json({ status: 'success', message: 'Subscription successful!' });
    } catch (error) {
      res
        .status(400)
        .json({ status: 'error', message: 'Subscription failed!', error });
    }
  } else {
    res.status(405).json({ status: 'error', message: 'Method not allowed' });
  }
}
