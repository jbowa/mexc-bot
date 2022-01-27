import axios from 'axios';
import { Token } from '../types';
import getBalance from './getBalance';
import safeNumber from './safeNumber';
import getClientOrderId from './getClientOrderIt';
import { TRADE_TYPE, ORDER_TYPE, OrderPayload, Balance } from '../types';
import sign from './sign';
import isObject from './isObject';

const { BASE_URL, ACCESS_KEY, SECRET_KEY } = process.env;

const verifyTrading = (bid: number, ask: number) => {
  if (!bid || !ask) {
    console.log('--------------------------------------------------------------');
    console.log('⚠️\tBid or Ask is 0, Trading has not started.');
    console.log('\tTrade will be executed automatically. chill out.');
    console.log('--------------------------------------------------------------');
  }
};

export default async function createSpotOrder(
  token: Token | undefined,
  acctBalance: Balance,
  resolve: (value: Token | PromiseLike<Token>) => void,
  tradeType: TRADE_TYPE
): Promise<OrderPayload | undefined> {
  const now = new Date();
  const symbol = token?.symbol;
  const currency = symbol?.split('_')[1] ?? '';
  const safeBid = safeNumber(token?.bid);
  const safeAsk = safeNumber(token?.ask);
  const balance = safeNumber(acctBalance[currency]?.available) ?? 0;
  const price = tradeType === TRADE_TYPE.BID ? safeNumber(token?.bid) : safeNumber(token?.ask);
  const quantity = Math.abs(balance / price) * 0.99 ?? 0;
  const clientOrderId = getClientOrderId().substring(0, 30);
  const spread = Math.abs(safeAsk - safeBid);

  verifyTrading(safeBid, safeAsk);

  if (balance > price * quantity) {
    const order = {
      symbol,
      price,
      quantity: quantity.toString(),
      trade_type: tradeType,
      // order_type: ORDER_TYPE.LIMIT_ORDER,
      order_type: ORDER_TYPE.IMMEDIATE_OR_CANCEL,
      client_order_id: clientOrderId,
    };

    const accessKey = ACCESS_KEY!;
    const secretKey = SECRET_KEY!;
    const params = JSON.stringify(order);
    const timestamp = Date.now().toString();
    const signature = sign(accessKey, timestamp, params, secretKey);

    // headers
    const headers = {
      ApiKey: accessKey,
      Signature: signature,
      'Request-Time': timestamp,
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Cache-Control': 'no-cache',
    };

    console.log('--------------------------------------------------------------');
    console.log('🐝\tEXECUTING TRADE');
    console.log(`\tTrade type: ${tradeType}`);
    console.log(`\tSpread: ${spread}`);
    console.log(`\tPrice: ${price}`);
    console.log(`\tQuantity: ${quantity}`);
    console.log(`\tLowest Sell: ${safeAsk}, Highest Buy: ${safeBid}`);
    console.log('--------------------------------------------------------------');

    try {
      const res = await axios({
        method: 'POST',
        url: `${BASE_URL}/open/api/v2/order/place`,
        data: order,
        headers,
      });

      if (res?.data?.code === 200) {
        const end = new Date();
        const diff = end.getTime() - now.getTime();

        console.log(`--------------------------------------------------------------`);
        console.log(`🎉\tORDER PLACED SUCCESSFULLY!`);
        console.log(`\tTrade type:\t\t ${order.trade_type}`);
        console.log(`\t@Price:\t\t\t ${order.price}`);
        console.log(`\t#Quantity:\t\t ${order.quantity}`);
        console.log(`\tTook:\t\t ${diff}ms`);
        console.log(`--------------------------------------------------------------`);

        // update balance
        // TODO Uncomment this line out,
        // After each trade we want to update the balance
        // commented out for now to save extra ms on the request.
        // acctBalance = await getBalance();
        resolve(isObject(res?.data?.data) ? res?.data.data : undefined);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log('--------------------------------------------------------------');
        console.log(`🔴\t${error?.response?.data?.code}: ${error?.response?.data?.msg}`);
        console.log('--------------------------------------------------------------');
      } else {
        console.log('--------------------------------------------------------------');
        console.log(`🔴\t${error}`);
        console.log('--------------------------------------------------------------');
      }
    }

    return;
  }

  if (balance < price * quantity) {
    console.log('--------------------------------------------------------------');
    console.log(`⚠️\tYou do not have enought ${currency}`); // or second pair
    console.log('\tDepost more balance to execute order!');
    console.log('--------------------------------------------------------------');
    return;
  }
}
