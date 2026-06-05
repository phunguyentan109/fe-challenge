import type { ComponentType, SVGProps } from 'react';

export type BackgroundIcon = {
  Component: ComponentType<SVGProps<SVGSVGElement>>;
  className: string;
  label: string;
};

export type CurrencySelection = {
  id: string;
  symbol: string;
  name: string;
  network: string[];
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};
