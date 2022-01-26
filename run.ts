/**
 * TODO
 * 1) Allow user to set maxiumum quantity.
 * 2) Support post only & immediate or cancel orders.
 * 3) Do not post orders if order_type is a limit order.
 */
require('./utils/dotenv');
import getToken from './utils/getToken';
import getBalance from './utils/getBalance';
import trade from './trade';
import { Balance } from './types';
import isObject from './utils/isObject';

const { TRADING_PAIR } = process.env;

const run = async () => {
  const tradingPair = TRADING_PAIR!;

  console.clear();
  console.log(`\n--------------------------------------------------------------`);
  console.log('welcome to 👀 REKT trading bot');
  console.log(`this bot will trade your ${tradingPair} pair for you.`);
  console.log(`this bot practically gurantees to rek your portfolio.`);
  console.log('so please, use at your own risk.');
  console.log(`--------------------------------------------------------------`);

  // get account balance
  let acctBalance: Balance = await getBalance();
  console.log(acctBalance);

  // get token information
  const token = await getToken(tradingPair);

  // okay, let's fuckin trade!
  if (token && isObject(token) && acctBalance && isObject(acctBalance))
    await trade(acctBalance, token);
};

run();
