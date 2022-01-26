export interface Token {
  symbol: string;
  volume: string;
  high: string;
  low: string;
  bid: string;
  ask: string;
  open: string;
  last: string;
  time: string;
  change_rate: string;
}

type B = { frozen: string; available: string };
export type Balance = Record<string, B>;

export enum TRADE_TYPE {
  BID = 'BID',
  ASK = 'ASK',
}

export enum ORDER_TYPE {
  LIMIT_ORDER = 'LIMIT_ORDER',
  POST_ONLY = 'POST_ONLY',
  IMMEDIATE_OR_CANCEL = 'IMMEDIATE_OR_CANCEL',
}

export type OrderPayload = {
  code: number;
  data: string;
};
