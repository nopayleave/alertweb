export enum AlertAction {
  BUY = 'BUY',
  SELL = 'SELL',
}

export interface Alert {
  id: string;
  ticker: string;
  price: number;
  action: AlertAction;
  timestamp: Date;
  message: string;
  updated?: boolean;
}
