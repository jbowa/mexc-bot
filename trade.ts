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
  const safeAskLimit = safeNumber(ASK_LIMIT);
  // let orderId;

  isValidSpread(safeBid, safeAsk);
  logStrategy(safeBid, safeAsk, token, acctBalance);

  return await new Promise(async (resolve) => {
    const interval = setInterval(async () => {
      // refetch token volume, price, etc.
      const newToken = await getToken(token.symbol);
      safeAsk = safeNumber(newToken?.ask);
      safeBid = safeNumber(newToken?.bid);

      //1) skip trade if the ask price is higher than our bid limit
      //2) skip trade if the bid price is lower than our ask limit
      // NOTE createSpotOrder returns orderId
      if (safeBid) {
        if (safeBidLimit) {
          if (!(safeAsk > safeBidLimit) || !(safeNumber(BID) > safeBidLimit)) {
            await createSpotOrder(newToken, acctBalance, resolve, TRADE_TYPE.BID);
          }
        } else {
          await createSpotOrder(newToken, acctBalance, resolve, TRADE_TYPE.BID);
        }
      }
      if (safeAsk) {
        if (safeAskLimit) {
          if (!(safeBid < safeAskLimit) || !(safeNumber(ASK) < safeAskLimit)) {
            await createSpotOrder(newToken, acctBalance, resolve, TRADE_TYPE.ASK);
          }
        } else {
          await createSpotOrder(newToken, acctBalance, resolve, TRADE_TYPE.ASK);
        }
      }
      // clearInterval(interval);
    }, pollInterval);
  });
}
