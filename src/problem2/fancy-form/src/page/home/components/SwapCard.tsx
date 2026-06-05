import { useMemo, useState } from 'react';
import { currencies } from '@/page/home/const.ts';
import type { ExchangeRateHistoryPoint } from '@/redux/endpoints/coingecko.ts';
import { useGetExchangeRateHistoryQuery } from '@/redux/endpoints/coingecko.ts';
import ChartPanel from './ChartPanel.tsx';
import { SwapForm } from './SwapForm.tsx';

const emptyExchangeRateHistory: ExchangeRateHistoryPoint[] = [];

export function SwapCard() {
  const [sendCurrencyId, setSendCurrencyId] = useState(currencies[0].id);
  const [receiveCurrencyId, setReceiveCurrencyId] = useState(currencies[1].id);
  const [sendNetwork, setSendNetwork] = useState('Ethereum');
  const [receiveNetwork, setReceiveNetwork] = useState('Ethereum');

  const { sendCurrency, receiveCurrency } = useMemo(() => {
    let nextSendCurrency = currencies[0];
    let nextReceiveCurrency = currencies[1];

    for (const currency of currencies) {
      if (currency.id === sendCurrencyId) {
        nextSendCurrency = currency;
      }

      if (currency.id === receiveCurrencyId) {
        nextReceiveCurrency = currency;
      }
    }

    return {
      sendCurrency: nextSendCurrency,
      receiveCurrency: nextReceiveCurrency,
    };
  }, [sendCurrencyId, receiveCurrencyId]);

  const {
    data: exchangeRateHistory = emptyExchangeRateHistory,
    isFetching: isExchangeRateHistoryFetching,
    isError: isExchangeRateHistoryError,
  } = useGetExchangeRateHistoryQuery({
    sendCurrencyId,
    receiveCurrencyId,
  });

  const latestExchangeRate = exchangeRateHistory.at(-1)?.value;

  return (
    <section
      className="relative z-[1] flex w-[min(100%,1120px)] items-start gap-5 max-[780px]:w-[min(100%,560px)] max-[780px]:flex-col max-[780px]:rounded-2xl"
      aria-label="Token swap form"
    >
      <ChartPanel
        sendCurrency={sendCurrency}
        receiveCurrency={receiveCurrency}
        sendNetwork={sendNetwork}
        receiveNetwork={receiveNetwork}
        exchangeRateHistory={exchangeRateHistory}
        isExchangeRateHistoryFetching={isExchangeRateHistoryFetching}
        isExchangeRateHistoryError={isExchangeRateHistoryError}
      />

      <SwapForm
        sendCurrencyId={sendCurrencyId}
        receiveCurrencyId={receiveCurrencyId}
        sendCurrency={sendCurrency}
        receiveCurrency={receiveCurrency}
        sendNetwork={sendNetwork}
        receiveNetwork={receiveNetwork}
        latestExchangeRate={latestExchangeRate}
        isExchangeRateFetching={isExchangeRateHistoryFetching}
        onSendCurrencyIdChange={setSendCurrencyId}
        onReceiveCurrencyIdChange={setReceiveCurrencyId}
        onSendNetworkChange={setSendNetwork}
        onReceiveNetworkChange={setReceiveNetwork}
      />
    </section>
  );
}
