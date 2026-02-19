"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, TrendingUp, Target, AlertCircle, Activity, ArrowUpRight, ArrowDownRight, Zap, Calculator, ChevronRight, ChevronDown, BarChart3, Scan, Shield, Check, X, TrendingDown, Brain, Layers, AlertTriangle, Info, Eye, ListChecks, Clock } from "lucide-react";
import ChartDrawingOverlay from "./ChartDrawingOverlay";
import PredictionModal from "./PredictionModal";
import { useTranslation } from "@/lib/i18n";

interface ChartAnalysisProps {
    result: any;
    uploadedImage: string;
    onNewAnalysis: () => void;
}

// Collapsible Widget Component
function Widget({ title, icon: Icon, children, defaultOpen = true, accentColor = "frog-green" }: any) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const colorClasses: any = {
        "frog-green": "text-frog-green border-frog-green/20",
        "blue": "text-blue-400 border-blue-400/20",
        "red": "text-red-400 border-red-400/20",
        "yellow": "text-yellow-400 border-yellow-400/20",
    };

    return (
        <div className={`bg-white/[0.02] border border-white/5 rounded-xl overflow-hidden hover:border-white/10 transition-colors`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${colorClasses[accentColor]?.split(' ')[0] || 'text-frog-green'}`} />
                    <span className="text-sm font-bold text-white uppercase tracking-wide">{title}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0 border-t border-white/5">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Signal Badge Component
function SignalBadge({ signal, trend, confidence, bullishLabel, bearishLabel, confidenceLabel }: any) {
    const isBullish = trend === 'bullish';
    return (
        <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${isBullish ? 'bg-frog-green/10 border-frog-green/30' : 'bg-red-500/10 border-red-500/30'}`}>
            <div className={`p-2 rounded-lg ${isBullish ? 'bg-frog-green/20' : 'bg-red-500/20'}`}>
                {isBullish ? <TrendingUp className="w-5 h-5 text-frog-green" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
            </div>
            <div>
                <div className={`text-lg font-black ${isBullish ? 'text-frog-green' : 'text-red-400'}`}>
                    {isBullish ? bullishLabel : bearishLabel}
                </div>
                <div className="text-xs text-gray-400">{confidenceLabel}: {confidence}/5</div>
            </div>
        </div>
    );
}

// Level Row Component
function LevelRow({ label, value, type }: { label: string; value: number | string; type: 'entry' | 'stop' | 'target1' | 'target2' }) {
    const styles = {
        entry: 'bg-white/5 border-white/10 text-white',
        stop: 'bg-red-500/10 border-red-500/20 text-red-400',
        target1: 'bg-frog-green/10 border-frog-green/20 text-frog-green',
        target2: 'bg-frog-cyan/10 border-frog-cyan/20 text-frog-cyan',
    };
    const icons = {
        entry: <Target className="w-4 h-4" />,
        stop: <AlertTriangle className="w-4 h-4" />,
        target1: <ArrowUpRight className="w-4 h-4" />,
        target2: <ArrowUpRight className="w-4 h-4" />,
    };

    return (
        <div className={`flex items-center justify-between p-3 rounded-lg border ${styles[type]}`}>
            <div className="flex items-center gap-2">
                {icons[type]}
                <span className="text-xs font-medium uppercase">{label}</span>
            </div>
            <span className="text-sm font-mono font-bold">{typeof value === 'number' ? value.toLocaleString() : value}</span>
        </div>
    );
}

