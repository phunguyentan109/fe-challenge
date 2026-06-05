import { useEffect, useRef } from 'react';
import { AreaSeries, ColorType, createChart } from 'lightweight-charts';
import type { ExchangeRateHistoryPoint } from '@/redux/endpoints/coingecko.ts';

type ExchangeRateChartProps = {
  data: ExchangeRateHistoryPoint[];
};

export function ExchangeRateChart({ data }: ExchangeRateChartProps) {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current || data.length === 0) {
      return;
    }

    const chart = createChart(chartContainerRef.current, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#52606d',
      },
      grid: {
        horzLines: { color: 'rgba(82,96,109,0.12)' },
        vertLines: { color: 'rgba(82,96,109,0.08)' },
      },
      rightPriceScale: {
        borderColor: 'rgba(82,96,109,0.16)',
      },
      timeScale: {
        borderColor: 'rgba(82,96,109,0.16)',
        fixLeftEdge: true,
        fixRightEdge: true,
      },
    });

    const series = chart.addSeries(AreaSeries, {
      lineColor: '#0f766e',
      topColor: 'rgba(15,118,110,0.32)',
      bottomColor: 'rgba(15,118,110,0.02)',
      lineWidth: 3,
      priceFormat: {
        type: 'custom',
        minMove: 0.01,
        formatter: (price: number) => parseFloat(price.toFixed(4)),
      },
    });

    series.setData(data);
    chart.timeScale().fitContent();

    return () => {
      chart.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef} className="h-[240px] w-full max-[780px]:h-[190px]" />;
}
