import type { ComponentType, SVGProps } from 'react';

type CurrencyChipProps = {
  id: string;
  code: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  network: string;
  onClick: () => void;
};

export function CurrencyChip({ id, code, Icon, network, onClick }: CurrencyChipProps) {
  return (
    <button
      className="inline-flex min-w-[118px] items-center justify-center gap-2 rounded-full border border-white/15 bg-white/12 px-3 py-2.5 text-white transition-[border-color,background,transform] duration-200 hover:border-white/30 hover:bg-white/18 focus-visible:border-white/30 focus-visible:bg-white/18 focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[rgba(196,181,253,0.34)] active:translate-y-px"
      id={id}
      type="button"
      aria-label={`Select ${network} ${code} currency`}
      onClick={onClick}
    >
      <Icon className="h-[22px] w-[22px] rounded-full" aria-hidden="true" focusable="false" />
      <span className="flex flex-col items-start gap-px">
        <strong className="text-[0.76rem] leading-none">{code}</strong>
        <small className="text-[0.58rem] whitespace-nowrap font-bold text-violet-100">
          {network}
        </small>
      </span>
      <span className="text-[0.9rem] leading-none text-violet-100" aria-hidden="true">
        ⌄
      </span>
    </button>
  );
}
