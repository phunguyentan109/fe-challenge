export type SubmittedSwap = {
  sendAmount: string;
  receiveAmount: string;
  sendCurrencySymbol: string;
  receiveCurrencySymbol: string;
  sendNetwork: string;
  receiveNetwork: string;
};

type SwapSuccessModalProps = {
  submittedSwap: SubmittedSwap;
  onClose: () => void;
};

export function SwapSuccessModal({ submittedSwap, onClose }: SwapSuccessModalProps) {
  return (
    <div
      className="modal-backdrop fixed inset-0 z-10 flex items-center justify-center bg-[rgba(23,33,43,0.42)] p-6 backdrop-blur-[7px]"
      role="presentation"
      onClick={onClose}
    >
      <section
        className="currency-modal w-[min(100%,460px)] rounded-[18px] border border-[rgba(219,228,236,0.95)] p-[28px] text-[var(--ink)] shadow-[0_26px_70px_rgba(23,33,43,0.2)] max-[780px]:p-[22px]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="swap-success-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-[18px]">
          <div>
            <span className="mb-2 inline-flex text-[0.68rem] font-extrabold tracking-[0.08em] text-[var(--brand)] uppercase">
              Congratulations
            </span>
            <h2
              className="m-0 text-[clamp(1.45rem,4vw,2rem)] leading-none font-bold tracking-[-0.04em] font-sans"
              id="swap-success-title"
            >
              Swap successful
            </h2>
          </div>
          <button
            className="h-[38px] w-[38px] flex-none rounded-xl border border-[var(--line)] bg-[var(--surface-soft)] text-[1.35rem] leading-none text-[var(--ink)] transition-[background,transform] duration-200 hover:-translate-y-px hover:bg-[#eef7f5] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[rgba(15,118,110,0.22)]"
            type="button"
            aria-label="Close success message"
            onClick={onClose}
          >
            x
          </button>
        </div>

        <p className="mt-0 mb-5 text-[0.9rem] leading-[1.6] text-[var(--muted)] [font-family:var(--font-lato)]">
          Your token swap has been completed successfully.
        </p>

        <div className="rounded-[14px] border border-[var(--line)] bg-white p-4">
          <p className="m-0 text-[0.82rem] font-bold text-[var(--muted)]">You send</p>
          <strong className="mt-1 block text-[1.25rem] tracking-[-0.03em]">
            {submittedSwap.sendAmount || '0'} {submittedSwap.sendCurrencySymbol}
          </strong>
          <p className="mt-1 mb-0 text-[0.78rem] text-[var(--muted)]">
            Network: {submittedSwap.sendNetwork}
          </p>
        </div>

        <div
          className="my-3 flex justify-center text-[1.2rem] text-[var(--brand)]"
          aria-hidden="true"
        >
          ↓
        </div>

        <div className="rounded-[14px] border border-[var(--line)] bg-white p-4">
          <p className="m-0 text-[0.82rem] font-bold text-[var(--muted)]">You receive</p>
          <strong className="mt-1 block text-[1.25rem] tracking-[-0.03em]">
            {submittedSwap.receiveAmount || '0'} {submittedSwap.receiveCurrencySymbol}
          </strong>
          <p className="mt-1 mb-0 text-[0.78rem] text-[var(--muted)]">
            Network: {submittedSwap.receiveNetwork}
          </p>
        </div>

        <button
          className="mt-6 inline-flex min-h-[50px] w-full items-center justify-center rounded-xl border-0 bg-[linear-gradient(135deg,var(--brand),var(--brand-dark))] text-[0.82rem] font-extrabold tracking-[0.06em] text-white uppercase transition-[transform,filter] duration-200 hover:-translate-y-0.5 hover:saturate-[1.08] focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[rgba(15,118,110,0.22)] active:translate-y-0"
          type="button"
          onClick={onClose}
        >
          Close
        </button>
      </section>
    </div>
  );
}
