import axios, { AxiosResponse } from 'axios';
import sign from './sign';
import isObject from './isObject';
import { Balance } from '../types';

const { BASE_URL, ACCESS_KEY, SECRET_KEY } = process.env;

export default async function getBalance(): Promise<Balance> {
  let balance = {};
  const now = new Date();

  const timestamp = Date.now().toString();
  const accessKey = ACCESS_KEY!;
  const secretKey = SECRET_KEY!;
  const signature = sign(accessKey, timestamp, '', secretKey);

  try {
    if (signature) {
      const res: AxiosResponse<Balance> = await axios.get<Balance>(
        `${BASE_URL}/open/api/v2/account/info`,
        {
          headers: {
            ApiKey: accessKey,
            signature,
            'Request-Time': timestamp,
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Cache-Control': 'no-cache',
          },
        }
      );

      balance = isObject(res?.data?.data) ? res?.data.data : {};
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`🔴 ${error?.response?.data?.code}: ${error?.response?.data?.msg} 🔴`);
    } else {
      console.error(`🔴 ${error} 🔴`);
    }
    // do not continue if we can’t get the balance.
    process.exit(0);
  }
  const end = new Date();
  const diff = end.getTime() - now.getTime();

  console.log(`--------------------------------------------------------------`);
  console.log(`🔎\tfetching balance...{took: ${diff}ms}`);
  console.log(`--------------------------------------------------------------`);
  return balance;
}
