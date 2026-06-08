# Improvements made on the restored version

- During runtime, the `formattedBalances` is no longer unnecessarily re-sorted and re-calculated when `balances` array is recreated with no value change, only 2 loops run instead of 4.
  - `balanceStringify` is forming for purpose of amount, currency and blockchain change determining and preserving

- The sort loop stays at the fixed O(4) time complexity.

- `getPriority` get run only once for each currency in `formattedBalances` computation.

- Type is strictly defined, no any type is used.
