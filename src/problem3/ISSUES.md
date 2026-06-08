### Problem 3 Issues

## Issues
Some issues found in the provided code are listed below:
1. `prices` is included in the dependency array of `useMemo` hook but never used in the function body, this leads to unnecessary re-computation of `sortedBalances` when `prices` changes
   - **Solution**: this should be removed from the dependency array.
2. `balances` included in `useMemo` dependencies is not primitive values (implied from `balances.filter`) as well which leads to the same uneccessary re-computation of `sortedBalances` when `balances` is re-created with same property values. Same issue for `prices` but as mentioned above, it should be removed.
   - **Solution**: should include the primitive idenifier value of `balances` in the dependency array. 
3. `balance.blockchain` is not defined in `WalletBalance` type.
4. Under filter loop callback, `lhsPriority` is not defined, instead it should be `balancePriority`.
   - **Solution**: `lhsPriority` should be `balancePriority` as it is used in the comparison.
5. `sortedBalances` is the sorted filtered list of 0 value balances which is incorrect in business logic.
   - **Solution**: It should be the list of balances with amount greater than 0 in value.

```typescript jsx
const prices = usePrices();

const sortedBalances = useMemo(() => {
	return balances
        .filter((balance: WalletBalance) => {
            const balancePriority = getPriority(balance.blockchain);
            if (lhsPriority > -99) {
                if (balance.amount <= 0) {
                    return true;
                }
            }
            return false;
        })
        .sort((lhs: WalletBalance, rhs: WalletBalance) => {
            const leftPriority = getPriority(lhs.blockchain);
            const rightPriority = getPriority(rhs.blockchain);
            if (leftPriority > rightPriority) {
                return -1;
            } else if (rightPriority > leftPriority) {
                return 1;
            }
        });
}, [balances, prices]);
```

3. `formattedBalances` is not being used anywhere in the component.
   - **Solution**: Check the code to see if it should be used in somewhere or remove it.
```typescript jsx
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
})
```

4. `balance.formatted` value is undefined as the `formatted` property is not being added to the `balance` object of `sortedBalances`.
5. `index` as key is bad practice as stated following React guideline as re-rendering of rows might associcate with wrong data when list changes. This should be replaced with identifier field of each `balance` object as the key.
```typescript jsx
 const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
  const usdValue = prices[balance.currency] * balance.amount;
  return (
    <WalletRow
      className={classes.row}
      key={index}
      amount={balance.amount}
      usdValue={usdValue}
      formattedAmount={balance.formatted}
    />
  )
}) 
```

7. type `any` is not a recommended type, and it should be avoided as much as possible.
```typescript jsx
const getPriority = (blockchain: any): number => {
	  switch (blockchain) {
	    case 'Osmosis':
	      return 100
	    case 'Ethereum':
	      return 50
	    case 'Arbitrum':
	      return 30
	    case 'Zilliqa':
	      return 20
	    case 'Neo':
	      return 20
	    default:
	      return -99
	  }
	}
```

8. `BoxProps` looks more like a component prop while `Props` is a type for a page component, if that is the case then it must not be extended from BoxProps since a page component should be the highest level component in the component hierarchy on a page. Moreover, `BoxProps` might require additional props that are not required for a page component. Defining a page `Prop` type from scratch is a better way as now it is clear what props are and has more control over the page component props.
   - `children` prop is required for this component, so this Prop type should be extended from built-in React type `PropWithChildren`.
```typescript jsx
interface Props extends BoxProps {

}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  ....
}
```