import React, { useState, useId } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface SparklinePoint {
  timeLabel: string;
  rate: number;
  high?: number;
  low?: number;
}

interface Sparkline7DProps {
  points: SparklinePoint[];
  currencyCode: string;
  baseCode: string;
  className?: string;
  compact?: boolean;
}

export const Sparkline7D: React.FC<Sparkline7DProps> = ({
  points,
  currencyCode,
  baseCode,
  className = '',
  compact = false
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const gradientId = useId();

  if (!points || points.length < 2) {
    return <div className="text-xs text-slate-400">No trend data</div>;
  }

  const rates = points.map((p) => p.rate);
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  const range = maxRate - minRate || maxRate * 0.01 || 1;

  const firstRate = points[0].rate;
  const lastRate = points[points.length - 1].rate;
  const change7d = firstRate > 0 ? ((lastRate - firstRate) / firstRate) * 100 : 0;
  const isPositive = change7d >= 0;

  const width = compact ? 100 : 130;
  const height = compact ? 28 : 36;
  const paddingX = 4;
  const paddingTop = 4;
  const paddingBottom = 4;

  const availableWidth = width - paddingX * 2;
  const availableHeight = height - paddingTop - paddingBottom;

  // Calculate coordinates for SVG path
  const coords = points.map((p, idx) => {
    const x = paddingX + (idx / (points.length - 1)) * availableWidth;
    const y = paddingTop + availableHeight - ((p.rate - minRate) / range) * availableHeight;
    return { x, y, point: p };
  });

  const linePath = coords.reduce((acc, curr, idx) => {
    return idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Fill area closing down to bottom
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${height} L ${coords[0].x} ${height} Z`;

  const strokeColor = isPositive ? '#10b981' : '#f43f5e';
  const fillColor = isPositive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)';

  const activePoint = hoveredIdx !== null ? coords[hoveredIdx] : null;

  return (
    <div className={`relative flex items-center gap-3 ${className}`}>
      {/* SVG Chart */}
      <div className="relative group">
        <svg
          width={width}
          height={height}
          className="overflow-visible cursor-crosshair"
          onMouseLeave={() => setHoveredIdx(null)}
        >
          <defs>
            <linearGradient id={`grad-${gradientId}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity="0.25" />
              <stop offset="100%" stopColor={isPositive ? '#10b981' : '#f43f5e'} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Fill */}
          <path d={areaPath} fill={`url(#grad-${gradientId})`} />

          {/* Sparkline Stroke */}
          <path
            d={linePath}
            fill="none"
            stroke={strokeColor}
            strokeWidth={compact ? '1.75' : '2'}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Start Point Dot */}
          <circle
            cx={coords[0].x}
            cy={coords[0].y}
            r="2"
            fill={strokeColor}
            className="opacity-70"
          />

          {/* End Point Dot */}
          <circle
            cx={coords[coords.length - 1].x}
            cy={coords[coords.length - 1].y}
            r="2.5"
            fill={strokeColor}
          />

          {/* Hover Target Overlay Columns */}
          {coords.map((c, idx) => (
            <rect
              key={idx}
              x={c.x - availableWidth / (points.length * 2)}
              y={0}
              width={availableWidth / points.length}
              height={height}
              fill="transparent"
              onMouseEnter={() => setHoveredIdx(idx)}
              className="cursor-pointer"
            />
          ))}

          {/* Active Hover Dot & Guideline */}
          {activePoint && (
            <g>
              <line
                x1={activePoint.x}
                y1={0}
                x2={activePoint.x}
                y2={height}
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="2 2"
                className="opacity-50"
              />
              <circle
                cx={activePoint.x}
                cy={activePoint.y}
                r="3.5"
                fill={strokeColor}
                stroke="#ffffff"
                strokeWidth="1.5"
              />
            </g>
          )}
        </svg>

        {/* Hover Tooltip */}
        {activePoint && (
          <div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 z-20 px-2 py-1 bg-slate-900 text-white rounded-md text-[10px] font-mono whitespace-nowrap shadow-lg pointer-events-none animate-in fade-in zoom-in-95 duration-100"
          >
            <div className="font-bold text-slate-200">
              {activePoint.point.timeLabel}:{' '}
              <span className="text-white">
                {activePoint.point.rate < 0.01 ? activePoint.point.rate.toFixed(6) : activePoint.point.rate.toFixed(4)}
              </span>
            </div>
            <div className="text-[9px] text-slate-400">
              1 {baseCode} = {activePoint.point.rate < 0.01 ? activePoint.point.rate.toFixed(5) : activePoint.point.rate.toFixed(4)} {currencyCode}
            </div>
          </div>
        )}
      </div>

      {/* 7-Day Change Pill / Stats */}
      <div className="flex flex-col items-start min-w-[62px]">
        <span
          className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-extrabold ${
            isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
          }`}
          title={`7-day net movement: ${change7d > 0 ? '+' : ''}${change7d.toFixed(2)}%`}
        >
          {isPositive ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
          <span>{isPositive ? '+' : ''}{change7d.toFixed(2)}%</span>
        </span>
        <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider pl-0.5">
          7d trend
        </span>
      </div>
    </div>
  );
};
