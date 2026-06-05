import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { useController } from 'react-hook-form';
import type { CurrencySelection } from '@/page/home/type';
import { CurrencyChip } from './CurrencyChip.tsx';

type AmountFieldProps<TFieldValues extends FieldValues> = {
  id: string;
  label: string;
  currencyId: string;
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  selectedCurrency: CurrencySelection;
  selectedNetwork: string;
  readOnly?: boolean;
  onAmountChange?: (value: string) => void;
  onSelectCurrency: () => void;
  validate?: (value: string) => string | undefined;
};

export function AmountField<TFieldValues extends FieldValues>({
  id,
  label,
  currencyId,
  control,
  name,
  selectedCurrency,
  selectedNetwork,
  readOnly = false,
  onAmountChange,
  onSelectCurrency,
  validate,
}: AmountFieldProps<TFieldValues>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name,
    rules: {
      validate,
    },
  });

  const value = typeof field.value === 'string' ? field.value : '';
  const errorId = `${id}-error`;
  const containerClassName = [
    'flex flex-col gap-2.5 rounded-[14px] border bg-white/10 p-[18px] transition-[border-color,transform] duration-200 focus-within:-translate-y-px',
    error
      ? 'border-red-300/80 focus-within:border-red-300'
      : 'border-white/15 focus-within:border-[rgba(196,181,253,0.68)]',
  ].join(' ');

  return (
    <div className={containerClassName}>
      <label className="text-[0.76rem] font-bold tracking-[0.02em] text-violet-100" htmlFor={id}>
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          className="w-full min-w-0 flex-auto border-0 bg-transparent text-[clamp(1.45rem,5vw,2.05rem)] font-bold tracking-[-0.04em] text-white outline-0 placeholder:text-violet-200/60"
          id={id}
          inputMode="decimal"
          name={field.name}
          placeholder="0.00"
          aria-describedby={error ? `${currencyId} ${errorId}` : currencyId}
          aria-invalid={error ? 'true' : 'false'}
          readOnly={readOnly}
          value={value}
          onBlur={field.onBlur}
          onChange={(event) => {
            const nextValue = event.target.value;

            onAmountChange?.(nextValue);
            field.onChange(nextValue);
          }}
        />
        <CurrencyChip
          id={currencyId}
          code={selectedCurrency.symbol}
          Icon={selectedCurrency.icon}
          network={selectedNetwork}
          onClick={onSelectCurrency}
        />
      </div>
      {error?.message && (
        <p className="m-0 text-[0.72rem] font-medium text-red-200" id={errorId}>
          {error.message}
        </p>
      )}
    </div>
  );
}
