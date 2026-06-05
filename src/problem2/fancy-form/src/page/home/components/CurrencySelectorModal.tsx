import type { CurrencySelection } from '@/page/home/type';

type CurrencySelectorModalProps = {
  activeFieldLabel: string;
  currencies: CurrencySelection[];
  networks: string[];
  query: string;
  selectedCurrencyId: string;
  selectedCurrencyNetwork: string;
  selectedNetwork: string;
  onQueryChange: (query: string) => void;
  onNetworkChange: (network: string) => void;
  onSelect: (currency: CurrencySelection) => void;
  onClose: () => void;
};

export function CurrencySelectorModal({
  activeFieldLabel,
  currencies,
  networks,
  query,
  selectedCurrencyId,
  selectedCurrencyNetwork,
  selectedNetwork,
  onQueryChange,
  onNetworkChange,
  onSelect,
  onClose,
}: CurrencySelectorModalProps) {
  return (
    <div
      className="modal-backdrop fixed inset-0 z-10 flex items-center justify-center bg-[rgba(23,33,43,0.42)] p-6 backdrop-blur-[7px]"
      role="presentation"
      onClick={onClose}
    >
      <section
        className="currency-modal flex max-h-[min(720px,calc(100vh-48px))] w-[min(100%,520px)] flex-col rounded-[18px] border border-[rgba(219,228,236,0.95)] p-[26px] shadow-[0_26px_70px_rgba(23,33,43,0.2)] max-[780px]:p-[22px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="currency-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-[22px] flex items-start justify-between gap-[18px]">
          <div>
            <span className="mb-2 inline-flex text-[0.68rem] font-extrabold tracking-[0.08em] text-[var(--brand)] uppercase">
              {activeFieldLabel}
            </span>
            <h2
              className="m-0 text-[clamp(1.35rem,4vw,1.85rem)] font-bold leading-none tracking-[-0.04em] font-sans"
              id="currency-modal-title"
            >
              Select network and currency
            </h2>
          </div>
          <button
            className="h-[38px] w-[38px] flex-none rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] text-[1.35rem] leading-none text-[var(--ink)] transition-[background,transform] duration-200 hover:-translate-y-px hover:bg-[#eef7f5] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[rgba(15,118,110,0.22)]"
            type="button"
            aria-label="Close currency selector"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div
          className="mb-[18px] flex gap-2 overflow-x-auto px-0.5 pt-0.5 pb-2 [scrollbar-width:thin]"
          role="tablist"
          aria-label="Networks"
        >
          {networks.map((network) => (
            <button
              className="flex-none rounded-full border border-[var(--line)] bg-[var(--surface-soft)] px-3.5 py-2.5 text-[0.76rem] font-extrabold text-[var(--muted)] transition-[border-color,background,color,transform] duration-200 hover:border-[rgba(15,118,110,0.32)] hover:bg-[#eef7f5] hover:text-[var(--ink)] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[rgba(15,118,110,0.22)] active:translate-y-px aria-selected:border-[rgba(15,118,110,0.58)] aria-selected:bg-[linear-gradient(135deg,var(--brand),var(--brand-dark))] aria-selected:text-white aria-selected:shadow-[0_10px_22px_rgba(15,118,110,0.18)]"
              type="button"
              role="tab"
              key={network}
              aria-selected={network === selectedNetwork}
              onClick={() => onNetworkChange(network)}
            >
              {network}
            </button>
          ))}
        </div>

        <label
          className="mb-[18px] flex flex-col gap-2 text-[0.76rem] font-bold tracking-[0.02em] text-[var(--muted)]"
          htmlFor="currency-search"
        >
          <span>Search</span>
          <input
            className="w-full rounded-xl border border-[var(--line)] bg-[#fbfcfd] px-[15px] py-3.5 text-[0.9rem] font-bold tracking-normal text-[var(--ink)] transition-[border-color,background] duration-200 focus:border-[rgba(15,118,110,0.54)] focus:bg-white focus:outline-0"
            id="currency-search"
            type="search"
            placeholder={`Search ${selectedNetwork} currencies`}
            value={query}
            autoFocus
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </label>

        <div
          className="flex flex-col gap-2.5 overflow-auto pr-1"
          role="listbox"
          aria-label="Available currencies"
        >
          {currencies.length > 0 ? (
            currencies.map((currency) => (
              <button
                className="flex w-full items-center gap-[13px] rounded-[14px] border border-[var(--line)] bg-white p-[13px] text-left text-[var(--ink)] transition-[border-color,background,transform,box-shadow] duration-150 hover:-translate-y-px hover:border-[rgba(15,118,110,0.34)] hover:bg-[#f5fbfa] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[rgba(15,118,110,0.22)] aria-selected:border-[rgba(15,118,110,0.58)] aria-selected:bg-[#eef7f5] aria-selected:shadow-[inset_0_0_0_1px_rgba(15,118,110,0.14),0_10px_22px_rgba(15,118,110,0.1)] max-[780px]:items-start"
                type="button"
                role="option"
                key={`${currency.id}-${selectedNetwork}`}
                aria-selected={
                  currency.id === selectedCurrencyId && selectedNetwork === selectedCurrencyNetwork
                }
                onClick={() => onSelect(currency)}
              >
                <currency.icon
                  className="h-[38px] w-[38px] flex-none rounded-full"
                  aria-hidden="true"
                  focusable="false"
                />
                <span className="flex min-w-0 flex-auto flex-col gap-[3px]">
                  <strong className="text-[0.86rem]">{currency.symbol}</strong>
                  <small className="text-[0.72rem] text-[var(--muted)]">{currency.name}</small>
                </span>
                <em className="flex-none rounded-full bg-[var(--surface-soft)] px-[9px] py-[7px] text-[0.68rem] font-bold not-italic text-[var(--muted)] max-[780px]:hidden">
                  {selectedNetwork}
                </em>
              </button>
            ))
          ) : (
            <p className="mt-2.5 mb-0 rounded-[14px] border border-dashed border-[var(--line)] p-[18px] text-center text-[0.82rem] text-[var(--muted)]">
              No {selectedNetwork} currency matched your search.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
