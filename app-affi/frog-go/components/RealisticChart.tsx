"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface CandleData {
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    isProjection?: boolean;
}

interface RealisticChartProps {
    trend: 'bullish' | 'bearish' | 'neutral';
    projection: {
        direction: 'up' | 'down' | 'sideways';
        percentage: number;
    };
    support?: number;
    resistance?: number;
}

export default function RealisticChart({ trend, projection, support, resistance }: RealisticChartProps) {
    const [visibleCandles, setVisibleCandles] = useState(0);
    const [currentCandleProgress, setCurrentCandleProgress] = useState(0);

    // Generate realistic PROJECTION ONLY data
    const candleData = useMemo(() => {
        const candles: CandleData[] = [];
        let basePrice = 100;
        const volatility = 0.015;

        // Projection candles (30 candles for a full view)
        const projectionDirection = projection.direction === 'up' ? 1 : projection.direction === 'down' ? -1 : 0;
        const projectionMagnitude = (projection.percentage / 100) / 30;

        for (let i = 0; i < 30; i++) {
            const trendBias = projectionDirection * projectionMagnitude;
            const noise = (Math.random() - 0.5) * volatility * 0.8;
            const change = trendBias + noise;

            const open = basePrice;
            const close = basePrice * (1 + change);
            const high = Math.max(open, close) * (1 + Math.random() * volatility * 0.5);
            const low = Math.min(open, close) * (1 - Math.random() * volatility * 0.5);
            const volume = 40 + Math.random() * 60;

            candles.push({ open, high, low, close, volume, isProjection: true });
            basePrice = close;
        }

        return candles;
    }, [trend, projection]);

    // Progressive candle reveal animation
    useEffect(() => {
        const totalCandles = candleData.length;
        let currentIndex = 0;

        const interval = setInterval(() => {
            if (currentIndex < totalCandles) {
                setVisibleCandles(currentIndex + 1);
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 80); // Faster animation

        return () => clearInterval(interval);
    }, [candleData]);

    // Current candle "forming" animation
    useEffect(() => {
        if (visibleCandles === candleData.length) {
            const interval = setInterval(() => {
                setCurrentCandleProgress(prev => (prev + 0.1) % 1);
            }, 100);
            return () => clearInterval(interval);
        }
    }, [visibleCandles, candleData.length]);

    // Calculate chart bounds
    const prices = candleData.flatMap(c => [c.high, c.low]);
    const minPrice = Math.min(...prices) * 0.995;
    const maxPrice = Math.max(...prices) * 1.005;
    const priceRange = maxPrice - minPrice;

    const chartWidth = 400;
    const chartHeight = 200;
    const candleWidth = chartWidth / (candleData.length + 2);
    const wickWidth = 1.5;

    const priceToY = (price: number) => {
        return chartHeight - ((price - minPrice) / priceRange) * chartHeight;
    };

    // Colors
    const bullishColor = "#00FF88";
    const bearishColor = "#FF3366";

    return (
        <div className="w-full bg-gradient-to-b from-[#0d0d0d] to-[#131722] rounded-lg p-4 border border-white/5">
            {/* Chart Header */}
            <div className="flex justify-between items-center mb-3 px-2">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3 text-frog-cyan animate-pulse" />
                    <span className="text-xs text-frog-cyan font-bold font-mono">AI PROJECTION</span>
                </div>
                <div className="text-right">
                    <span className={`text-sm font-bold font-mono ${trend === 'bullish' ? 'text-[#00FF88]' : trend === 'bearish' ? 'text-[#FF3366]' : 'text-gray-300'}`}>
                        Target: {trend === 'bullish' ? '+' : trend === 'bearish' ? '-' : ''} {projection.percentage}%
                    </span>
                </div>
            </div>

            {/* Main Chart */}
            <svg
                width="100%"
                viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`}
                preserveAspectRatio="xMidYMid meet"
                className="overflow-visible"
            >
                {/* Grid Lines */}
                {[0.25, 0.5, 0.75].map(pct => (
                    <line
                        key={pct}
                        x1={0}
                        y1={chartHeight * pct}
                        x2={chartWidth}
                        y2={chartHeight * pct}
                        stroke="rgba(255,255,255,0.04)"
                        strokeWidth="1"
                    />
                ))}

                {/* Vertical time grid */}
                {[0.25, 0.5, 0.75].map(pct => (
                    <line
                        key={`v-${pct}`}
                        x1={chartWidth * pct}
                        y1={0}
                        x2={chartWidth * pct}
                        y2={chartHeight}
                        stroke="rgba(255,255,255,0.04)"
                        strokeWidth="1"
                    />
                ))}

                {/* Candlesticks */}
                {candleData.slice(0, visibleCandles).map((candle, index) => {
                    const x = (index + 1) * candleWidth;
                    const isBullish = candle.close >= candle.open;
                    const isLiveCandle = index === visibleCandles - 1 && visibleCandles < candleData.length;

                    // For live candle, animate the close price
                    let displayClose = candle.close;
                    if (isLiveCandle) {
                        const progress = (Date.now() % 1000) / 1000;
                        displayClose = candle.open + (candle.close - candle.open) * Math.min(progress * 2, 1);
                    }

                    const bodyTop = Math.min(candle.open, displayClose);
                    const bodyBottom = Math.max(candle.open, displayClose);
                    const bodyHeight = Math.max((bodyBottom - bodyTop) / priceRange * chartHeight, 1);

                    const baseColor = isBullish ? bullishColor : bearishColor;

                    return (
                        <motion.g
                            key={index}
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            style={{ transformOrigin: `${x}px ${priceToY((candle.high + candle.low) / 2)}px` }}
                        >
                            {/* Wick */}
                            <line
                                x1={x}
                                y1={priceToY(candle.high)}
                                x2={x}
                                y2={priceToY(candle.low)}
                                stroke={baseColor}
                                strokeWidth={wickWidth}
                                opacity={0.8}
                            />

                            {/* Body */}
                            <rect
                                x={x - candleWidth * 0.35}
                                y={priceToY(Math.max(candle.open, displayClose))}
                                width={candleWidth * 0.7}
                                height={bodyHeight}
                                fill={baseColor}
                                stroke={baseColor}
                                strokeWidth={0.5}
                                rx={1}
                                opacity={0.9}
                            />
                        </motion.g>
                    );
                })}

                {/* Volume Bars (subtle) */}
                {candleData.slice(0, visibleCandles).map((candle, index) => {
                    const x = (index + 1) * candleWidth;
                    const isBullish = candle.close >= candle.open;
                    const volumeHeight = (candle.volume / 100) * 20;

                    return (
                        <motion.rect
                            key={`vol-${index}`}
                            x={x - candleWidth * 0.3}
                            y={chartHeight + 5}
                            width={candleWidth * 0.6}
                            height={volumeHeight}
                            fill={isBullish ? bullishColor : bearishColor}
                            opacity={0.3}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: index * 0.02 }}
                            style={{ transformOrigin: `${x}px ${chartHeight + 25}px` }}
                        />
                    );
                })}
            </svg>
        </div>
    );
}
