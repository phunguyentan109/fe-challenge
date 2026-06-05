import type { EndpointBuilder } from '@reduxjs/toolkit/query';
import { api, apiTags, type ApiBaseQuery, type ApiTag } from '@/redux/api.ts';

export type Coin = {
  id: string;
  symbol: string;
  name: string;
  platforms: {
    [key: string]: string;
  };
};

type CoinMarketChart = {
  prices: [number, number][];
};

export type ExchangeRateHistoryQuery = {
  sendCurrencyId: string;
  receiveCurrencyId: string;
};

export type ExchangeRateHistoryPoint = {
  time: string;
  value: number;
};

function toDailyPriceMap(prices: CoinMarketChart['prices']) {
  const dailyPrices = new Map<string, number>();

  for (const [timestamp, price] of prices) {
    const day = new Date(timestamp).toISOString().slice(0, 10);
    dailyPrices.set(day, price);
  }

  return dailyPrices;
}

const coinGeckoApi = api.injectEndpoints({
  endpoints: (builder: EndpointBuilder<ApiBaseQuery, ApiTag, 'api'>) => ({
    getCoinList: builder.query<Coin[], void>({
      query: () => {
        return {
          url: '/coins/list',
          method: 'GET',
        };
      },
      providesTags: [apiTags.coinList],
    }),
    getExchangeRateHistory: builder.query<ExchangeRateHistoryPoint[], ExchangeRateHistoryQuery>({
      async queryFn({ sendCurrencyId, receiveCurrencyId }, _queryApi, _extraOptions, fetchWithBQ) {
        const sendResult = await fetchWithBQ({
          url: `/coins/${sendCurrencyId}/market_chart`,
          method: 'GET',
          params: {
            vs_currency: 'usd',
            days: 10,
          },
        });

        if (sendResult.error) {
          return { error: sendResult.error };
        }

        const receiveResult =
          sendCurrencyId === receiveCurrencyId
            ? sendResult
            : await fetchWithBQ({
                url: `/coins/${receiveCurrencyId}/market_chart`,
                method: 'GET',
                params: {
                  vs_currency: 'usd',
                  days: 10,
                },
              });

        if (receiveResult.error) {
          return { error: receiveResult.error };
        }

        const sendPrices = toDailyPriceMap((sendResult.data as CoinMarketChart).prices);
        const receivePrices = toDailyPriceMap((receiveResult.data as CoinMarketChart).prices);
        const exchangeRates: ExchangeRateHistoryPoint[] = [];

        for (const [day, sendPrice] of sendPrices) {
          const receivePrice = receivePrices.get(day);

          if (receivePrice) {
            exchangeRates.push({
              time: day,
              value: sendPrice / receivePrice,
            });
          }
        }

        return {
          data: exchangeRates.sort((a, b) => a.time.localeCompare(b.time)).slice(-10),
        };
      },
      providesTags: [apiTags.historicalData],
    }),
  }),
  overrideExisting: true,
});

export const { useGetExchangeRateHistoryQuery } = coinGeckoApi;
