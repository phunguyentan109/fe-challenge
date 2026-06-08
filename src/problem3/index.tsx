import React, { useMemo, PropsWithChildren } from 'react';
import { createRoot } from 'react-dom/client';

interface WalletBalance {
	currency: string;
	amount: number;
	blockchain: 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';
}

interface FormattedWalletBalance extends WalletBalance {
	formatted: string;
}

interface Props extends PropsWithChildren {}

const App: React.FC<Props> = (props: Props) => {
	const { children, ...rest } = props;
	const balances = useWalletBalances() as WalletBalance[];
	const prices = usePrices();

	const balanceStringify = balances.reduce((acc: string, n) => {
		acc += `-${n.currency}-${n.amount}-${n.blockchain}`;

		return acc;
	}, '');

	const getPriority = (blockchain: WalletBalance['blockchain']): number => {
		switch (blockchain) {
			case 'Osmosis':
				return 100;
			case 'Ethereum':
				return 50;
			case 'Arbitrum':
				return 30;
			case 'Zilliqa':
				return 20;
			case 'Neo':
				return 20;
			default:
				return -99;
		}
	};

	const formattedBalances = useMemo(() => {
		const balancesByPriority = balances.reduce<
			Record<number, FormattedWalletBalance[]>
		>((acc, balance: WalletBalance) => {
			const balancePriority = getPriority(balance.blockchain);

			if (balancePriority > -99 && balance.amount > 0) {
				if (!acc[balancePriority]) acc[balancePriority] = [];

				acc[balancePriority].push({
					...balance,
					formatted: balance.amount.toFixed(),
				});
			}

			return acc;
		}, {});

		return [100, 50, 30, 20].reduce<FormattedWalletBalance[]>(
			(acc, priority) => acc.concat(balancesByPriority[priority] ?? []),
			[]
		);
	}, [balanceStringify]);

	const rows = formattedBalances.map(
		(balance: FormattedWalletBalance, index: number) => {
			// currency price changes over time, so it's best to avoid memorizing the usdValue in the useMemo above
			const usdValue = prices[balance.currency] * balance.amount;
			return (
				<WalletRow
					className={classes.row}
					key={`${balance.currency}-${balance.blockchain}`}
					amount={balance.amount}
					usdValue={usdValue}
					formattedAmount={balance.formatted}
				/>
			);
		}
	);

	return <div {...rest}>{rows}</div>;
};

const container = document.getElementById('app');
const root = createRoot(container);

root.render(<App />);
