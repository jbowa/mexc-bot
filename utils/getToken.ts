import axios, { AxiosResponse } from 'axios';
import { Token } from '../types';

const { BASE_URL } = process.env;

export default async function getToken(symbol: string): Promise<Token | undefined> {
  let token: Token | undefined;
  const now = new Date();
  const timestamp = Date.now().toString();

  try {
    const res: AxiosResponse = await axios.get<Token>(`${BASE_URL}/open/api/v2/market/ticker`, {
      params: {
        symbol,
      },
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Cache-Control': 'no-cache',
        'Request-Time': timestamp,
      },
    });

    if (res?.data?.code === 200) {
      token = res?.data?.data[0];
    } else {
      console.error(`error ${res?.data?.code}: ${res?.data?.msg}`);
      process.exit(1);
    }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`🔴 ${error?.response?.data?.code}: ${error?.response?.data?.msg} 🔴`);
    } else {
      console.error(`🔴 ${error} 🔴`);
    }
    process.exit(1);
  }
  const end = new Date();
  const diff = end.getTime() - now.getTime();
  console.log(`--------------------------------------------------------------`);
  console.log(`🔎\tfetching token ${token?.symbol}`);
  console.log(`\tAsk: ${token?.ask}, Bid: ${token?.bid}, Took: ${diff}ms}`);
  console.log(`--------------------------------------------------------------`);
  return token;
}
