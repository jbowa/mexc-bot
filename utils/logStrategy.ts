import { Token } from '../types';

export default function logStrategy(
  bid: number | undefined,
  ask: number | undefined,
  token: Token,
  acctBalance: any
): void {
  const first = token.symbol.split('_')[0];
  const second = token.symbol.split('_')[1];
  console.log(`--------------------------------------------------------------`);
  console.log(`💼\tYour ${second} balance is ${acctBalance[second]?.available ?? 0}`);
  console.log(`💼\tYour ${first} balance is ${acctBalance[first]?.available ?? 0}`);
  console.log(`🪙\t${first} current BID is ${token.bid} and ask ${token.ask}`);

  if (!bid && !ask) {
    console.log('🟠\tI found no bid, and no ask. I will not trade! bye bye');
    process.exit(0);
  }

  if (bid) {
    console.log(`🟢\tBid price set! I will buy at ${bid}`);
  } else {
    console.log(`🔴\tI found no bid price set, I won't buy at any price`);
  }

  if (ask) {
    console.log(`🟢\tAsk price set! I will sell at ${ask}`);
  } else {
    console.log(`🔴\tI found no ask price set, I won't sell at any price`);
  }
  console.log(`--------------------------------------------------------------`);
}
