export interface Coin {
  id: string;
  rank: string;
  symbol: string;
  name: string;
  supply: string;
  maxSupply: string;
  marketCapUsd: string;
  volumeUsd24Hr: string;
  priceUsd: string;
  changePercent24Hr: string;
  vwap24Hr: string;
}

export interface WsPrices {
  [key: string]: string;
}

export interface CoinsResponse {
  data: Coin[];
  timestamp: number;
}