import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { currencies } from '@/page/home/const.ts';
import type { CurrencySelection } from '@/page/home/type';
import { AmountField } from './AmountField.tsx';
import { CurrencySelectorModal } from './CurrencySelectorModal.tsx';
import { SwapSuccessModal, type SubmittedSwap } from './SwapSuccessModal.tsx';

type CurrencyField = 'send' | 'receive';

export type SwapFormValues = {
  sendAmount: string;
  receiveAmount: string;
};

function parseAmount(amount: string) {
  return Number.parseFloat(amount.replaceAll(',', ''));
}

function formatAmount(amount: number) {
  return amount.toLocaleString(undefined, {
    maximumFractionDigits: 6,
  });
}

function validateSendAmount(amount: string) {
  if (!amount.trim()) {
    return 'Enter the amount you want to send.';
  }

  if (parseAmount(amount) < 0) {
    return 'Send amount cannot be negative.';
  }
}

function validateReceiveAmount(amount: string) {
  if (!amount.trim()) {
    return 'Enter the amount you want to receive.';
  }

  if (parseAmount(amount) < 0) {
    return 'Receive amount cannot be negative.';
  }
}

type SwapFormProps = {
  sendCurrencyId: string;
  receiveCurrencyId: string;
  sendCurrency: CurrencySelection;
  receiveCurrency: CurrencySelection;
  sendNetwork: string;
  receiveNetwork: string;
  latestExchangeRate?: number;
  isExchangeRateFetching: boolean;
  onSendCurrencyIdChange: (currencyId: string) => void;
  onReceiveCurrencyIdChange: (currencyId: string) => void;
  onSendNetworkChange: (network: string) => void;
  onReceiveNetworkChange: (network: string) => void;
};

