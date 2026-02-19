"use client";

import { useState, useEffect, useMemo } from "react";
import { TrendingUp, TrendingDown, Minus, X, Sparkles } from "lucide-react";
import { useTranslation } from "@/lib/i18n";

interface PredictionModalProps {
    trend: 'bullish' | 'bearish' | 'neutral';
    projection: {
        direction: 'up' | 'down' | 'sideways';
        percentage: number;
    };
    narrative?: string;
    support: number;
    resistance: number;
    isOpen: boolean;
    onClose: () => void;
}

interface Candle {
    open: number;
    high: number;
    low: number;
    close: number;
    isPrediction?: boolean;
}

export default function PredictionModal({ trend, projection, narrative, support, resistance, isOpen, onClose }: PredictionModalProps) {
    const [visibleCandles, setVisibleCandles] = useState(0);
    const [showPrediction, setShowPrediction] = useState(false);
    const { t } = useTranslation();

    const historicalCandlesCount = 30; // Doubled from 15
    const predictionCandlesCount = 20; // Doubled from 10
    const totalCandles = historicalCandlesCount + predictionCandlesCount;

    const chartWidth = 800;
    const chartHeight = 400;

    const seededRandom = (seed: number) => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    const { candles, minPrice, maxPrice } = useMemo(() => {
        const allCandles: Candle[] = [];
        let basePrice = 100;
        const volatility = 0.012;
        let seed = (support || 0) + (resistance || 0) + projection.percentage;

        // 1. Generate Historical Data (Context)
        // More noise, less directional bias
        for (let i = 0; i < historicalCandlesCount; i++) {
            const noise = (seededRandom(seed + i) - 0.5) * volatility * 1.5;
            const change = noise; // Random walk

            const open = basePrice;
            const close = basePrice * (1 + change);
            const high = Math.max(open, close) * (1 + seededRandom(seed + i + 100) * volatility * 0.5);
            const low = Math.min(open, close) * (1 - seededRandom(seed + i + 200) * volatility * 0.5);

            allCandles.push({ open, high, low, close, isPrediction: false });
            basePrice = close;
        }

        // 2. Generate Prediction Data (Future)
        // Stronger directional bias based on AI prediction
        const direction = projection.direction === 'up' ? 1 : projection.direction === 'down' ? -1 : 0;
        const targetChange = (projection.percentage / 100);
        // Distribute the target change across prediction candles
        const stepChange = targetChange / predictionCandlesCount;

        for (let i = 0; i < predictionCandlesCount; i++) {
            const stepBias = stepChange * 1.2; // Slightly clearer trend
            const noise = (seededRandom(seed + i + 500) - 0.5) * volatility;
            const change = stepBias + noise;

            const open = basePrice;
            const close = basePrice * (1 + change);
            const high = Math.max(open, close) * (1 + seededRandom(seed + i + 600) * volatility * 0.5);
            const low = Math.min(open, close) * (1 - seededRandom(seed + i + 700) * volatility * 0.5);

            allCandles.push({ open, high, low, close, isPrediction: true });
            basePrice = close;
        }

        const prices = allCandles.flatMap(c => [c.high, c.low]);
        const min = Math.min(...prices) * 0.995;
        const max = Math.max(...prices) * 1.005;

        return { candles: allCandles, minPrice: min, maxPrice: max };
    }, [projection, support, resistance]);

    useEffect(() => {
        if (!isOpen) {
            setVisibleCandles(0);
            setShowPrediction(false);
            return;
        }

        // Animate historical candles first
        const interval = setInterval(() => {
            setVisibleCandles(prev => {
                if (prev < historicalCandlesCount) return prev + 1;

                clearInterval(interval);
                // Start showing prediction candles after historical are done
                setTimeout(() => setShowPrediction(true), 300);
                return prev;
            });
        }, 30);

        return () => clearInterval(interval);
    }, [isOpen]);

    // Separate effect for prediction candles animation
    useEffect(() => {
        if (!showPrediction) return;

        const interval = setInterval(() => {
            setVisibleCandles(prev => {
                if (prev < totalCandles) return prev + 1;
                clearInterval(interval);
                return prev;
            });
        }, 50); // Faster animation for prediction

        return () => clearInterval(interval);
    }, [showPrediction]);

    const priceRange = maxPrice - minPrice;
    const candleWidth = chartWidth / (totalCandles + 2);
    const priceToY = (price: number) => chartHeight - ((price - minPrice) / priceRange) * chartHeight;

    const bullColor = "#22c55e";
    const bearColor = "#ef4444";
    const predictionBullColor = "#00F5FF"; // Cyan for prediction up
    const predictionBearColor = "#FF0055"; // Pink/Red for prediction down

    const TrendIcon = projection.direction === 'up' ? TrendingUp : projection.direction === 'down' ? TrendingDown : Minus;

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-[#0d0d0d] border border-white/10 rounded-xl p-4 max-w-3xl w-full animate-fade-in"
                onClick={e => e.stopPropagation()}
                style={{ animation: 'slideUp 0.3s ease-out' }}
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-frog-cyan" />
                        <h2 className="text-lg font-bold text-white">{t.prediction.title}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Narrative Insight */}
                {narrative && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-frog-green/10 to-frog-cyan/10 border-l-2 border-frog-green rounded-r-lg">
                        <p className="text-xs font-bold text-frog-green uppercase tracking-wider mb-1 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> {t.prediction.exclusiveInsight}
                        </p>
                        <p className="text-sm text-gray-200 italic leading-relaxed">
                            "{narrative}"
                        </p>
                    </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-lg">
                    <div className={`p-2 rounded-lg ${projection.direction === 'up' ? 'bg-green-500/20' : projection.direction === 'down' ? 'bg-red-500/20' : 'bg-gray-500/20'}`}>
                        <TrendIcon className={`w-6 h-6 ${projection.direction === 'up' ? 'text-green-400' : projection.direction === 'down' ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400">{t.prediction.targetMovement}</p>
                        <p className={`text-2xl font-bold font-mono ${projection.direction === 'up' ? 'text-green-400' : projection.direction === 'down' ? 'text-red-400' : 'text-gray-400'}`}>
                            {projection.direction === 'up' ? '+' : projection.direction === 'down' ? '-' : ''}{projection.percentage}%
                        </p>
                    </div>
                    <div className="ml-auto text-right">
                        <p className="text-xs text-gray-500">{t.prediction.trend}</p>
                        <p className={`text-sm font-bold uppercase ${trend === 'bullish' ? 'text-green-400' : trend === 'bearish' ? 'text-red-400' : 'text-gray-400'}`}>
                            {trend}
                        </p>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-[#131722] rounded-lg p-2 border border-white/5 relative overflow-hidden">
                    {/* Prediction Zone Background - Highlighted */}
                    {showPrediction && (
                        <div
                            className={`absolute top-0 bottom-0 right-0 pointer-events-none transition-opacity duration-1000 ${projection.direction === 'up' ? 'bg-green-500/10' : projection.direction === 'down' ? 'bg-red-500/10' : 'bg-blue-500/10'}`}
                            style={{
                                left: `${(historicalCandlesCount + 1) * candleWidth}px`,
                                borderLeft: `2px dashed ${projection.direction === 'up' ? '#22c55e' : projection.direction === 'down' ? '#ef4444' : '#3b82f6'}`,
                                animation: 'fadeIn 0.5s ease-out'
                            }}
                        >
                            <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 rounded text-[10px] font-bold tracking-widest uppercase text-white/70">
                                AI ZONE
                            </div>
                        </div>
                    )}

                    <svg
                        width="100%"
                        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                        preserveAspectRatio="xMidYMid meet"
                        className="relative z-10"
                    >
                        {/* Data Candles */}
                        {candles.slice(0, visibleCandles).map((candle, i) => {
                            const x = (i + 1) * candleWidth;
                            const isBullish = candle.close >= candle.open;

                            // Different colors for prediction candles
                            let color = isBullish ? bullColor : bearColor;
                            let opacity = 1;

                            if (candle.isPrediction) {
                                color = isBullish ? predictionBullColor : predictionBearColor;
                                opacity = 0.8; // Ghost effect
                            }

                            const bodyTop = priceToY(Math.max(candle.open, candle.close));
                            const bodyBottom = priceToY(Math.min(candle.open, candle.close));
                            const bodyHeight = Math.max(bodyBottom - bodyTop, 2);

                            return (
                                <g
                                    key={i}
                                    style={{
                                        opacity: opacity,
                                        transform: `scaleY(1)`,
                                        transformOrigin: `${x}px ${chartHeight}px`,
                                        animation: `fadeIn 0.2s ease-out`
                                    }}
                                >
                                    {/* Wick */}
                                    <line
                                        x1={x}
                                        y1={priceToY(candle.high)}
                                        x2={x}
                                        y2={priceToY(candle.low)}
                                        stroke={color}
                                        strokeWidth={candle.isPrediction ? "1" : "1.5"}
                                        strokeDasharray={candle.isPrediction ? "2,2" : ""}
                                    />
                                    {/* Body */}
                                    <rect
                                        x={x - candleWidth * 0.35}
                                        y={bodyTop}
                                        width={candleWidth * 0.7}
                                        height={bodyHeight}
                                        fill={candle.isPrediction ? "transparent" : color}
                                        stroke={color}
                                        strokeWidth={candle.isPrediction ? "1.5" : "0"}
                                        rx={1}
                                    />
                                </g>
                            );
                        })}

                        {/* HISTORY Label */}
                        <text
                            x={10}
                            y={20}
                            fill="#666"
                            fontSize="10"
                            fontWeight="bold"
                            style={{ opacity: 0.5 }}
                        >
                            {t.prediction.history}
                        </text>

                        {/* Divider Line between History and Prediction */}
                        {visibleCandles >= historicalCandlesCount && (
                            <g>
                                <line
                                    x1={(historicalCandlesCount + 0.5) * candleWidth}
                                    y1={0}
                                    x2={(historicalCandlesCount + 0.5) * candleWidth}
                                    y2={chartHeight}
                                    stroke="rgba(255,255,255,0.2)"
                                    strokeDasharray="4,4"
                                />
                                {/* LIVE Label on Divider */}
                                <rect
                                    x={(historicalCandlesCount + 0.5) * candleWidth - 14}
                                    y={chartHeight - 16}
                                    width="28"
                                    height="12"
                                    rx="2"
                                    fill="#FFFFFF"
                                    opacity="0.1"
                                />
                                <text
                                    x={(historicalCandlesCount + 0.5) * candleWidth}
                                    y={chartHeight - 8}
                                    fill="#AAA"
                                    fontSize="8"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    {t.prediction.now}
                                </text>
                            </g>
                        )}

                        {/* Prediction Label */}
                        {showPrediction && (
                            <g style={{ animation: 'fadeIn 0.5s ease-out' }}>
                                <text
                                    x={(historicalCandlesCount + 1.5) * candleWidth}
                                    y={20}
                                    fill={projection.direction === 'up' ? predictionBullColor : predictionBearColor}
                                    fontSize="10"
                                    fontWeight="bold"
                                >
                                    {t.prediction.aiForecast}
                                </text>

                                {/* Target Price Tag at end of chart */}
                                <rect
                                    x={chartWidth - 45}
                                    y={priceToY(candles[candles.length - 1].close) - 10}
                                    width="40"
                                    height="20"
                                    rx="4"
                                    fill={projection.direction === 'up' ? predictionBullColor : predictionBearColor}
                                />
                                <text
                                    x={chartWidth - 25}
                                    y={priceToY(candles[candles.length - 1].close) + 4}
                                    fill="#000"
                                    fontSize="10"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                >
                                    {t.prediction.target}
                                </text>
                            </g>
                        )}
                    </svg>
                </div>

                {/* Footer */}
                <div className="mt-3 flex justify-between text-xs text-gray-500">
                    <span>S: ${support?.toLocaleString() || 'N/A'}</span>
                    <span className="text-frog-cyan">{t.prediction.aiModel}</span>
                    <span>R: ${resistance?.toLocaleString() || 'N/A'}</span>
                </div>
            </div>
        </div>
    );
}