export default function ChartAnalysis({ result, uploadedImage, onNewAnalysis }: ChartAnalysisProps) {
    const [phase, setPhase] = useState<'scanning' | 'analyzed'>('scanning');
    const [showPrediction, setShowPrediction] = useState(false);
    const [scanStep, setScanStep] = useState(0);
    const { t } = useTranslation();

    const scanSteps = [
        { label: t.analysis.scanSteps[0], duration: 600 },
        { label: t.analysis.scanSteps[1], duration: 700 },
        { label: t.analysis.scanSteps[2], duration: 500 },
        { label: t.analysis.scanSteps[3], duration: 600 },
    ];

    useEffect(() => {
        // Progress through scan steps
        let currentStep = 0;
        const stepTimers: NodeJS.Timeout[] = [];

        const processStep = () => {
            if (currentStep < scanSteps.length) {
                setScanStep(currentStep);
                currentStep++;
                stepTimers.push(setTimeout(processStep, scanSteps[currentStep - 1]?.duration || 500));
            } else {
                // All steps done, show results
                stepTimers.push(setTimeout(() => setPhase('analyzed'), 400));
            }
        };

        processStep();

        return () => stepTimers.forEach(t => clearTimeout(t));
    }, []);

    const entryPrice = ((result.support + result.resistance) / 2);

    return (
        <div className="w-full min-h-screen bg-[#050505] text-white font-sans selection:bg-frog-green/30 selection:text-frog-green">
            <AnimatePresence mode="wait">
                {phase === 'scanning' ? (
                    /* --- ENHANCED SCANNING UI (Viewport-Optimized) --- */
                    <motion.div
                        key="scanning"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="flex flex-col items-center justify-center h-screen w-full p-4 overflow-hidden"
                    >
                        {/* Brand at top with PROMINENT FROG */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4 flex flex-col items-center gap-3"
                        >
                            <div className="relative">
                                {/* Glow ring behind */}
                                <div className="absolute inset-0 bg-frog-green/30 blur-2xl rounded-full scale-[2]" />
                                <motion.img
                                    src="/frog-transparent-final.png"
                                    alt="Frog AI"
                                    className="w-20 h-20 object-contain relative z-10 drop-shadow-[0_0_40px_rgba(0,255,157,0.6)]"
                                    style={{ imageRendering: 'pixelated' }}
                                    animate={{ y: [0, -6, 0] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </div>
                            <span className="text-2xl font-black tracking-tighter">
                                FROG<span className="text-frog-green">AI</span>
                            </span>
                        </motion.div>

                        {/* Image Preview with Scan Effect - LARGER */}
                        <div className="relative flex-1 w-full max-w-2xl flex items-center justify-center">
                            <div className="relative rounded-xl overflow-hidden border border-white/10 shadow-2xl shadow-frog-green/10 max-h-[60vh]">
                                {/* The uploaded image */}
                                <img
                                    src={uploadedImage}
                                    alt="Graphique en cours d'analyse"
                                    className="w-full h-full max-h-[60vh] object-contain opacity-90"
                                />

                                {/* Scan line effect */}
                                <motion.div
                                    className="absolute left-0 right-0 h-1 bg-gradient-to-b from-transparent via-frog-green to-transparent shadow-[0_0_20px_rgba(0,255,157,0.8)]"
                                    initial={{ top: 0 }}
                                    animate={{ top: "100%" }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                />

                                {/* Corner brackets */}
                                <div className="absolute top-3 left-3 w-8 h-8 border-l-2 border-t-2 border-frog-green" />
                                <div className="absolute top-3 right-3 w-8 h-8 border-r-2 border-t-2 border-frog-green" />
                                <div className="absolute bottom-3 left-3 w-8 h-8 border-l-2 border-b-2 border-frog-green" />
                                <div className="absolute bottom-3 right-3 w-8 h-8 border-r-2 border-b-2 border-frog-green" />

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/50 via-transparent to-transparent" />

                                {/* "LIVE" badge */}
                                <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur rounded-full border border-frog-green/30">
                                    <span className="w-2 h-2 rounded-full bg-frog-green animate-pulse" />
                                    <span className="text-xs font-mono text-frog-green uppercase tracking-wider">{t.analysis.analyzing}</span>
                                </div>
                            </div>
                        </div>

                        {/* Progress Steps - HORIZONTAL & COMPACT */}
                        <div className="w-full max-w-2xl mt-4 mb-2">
                            <div className="flex items-center justify-between gap-2">
                                {scanSteps.map((step, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={`flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border transition-all duration-300 ${i < scanStep
                                            ? 'bg-frog-green/10 border-frog-green/30'
                                            : i === scanStep
                                                ? 'bg-white/5 border-frog-green/50'
                                                : 'bg-white/[0.02] border-white/5 opacity-40'
                                            }`}
                                    >
                                        {/* Status Icon */}
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${i < scanStep
                                            ? 'bg-frog-green text-black'
                                            : i === scanStep
                                                ? 'border-2 border-frog-green'
                                                : 'border border-white/20'
                                            }`}>
                                            {i < scanStep ? (
                                                <Check className="w-3 h-3" />
                                            ) : i === scanStep ? (
                                                <motion.div
                                                    className="w-1.5 h-1.5 bg-frog-green rounded-full"
                                                    animate={{ scale: [1, 1.4, 1] }}
                                                    transition={{ duration: 0.5, repeat: Infinity }}
                                                />
                                            ) : null}
                                        </div>

                                        {/* Step Label - Hidden on mobile for space */}
                                        <span className={`text-xs font-medium hidden sm:block truncate ${i <= scanStep ? 'text-white' : 'text-gray-500'
                                            }`}>
                                            {step.label}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Current step label for mobile */}
                            <div className="sm:hidden text-center mt-2">
                                <span className="text-xs font-medium text-frog-green">
                                    {scanSteps[Math.min(scanStep, scanSteps.length - 1)]?.label}...
                                </span>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* --- NEW LAYOUT: Chart + Info Cards Below --- */
                    <motion.div
                        key="dashboard"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col"
                    >
                        {/* HEADER */}
                        <div className="h-16 border-b border-white/10 bg-[#0a0a0a] flex items-center justify-between px-4 sticky top-0 z-50">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-frog-green/20 blur-xl rounded-full scale-150" />
                                    <img
                                        src="/frog-transparent-final.png"
                                        alt="Frog AI"
                                        className="w-12 h-12 object-contain relative z-10 drop-shadow-[0_0_20px_rgba(0,255,157,0.5)]"
                                        style={{ imageRendering: 'pixelated' }}
                                    />
                                </div>
                                <span className="font-black text-xl tracking-tighter text-white">
                                    FROG<span className="text-frog-green">AI</span>
                                </span>
                            </div>
                            <button
                                onClick={onNewAnalysis}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-wider text-gray-300 transition-all"
                            >
                                <Scan className="w-3.5 h-3.5" />
                                {t.analysis.newScan}
                            </button>
                        </div>

                        {/* CHART SECTION (Full Width) */}
                        <div className="relative bg-[#020305] border-b border-white/10">
                            <div className="max-h-[50vh] overflow-hidden flex items-center justify-center p-4">
                                <img
                                    src={uploadedImage}
                                    alt="Chart analysé"
                                    className="max-w-full max-h-[45vh] object-contain rounded-lg shadow-2xl"
                                />
                                <ChartDrawingOverlay drawings={result.drawings} show={true} />
                            </div>
                        </div>

                        {/* MAIN CONTENT AREA */}
                        <div className="p-4 md:p-6 space-y-4 max-w-6xl mx-auto w-full">

                            {/* ROW 1: Signal + Quick Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Signal Card */}
                                <SignalBadge signal={result.signal} trend={result.trend} confidence={result.confidence} bullishLabel={t.analysis.bullish} bearishLabel={t.analysis.bearish} confidenceLabel={t.analysis.confidence} />

                                {/* Quick Metrics */}
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
                                    <div className="p-2 rounded-lg bg-blue-500/10">
                                        <Calculator className="w-5 h-5 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="text-lg font-mono font-bold text-white">{result.riskReward || "1:2.5"}</div>
                                        <div className="text-xs text-gray-400">{t.analysis.riskReward}</div>
                                    </div>
                                </div>

                                {/* Pattern Detected */}
                                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/5">
                                    <div className="p-2 rounded-lg bg-purple-500/10">
                                        <Layers className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-bold text-white">{result.pattern || t.analysis.marketStructure}</div>
                                        <div className="text-xs text-gray-400">{t.analysis.patternDetected}</div>
                                    </div>
                                </div>
                            </div>

                            {/* ROW 2: Enhanced AI Analysis Widget */}
                            <Widget title={t.analysis.detailedAnalysis} icon={Brain} defaultOpen={true} accentColor="frog-green">
                                <div className="space-y-4">
                                    {/* Trade Grade Badge */}
                                    {result.tradeGrade && (
                                        <div className="flex items-center gap-3">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black ${result.tradeGrade === 'A' ? 'bg-frog-green/20 text-frog-green' :
                                                result.tradeGrade === 'B' ? 'bg-yellow-500/20 text-yellow-400' :
                                                    'bg-red-500/20 text-red-400'
                                                }`}>
                                                {result.tradeGrade}
                                            </div>
                                            <div>
                                                <div className="text-sm font-bold text-white">
                                                    {result.tradeGrade === 'A' ? t.analysis.setupExcellent :
                                                        result.tradeGrade === 'B' ? t.analysis.setupOk : t.analysis.setupAvoid}
                                                </div>
                                                <div className="text-xs text-gray-400">{t.analysis.tradeGrade}</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Why This Trade */}
                                    {result.whyThisTrade && (
                                        <div className="p-3 bg-frog-green/5 border border-frog-green/10 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Sparkles className="w-3.5 h-3.5 text-frog-green" />
                                                <span className="text-[10px] font-bold text-frog-green uppercase tracking-widest">{t.analysis.whyThisTrade}</span>
                                            </div>
                                            <p className="text-sm text-gray-200 leading-relaxed">{result.whyThisTrade}</p>
                                        </div>
                                    )}

                                    {/* Key Observations */}
                                    {result.keyObservations && result.keyObservations.length > 0 && (
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Eye className="w-3.5 h-3.5 text-blue-400" />
                                                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{t.analysis.keyObservations}</span>
                                            </div>
                                            <ul className="space-y-2">
                                                {result.keyObservations.map((obs: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                                        <span className="text-blue-400 mt-0.5">•</span>
                                                        {obs}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Invalidation */}
                                    {result.invalidation && (
                                        <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                                                <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{t.analysis.invalidation}</span>
                                            </div>
                                            <p className="text-sm text-gray-300">{result.invalidation}</p>
                                        </div>
                                    )}

                                    {/* Action Steps */}
                                    {result.actionSteps && result.actionSteps.length > 0 && (
                                        <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <ListChecks className="w-3.5 h-3.5 text-cyan-400" />
                                                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">{t.analysis.actionSteps}</span>
                                            </div>
                                            <ol className="space-y-2">
                                                {result.actionSteps.map((step: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                                        <span className="bg-cyan-500/20 text-cyan-400 text-[10px] font-bold px-1.5 py-0.5 rounded">{i + 1}</span>
                                                        {step}
                                                    </li>
                                                ))}
                                            </ol>
                                        </div>
                                    )}

                                    {/* Best Entry */}
                                    {result.bestEntry && (
                                        <div className="p-3 bg-frog-green/5 border border-frog-green/10 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Target className="w-3.5 h-3.5 text-frog-green" />
                                                <span className="text-[10px] font-bold text-frog-green uppercase tracking-widest">{t.analysis.bestEntry}</span>
                                            </div>
                                            <p className="text-sm text-gray-200">{result.bestEntry}</p>
                                        </div>
                                    )}

                                    {/* Danger Zones */}
                                    {result.dangerZones && result.dangerZones.length > 0 && (
                                        <div className="p-3 bg-orange-500/5 border border-orange-500/10 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
                                                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest">{t.analysis.dangerZones}</span>
                                            </div>
                                            <ul className="space-y-1">
                                                {result.dangerZones.map((zone: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                                        <span className="text-orange-400 mt-0.5">⚠</span>
                                                        {zone}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Mistakes to Avoid */}
                                    {result.mistakesToAvoid && result.mistakesToAvoid.length > 0 && (
                                        <div className="p-3 bg-red-500/5 border border-red-500/10 rounded-lg">
                                            <div className="flex items-center gap-2 mb-2">
                                                <X className="w-3.5 h-3.5 text-red-400" />
                                                <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{t.analysis.mistakesToAvoid}</span>
                                            </div>
                                            <ul className="space-y-1">
                                                {result.mistakesToAvoid.map((mistake: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                                        <span className="text-red-400 mt-0.5">✕</span>
                                                        {mistake}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Market Context & Time Estimate */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {result.marketContext && (
                                            <div className="p-3 bg-purple-500/5 border border-purple-500/10 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                                                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">{t.analysis.marketContext}</span>
                                                </div>
                                                <p className="text-sm text-gray-300">{result.marketContext}</p>
                                            </div>
                                        )}
                                        {result.timeEstimate && (
                                            <div className="p-3 bg-white/5 border border-white/10 rounded-lg">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t.analysis.timeEstimate}</span>
                                                </div>
                                                <p className="text-sm text-white font-mono">{result.timeEstimate}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Summary */}
                                    <div className="pt-3 border-t border-white/10">
                                        <p className="text-sm text-gray-400 italic">"{result.analysisSummary}"</p>
                                    </div>
                                </div>
                            </Widget>

                            {/* ROW 3: Collapsible Widgets */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                {/* Widget: Trade Levels */}
                                <Widget title={t.analysis.tradeLevels} icon={Target} defaultOpen={true} accentColor="frog-green">
                                    <div className="space-y-2">
                                        <LevelRow label={t.analysis.entryZone} value={entryPrice} type="entry" />
                                        <LevelRow label={t.analysis.stopLoss} value={result.stopLoss} type="stop" />
                                        <LevelRow label={t.analysis.target1} value={result.target1} type="target1" />
                                        <LevelRow label={t.analysis.target2} value={result.target2} type="target2" />
                                    </div>
                                </Widget>

                                {/* Widget: Technical Indicators */}
                                <Widget title={t.analysis.technicalIndicators} icon={BarChart3} defaultOpen={true} accentColor="blue">
                                    <div className="space-y-3">
                                        {/* RSI */}
                                        <div>
                                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                                                <span>RSI (14)</span>
                                                <span className={Number(result.rsi) > 70 ? 'text-red-400' : Number(result.rsi) < 30 ? 'text-frog-green' : 'text-gray-300'}>
                                                    {result.rsi || 50}
                                                </span>
                                            </div>
                                            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full transition-all ${Number(result.rsi) > 70 ? 'bg-red-500' : Number(result.rsi) < 30 ? 'bg-frog-green' : 'bg-blue-500'}`}
                                                    style={{ width: `${result.rsi || 50}%` }}
                                                />
                                            </div>
                                        </div>

                                        {/* Volume & EMA */}
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="p-2 bg-white/5 rounded-lg">
                                                <span className="text-[10px] text-gray-500 uppercase block">{t.analysis.volume}</span>
                                                <span className="text-xs font-mono text-white">{result.volume || "Normal"}</span>
                                            </div>
                                            <div className="p-2 bg-white/5 rounded-lg">
                                                <span className="text-[10px] text-gray-500 uppercase block">{t.analysis.emaTrend}</span>
                                                <span className={`text-xs font-mono ${result.trend === 'bullish' ? 'text-frog-green' : 'text-red-400'}`}>
                                                    {result.trend === 'bullish' ? t.analysis.above : t.analysis.below}
                                                </span>
                                            </div>
                                        </div>

                                        {/* MACD if available */}
                                        {result.macd && (
                                            <div className="p-2 bg-white/5 rounded-lg">
                                                <span className="text-[10px] text-gray-500 uppercase block">MACD</span>
                                                <span className="text-xs font-mono text-white">{result.macd}</span>
                                            </div>
                                        )}
                                    </div>
                                </Widget>

                                {/* Widget: Strategy */}
                                <Widget title={t.analysis.recommendedStrategy} icon={Shield} defaultOpen={true} accentColor="blue">
                                    <div className="space-y-3">
                                        <div className="text-xs text-gray-300 font-mono leading-relaxed p-3 bg-blue-500/5 border border-blue-500/10 rounded-lg">
                                            {result.trend === 'bullish'
                                                ? t.analysis.longStrategy
                                                : t.analysis.shortStrategy}
                                        </div>

                                        {/* Checklist */}
                                        <div className="space-y-2">
                                            <div className="text-[10px] font-bold text-gray-500 uppercase">{t.analysis.checklist}</div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                {result.trend === 'bullish' ? <Check className="w-3.5 h-3.5 text-frog-green" /> : <X className="w-3.5 h-3.5 text-red-400" />}
                                                {t.analysis.trendAlignment}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                {result.confidence >= 4 ? <Check className="w-3.5 h-3.5 text-frog-green" /> : <Activity className="w-3.5 h-3.5 text-yellow-500" />}
                                                {t.analysis.highConfidence} ({result.confidence}/5)
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                                {result.riskReward ? <Check className="w-3.5 h-3.5 text-frog-green" /> : <Info className="w-3.5 h-3.5 text-gray-500" />}
                                                {t.analysis.favorableRR}
                                            </div>
                                        </div>
                                    </div>
                                </Widget>

                            </div>

                            {/* ROW 4: Prediction CTA Button */}
                            <button
                                onClick={() => setShowPrediction(true)}
                                className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-frog-green to-frog-cyan hover:from-frog-green/90 hover:to-frog-cyan/90 text-black text-sm font-black uppercase tracking-wider shadow-[0_0_30px_rgba(0,255,157,0.2)] hover:shadow-[0_0_50px_rgba(0,255,157,0.4)] transition-all group"
                            >
                                <Sparkles className="w-5 h-5 fill-black group-hover:rotate-12 transition-transform" />
                                {t.analysis.launchPrediction}
                                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <PredictionModal
                isOpen={showPrediction}
                onClose={() => setShowPrediction(false)}
                trend={result.trend || 'neutral'}
                projection={result.projection || { direction: 'sideways', percentage: 5 }}
                narrative={result.narrative}
                support={result.support}
                resistance={result.resistance}
            />
        </div>
    );
}
