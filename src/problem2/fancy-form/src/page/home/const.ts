import BnbIcon from '@/components/icons/bnb-line.svg?react';
import BitcoinIcon from '@/components/icons/btc-line.svg?react';
import EthereumIcon from '@/components/icons/eth-line.svg?react';
import XrpIcon from '@/components/icons/xrp-line.svg?react';
import BnbCoinIcon from '@/components/icons/coins/bnb.svg?react';
import EthCoinIcon from '@/components/icons/coins/eth.svg?react';
import PolygonCoinIcon from '@/components/icons/coins/pol.svg?react';
import SolCoinIcon from '@/components/icons/coins/sol.svg?react';
import UsdcCoinIcon from '@/components/icons/coins/usdc.svg?react';
import UsdtCoinIcon from '@/components/icons/coins/usdt.svg?react';
import BUsdIcon from '@/components/icons/coins/busd.svg?react';
import DogeIcon from '@/components/icons/coins/doge.svg?react';
import JupIcon from '@/components/icons/coins/jup.svg?react';
import UsualIcon from '@/components/icons/coins/usual.svg?react';
import type { BackgroundIcon, CurrencySelection } from '@/page/home/type';

export const currencies: CurrencySelection[] = [
  {
    id: 'binance-peg-dogecoin',
    symbol: 'DOGE',
    name: 'Binance-Peg Dogecoin',
    network: ['BNB Chain'],
    icon: DogeIcon,
  },
  { id: 'jupiter', symbol: 'JUP', name: 'Jupiter', network: ['Solana'], icon: JupIcon },
  { id: 'usual', symbol: 'USUAL', name: 'Usual', network: ['Ethereum'], icon: UsualIcon },
  { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', network: ['Ethereum'], icon: EthCoinIcon },
  {
    id: 'usd-coin',
    symbol: 'USDC',
    name: 'USD Coin',
    network: ['Ethereum', 'Polygon'],
    icon: UsdcCoinIcon,
  },
  {
    id: 'tether',
    symbol: 'USDT',
    name: 'Tether USD',
    network: ['BNB Chain', 'Ethereum'],
    icon: UsdtCoinIcon,
  },
  {
    id: 'polygon-ecosystem-token',
    symbol: 'MATIC',
    name: 'Polygon',
    network: ['Polygon'],
    icon: PolygonCoinIcon,
  },
  { id: 'binancecoin', symbol: 'BNB', name: 'BNB', network: ['BNB Chain'], icon: BnbCoinIcon },
  {
    id: 'binance-usd',
    symbol: 'BUSD',
    name: 'Binance USD',
    network: ['BNB Chain'],
    icon: BUsdIcon,
  },
  { id: 'solana', symbol: 'SOL', name: 'Solana', network: ['Solana'], icon: SolCoinIcon },
];

export const backgroundIcons: BackgroundIcon[] = [
  { Component: BitcoinIcon, className: 'page-bg-icon page-bg-icon--btc', label: 'Bitcoin' },
  { Component: EthereumIcon, className: 'page-bg-icon page-bg-icon--eth', label: 'Ethereum' },
  { Component: BnbIcon, className: 'page-bg-icon page-bg-icon--bnb', label: 'BNB' },
  { Component: XrpIcon, className: 'page-bg-icon page-bg-icon--xrp', label: 'XRP' },
];
