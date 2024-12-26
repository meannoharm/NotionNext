import { MAILCHIMP_API_KEY, MAILCHIMP_LIST_ID } from '@/constants';

/**
 * 订阅邮件-服务端接口
 * @param {*} email
 * @returns
 */
export default function subscribeToMailchimpApi(
  email: string,
  firstName = '',
  lastName = '',
): Promise<Response> {
  const listId = MAILCHIMP_LIST_ID; // 替换为你的邮件列表 ID
  const apiKey = MAILCHIMP_API_KEY; // 替换为你的 API KEY
  if (!email || !listId || !apiKey) {
    return Promise.reject(
      `Missing required parameters, email: ${email}, listId: ${listId}, apiKey: ${apiKey}`,
    );
  }
  const data = {
    email_address: email,
    status: 'subscribed',
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
    },
  };
  return fetch(`https://us18.api.mailchimp.com/3.0/lists/${listId}/members`, {
    method: 'POST',
    headers: {
      Authorization: `apikey ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
}

/**
 * 客户端接口
 * @param {*} email
 * @param {*} firstName
 * @param {*} lastName
 * @returns
 */
export async function subscribeToNewsletter(
  email: string,
  firstName: string,
  lastName: string,
) {
  const response = await fetch('/api/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, first_name: firstName, last_name: lastName }),
  });
  const data = await response.json();
  return data;
}