export function SwapForm({
  sendCurrencyId,
  receiveCurrencyId,
  sendCurrency,
  receiveCurrency,
  sendNetwork,
  receiveNetwork,
  latestExchangeRate,
  isExchangeRateFetching,
  onSendCurrencyIdChange,
  onReceiveCurrencyIdChange,
  onSendNetworkChange,
  onReceiveNetworkChange,
}: SwapFormProps) {
  const [activeField, setActiveField] = useState<CurrencyField | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState(sendNetwork);
  const [currencyQuery, setCurrencyQuery] = useState('');
  const [isSwapSubmitting, setIsSwapSubmitting] = useState(false);
  const [submittedSwap, setSubmittedSwap] = useState<SubmittedSwap | null>(null);

  const lastEditedAmountField = useRef<CurrencyField>('send');
  const submitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { clearErrors, control, handleSubmit, setValue } = useForm<SwapFormValues>({
    defaultValues: {
      sendAmount: '',
      receiveAmount: '',
    },
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const sendAmount = useWatch({
    control,
    name: 'sendAmount',
  });

  const receiveAmount = useWatch({
    control,
    name: 'receiveAmount',
  });

  const networks = useMemo(
    () => Array.from(new Set(currencies.flatMap((currency) => currency.network))),
    [],
  );

  const filteredCurrencies = useMemo(() => {
    const normalizedQuery = currencyQuery.trim().toLowerCase();
    const currenciesOnNetwork = currencies.filter((currency) =>
      currency.network.includes(selectedNetwork),
    );

    if (!normalizedQuery) {
      return currenciesOnNetwork;
    }

    return currenciesOnNetwork.filter((currency) => {
      const searchableValue = `${currency.symbol} ${currency.name}`.toLowerCase();
      return searchableValue.includes(normalizedQuery);
    });
  }, [currencyQuery, selectedNetwork]);

  const rateLabel =
    latestExchangeRate === undefined
      ? 'Review before confirming'
      : `1 ${sendCurrency.symbol} = ${latestExchangeRate.toLocaleString(undefined, {
          maximumFractionDigits: 6,
        })} ${receiveCurrency.symbol}`;

  function handleSwapSubmit(values: SwapFormValues) {
    const nextSubmittedSwap = {
      ...values,
      receiveCurrencySymbol: receiveCurrency.symbol,
      receiveNetwork,
      sendCurrencySymbol: sendCurrency.symbol,
      sendNetwork,
    };

    setIsSwapSubmitting(true);

    submitTimerRef.current = setTimeout(() => {
      setSubmittedSwap(nextSubmittedSwap);
      setIsSwapSubmitting(false);
      submitTimerRef.current = null;
    }, 1000);
  }

  function openCurrencySelector(field: CurrencyField) {
    setCurrencyQuery('');
    setSelectedNetwork(field === 'send' ? sendNetwork : receiveNetwork);
    setActiveField(field);
  }

  function closeCurrencySelector() {
    setActiveField(null);
  }

  function closeSuccessModal() {
    setSubmittedSwap(null);
  }

  function handleCurrencySelect(currency: CurrencySelection) {
    if (activeField === 'send') {
      onSendCurrencyIdChange(currency.id);
      onSendNetworkChange(selectedNetwork);
    }

    if (activeField === 'receive') {
      onReceiveCurrencyIdChange(currency.id);
      onReceiveNetworkChange(selectedNetwork);
    }

    closeCurrencySelector();
  }

  function handleSwapCurrencies() {
    closeCurrencySelector();
    onSendCurrencyIdChange(receiveCurrencyId);
    onReceiveCurrencyIdChange(sendCurrencyId);
    onSendNetworkChange(receiveNetwork);
    onReceiveNetworkChange(sendNetwork);
  }

  useEffect(() => {
    if (lastEditedAmountField.current !== 'send') {
      return;
    }

    const parsedAmount = parseAmount(sendAmount);

    if (!sendAmount || Number.isNaN(parsedAmount) || latestExchangeRate === undefined) {
      setValue('receiveAmount', '');
      return;
    }

    const nextReceiveAmount = formatAmount(parsedAmount * latestExchangeRate);

    setValue('receiveAmount', nextReceiveAmount);

    if (!validateReceiveAmount(nextReceiveAmount)) {
      clearErrors('receiveAmount');
    }
  }, [clearErrors, latestExchangeRate, sendAmount, setValue]);

  useEffect(() => {
    if (lastEditedAmountField.current !== 'receive') {
      return;
    }

    const parsedAmount = parseAmount(receiveAmount);

    if (
      !receiveAmount ||
      Number.isNaN(parsedAmount) ||
      latestExchangeRate === undefined ||
      latestExchangeRate === 0
    ) {
      setValue('sendAmount', '');
      return;
    }

    const nextSendAmount = formatAmount(parsedAmount / latestExchangeRate);

    setValue('sendAmount', nextSendAmount);

    if (!validateSendAmount(nextSendAmount)) {
      clearErrors('sendAmount');
    }
  }, [clearErrors, latestExchangeRate, receiveAmount, setValue]);

  useEffect(() => {
    return () => {
      if (submitTimerRef.current) {
        clearTimeout(submitTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      <form
        className="swap-form relative z-[1] flex-[0_0_450px] rounded-[18px] border border-[rgba(148,163,184,0.22)] bg-[radial-gradient(circle_at_100%_0%,rgba(56,189,248,0.14),transparent_34%),linear-gradient(145deg,rgba(30,41,59,0.96),rgba(15,23,42,0.94)_54%,rgba(2,6,23,0.96))] p-11 shadow-[0_18px_45px_rgba(17,24,39,0.22)] max-[780px]:flex-auto max-[780px]:p-[30px_22px]"
        onSubmit={handleSubmit(handleSwapSubmit)}
      >
        <div className="mb-[30px]">
          <h2 className="m-0 mb-5 text-[clamp(1.6rem,3.5vw,2.35rem)] leading-none font-bold tracking-[-0.04em] text-white font-sans">
            Snappy Swap
          </h2>
          <p className="m-0 text-sm leading-[1.6] text-violet-100 [font-family:var(--font-lato)]">
            Enter the amount you want to send and the amount you expect to receive.
          </p>
        </div>

        <div className="flex flex-col gap-[18px]">
          <AmountField
            id="input-amount"
            label="Amount to send"
            currencyId="send-currency"
            control={control}
            name="sendAmount"
            selectedCurrency={sendCurrency}
            selectedNetwork={sendNetwork}
            validate={validateSendAmount}
            onAmountChange={(value) => {
              lastEditedAmountField.current = 'send';

              if (!validateSendAmount(value)) {
                clearErrors('sendAmount');
              }
            }}
            onSelectCurrency={() => openCurrencySelector('send')}
          />

          <div className="-my-[5px] flex items-center justify-center">
            <button
              className="flex h-[46px] w-[46px] items-center justify-center rounded-full border-8 border-[#383838] bg-[var(--brand)] text-[1.1rem] text-white transition-[transform,filter] duration-200 hover:rotate-180 hover:saturate-[1.08] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[rgba(15,118,110,0.22)] active:scale-95"
              type="button"
              aria-label="Swap send and receive currencies"
              onClick={handleSwapCurrencies}
            >
              ⇅
            </button>
          </div>

          <AmountField
            id="output-amount"
            label="Amount to receive"
            currencyId="receive-currency"
            control={control}
            name="receiveAmount"
            selectedCurrency={receiveCurrency}
            selectedNetwork={receiveNetwork}
            validate={validateReceiveAmount}
            onAmountChange={(value) => {
              lastEditedAmountField.current = 'receive';

              if (!validateReceiveAmount(value)) {
                clearErrors('receiveAmount');
              }
            }}
            onSelectCurrency={() => openCurrencySelector('receive')}
          />
        </div>

        <div className="my-[22px] mb-[26px] flex items-center justify-between gap-[18px] rounded-xl bg-white/10 px-[18px] py-4 text-[0.82rem] leading-[1.5] text-violet-100 max-[780px]:flex-col max-[780px]:items-start">
          <span>Estimated rate</span>
          <strong className="inline-flex items-center gap-2 text-white">
            {isExchangeRateFetching ? (
              <>
                <span
                  className="h-4 w-4 animate-spin rounded-full border-2 border-[rgba(15,118,110,0.22)] border-t-[var(--brand)]"
                  aria-hidden="true"
                />
                Fetching rate
              </>
            ) : (
              rateLabel
            )}
          </strong>
        </div>

        <button
          className="inline-flex min-h-[58px] w-full items-center justify-center rounded-xl border-0 bg-[linear-gradient(135deg,var(--brand),var(--brand-dark))] text-[0.86rem] font-extrabold tracking-[0.06em] text-white uppercase transition-[transform,filter] duration-200 hover:-translate-y-0.5 hover:saturate-[1.08] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[rgba(15,118,110,0.22)] active:translate-y-0 disabled:cursor-wait disabled:hover:translate-y-0 disabled:hover:saturate-100"
          type="submit"
          disabled={isExchangeRateFetching || isSwapSubmitting}
        >
          {isExchangeRateFetching || isSwapSubmitting ? (
            <span className="inline-flex items-center gap-1" aria-label="Loading exchange rate">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white [animation-delay:-0.1s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-white" />
            </span>
          ) : (
            'Confirm swap'
          )}
        </button>
        <p className="mt-[18px] mb-0 text-center text-[0.76rem] leading-[1.6] text-violet-100 [font-family:var(--font-lato)]">
          No funds move until you approve the final transaction details.
        </p>
      </form>

      {activeField && (
        <CurrencySelectorModal
          activeFieldLabel={activeField === 'send' ? 'Amount to send' : 'Amount to receive'}
          currencies={filteredCurrencies}
          networks={networks}
          query={currencyQuery}
          selectedCurrencyId={activeField === 'send' ? sendCurrencyId : receiveCurrencyId}
          selectedCurrencyNetwork={activeField === 'send' ? sendNetwork : receiveNetwork}
          selectedNetwork={selectedNetwork}
          onQueryChange={setCurrencyQuery}
          onNetworkChange={setSelectedNetwork}
          onSelect={handleCurrencySelect}
          onClose={closeCurrencySelector}
        />
      )}

      {submittedSwap && (
        <SwapSuccessModal submittedSwap={submittedSwap} onClose={closeSuccessModal} />
      )}
    </>
  );
}
