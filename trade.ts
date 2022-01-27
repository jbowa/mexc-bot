require('./utils/dotenv');
import { Balance, Token, TRADE_TYPE } from './types';
import getToken from './utils/getToken';
import safeNumber from './utils/safeNumber';
import createSpotOrder from './utils/createSpotOrder';
import isValidSpread from './utils/isValidSpread';
import logStrategy from './utils/logStrategy';

const { BID, ASK, INTERVAL, BID_LIMIT, ASK_LIMIT } = process.env;

// BID - the highest price a buyer will pay to buy
// ASK - the lowest price at which a seller will sell
export default async function trade(acctBalance: Balance, token: Token): Promise<Token> {
  const pollInterval = Number(INTERVAL)!;
  let safeBid = safeNumber(BID);
  let safeAsk = safeNumber(ASK);
  const safeBidLimit = safeNumber(BID_LIMIT);
  // const safeAskLimit = safeNumber(ASK_LIMIT);
  // let orderId;

  // isValidSpread(safeBid, safeAsk);
  logStrategy(safeBid, safeAsk, token, acctBalance);

  return await new Promise(async (resolve) => {
    const interval = setInterval(async () => {
      // refetch token volume, price, etc.
      const newToken = await getToken(token.symbol);
      safeAsk = safeNumber(newToken?.ask);
      // safeBid = safeNumber(newToken?.bid);

      // price is within our buy limit
      if (safeAsk < safeBidLimit) {
        await createSpotOrder(newToken, acctBalance, resolve, TRADE_TYPE.BID);
      } else {
        console.log('--------------------------------------------------------------');
        console.log(
          `⚠️\tPrice (${safeAsk.toPrecision(
            5
          )}) higher than our bid limit (${safeBidLimit.toPrecision(5)})`
        );
        console.log('--------------------------------------------------------------');
      }
      // clearInterval(interval);
    }, pollInterval);
  });
}
