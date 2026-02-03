"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, TrendingUp, TrendingDown, Trash2, History, ChevronRight } from "lucide-react";
import { AnalysisHistoryItem, getHistory, deleteAnalysis, clearHistory } from "@/lib/history";

interface HistoryDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectAnalysis: (item: AnalysisHistoryItem) => void;
}

export default function HistoryDrawer({ isOpen, onClose, onSelectAnalysis }: HistoryDrawerProps) {
    const [history, setHistory] = useState<AnalysisHistoryItem[]>([]);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (isOpen && mounted) {
            setHistory(getHistory());
        }
    }, [isOpen, mounted]);

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        deleteAnalysis(id);
        setHistory(getHistory());
    };

    const handleClearAll = () => {
        if (confirm("Effacer tout l'historique ?")) {
            clearHistory();
            setHistory([]);
        }
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        if (diff < 60000) return "À l'instant";
        if (diff < 3600000) return `Il y a ${Math.floor(diff / 60000)}min`;
        if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)}h`;
        if (diff < 604800000) return `Il y a ${Math.floor(diff / 86400000)}j`;

        return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    };

    const getGradeColor = (grade: string | undefined) => {
        if (grade === "A") return "bg-frog-green text-black";
        if (grade === "B") return "bg-yellow-500 text-black";
        return "bg-red-500 text-white";
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0a0a0a] border-l border-white/10 z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-frog-green/10 rounded-lg">
                                    <History className="w-5 h-5 text-frog-green" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-white">Historique</h2>
                                    <p className="text-xs text-gray-500">{history.length} analyses</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* History List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {history.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-64 text-center">
                                    <History className="w-12 h-12 text-gray-600 mb-4" />
                                    <p className="text-gray-400 font-medium">Aucune analyse</p>
                                    <p className="text-gray-500 text-sm">Vos analyses apparaîtront ici</p>
                                </div>
                            ) : (
                                history.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/10 rounded-xl p-3 cursor-pointer transition-all"
                                        onClick={() => onSelectAnalysis(item)}
                                    >
                                        <div className="flex gap-3">
                                            {/* Thumbnail */}
                                            <div className="relative w-20 h-14 rounded-lg overflow-hidden bg-white/5 shrink-0">
                                                <img
                                                    src={item.imageThumbnail}
                                                    alt="Chart"
                                                    className="w-full h-full object-cover"
                                                />
                                                {/* Trade Grade Badge */}
                                                {item.tradeGrade && (
                                                    <div className={`absolute top-1 left-1 text-[10px] font-black px-1.5 py-0.5 rounded ${getGradeColor(item.tradeGrade)}`}>
                                                        {item.tradeGrade}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    {/* Signal */}
                                                    <span className={`inline-flex items-center gap-1 text-xs font-bold ${item.trend === "bullish" ? "text-frog-green" : "text-red-400"
                                                        }`}>
                                                        {item.trend === "bullish" ? (
                                                            <TrendingUp className="w-3 h-3" />
                                                        ) : (
                                                            <TrendingDown className="w-3 h-3" />
                                                        )}
                                                        {item.signal}
                                                    </span>

                                                    {/* R:R */}
                                                    {item.riskReward && (
                                                        <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded">
                                                            R:R {item.riskReward}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Pattern */}
                                                {item.pattern && (
                                                    <p className="text-xs text-gray-400 truncate mb-1">{item.pattern}</p>
                                                )}

                                                {/* Time */}
                                                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                    <Clock className="w-3 h-3" />
                                                    {formatDate(item.timestamp)}
                                                </div>
                                            </div>

                                            {/* Arrow & Delete */}
                                            <div className="flex flex-col items-center justify-between">
                                                <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-frog-green transition-colors" />
                                                <button
                                                    onClick={(e) => handleDelete(e, item.id)}
                                                    className="p-1 opacity-0 group-hover:opacity-100 hover:bg-red-500/20 rounded transition-all"
                                                >
                                                    <Trash2 className="w-3 h-3 text-red-400" />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        {history.length > 0 && (
                            <div className="p-4 border-t border-white/10">
                                <button
                                    onClick={handleClearAll}
                                    className="w-full py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    Effacer tout l'historique
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
