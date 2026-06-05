import { memo } from 'react';
import type { CurrencySelection } from '@/page/home/type';
import type { ExchangeRateHistoryPoint } from '@/redux/endpoints/coingecko.ts';
import { ExchangeRateChart } from './ExchangeRateChart.tsx';

type ChartPanelProps = {
  sendCurrency: CurrencySelection;
  receiveCurrency: CurrencySelection;
  sendNetwork: string;
  receiveNetwork: string;
  exchangeRateHistory: ExchangeRateHistoryPoint[];
  isExchangeRateHistoryFetching: boolean;
  isExchangeRateHistoryError: boolean;
};

const ChartPanel = memo(
  ({
    sendCurrency,
    receiveCurrency,
    sendNetwork,
    receiveNetwork,
    exchangeRateHistory,
    isExchangeRateHistoryFetching,
    isExchangeRateHistoryError,
  }: ChartPanelProps) => {
    const latestRate = exchangeRateHistory.at(-1)?.value;

    const rateLabel =
      latestRate === undefined
        ? 'Rate unavailable'
        : `1 ${sendCurrency.symbol} = ${latestRate.toLocaleString(undefined, {
            maximumFractionDigits: 6,
          })} ${receiveCurrency.symbol}`;

    return (
      <aside
        className="chart-card mt-6 relative flex flex-[1.9_1_0] flex-col justify-between overflow-hidden rounded-[18px] border border-[rgba(196,181,253,0.26)] p-9 text-white shadow-[0_18px_45px_rgba(17,24,39,0.26)] max-[780px]:p-[26px_22px]"
        aria-label={`${sendCurrency.symbol} to ${receiveCurrency.symbol} exchange rate chart`}
      >
        <div className="relative z-[1] flex items-start justify-between gap-6 max-[780px]:flex-col">
          <div>
            <span className="mb-3 inline-flex text-[0.72rem] font-extrabold tracking-[0.08em] text-violet-200 uppercase">
              Swap insight
            </span>
            <h2 className="m-0 flex max-w-[420px] items-center gap-4 text-[clamp(2rem,4.5vw,3.5rem)] leading-none tracking-[-0.04em] text-white">
              <span className="flex w-[58px] flex-none items-center" aria-hidden="true">
                <sendCurrency.icon className="relative z-[1] h-[38px] w-[38px] -translate-y-1.5 rounded-full border-[3px] border-white shadow-[0_10px_24px_rgba(23,33,43,0.14)]" />
                <receiveCurrency.icon className="-ml-4 h-[38px] w-[38px] translate-y-1.5 rounded-full border-[3px] border-white shadow-[0_10px_24px_rgba(23,33,43,0.14)]" />
              </span>
              <span className="whitespace-nowrap">
                {sendCurrency.symbol} / {receiveCurrency.symbol}
              </span>
            </h2>
          </div>
          <span className="flex-none rounded-full border border-white/15 bg-white/10 px-3 py-[9px] text-[0.7rem] font-bold text-violet-100">
            Last 10 days
          </span>
        </div>

        <div className="relative z-[1] my-12 min-h-[240px] overflow-hidden rounded-2xl border border-white/12 bg-white/10 max-[780px]:my-7 max-[780px]:min-h-[190px]">
          {isExchangeRateHistoryFetching ? (
            <div
              className="min-h-[240px] animate-pulse bg-[linear-gradient(90deg,rgba(255,255,255,0.08),rgba(196,181,253,0.22),rgba(255,255,255,0.08))] max-[780px]:min-h-[190px]"
              aria-label="Loading exchange rate chart"
            />
          ) : exchangeRateHistory.length > 0 ? (
            <ExchangeRateChart data={exchangeRateHistory} />
          ) : (
            <div className="flex min-h-[240px] items-center justify-center px-6 text-center text-[0.86rem] leading-[1.6] text-violet-100 max-[780px]:min-h-[190px]">
              {isExchangeRateHistoryError
                ? 'Unable to load Coingecko historical data for this pair.'
                : 'Waiting for historical exchange-rate data.'}
            </div>
          )}
        </div>

        <p className="relative z-[1] m-0 max-w-[520px] text-[0.88rem] leading-[1.7] [font-family:var(--font-lato)] text-violet-100">
          {rateLabel} based on Coingecko USD prices for {sendCurrency.name} on {sendNetwork} and{' '}
          {receiveCurrency.name} on {receiveNetwork}.
        </p>
      </aside>
    );
  },
);

export default ChartPanel;
