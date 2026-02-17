"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ImageUpload from "@/components/ImageUpload";
import ChartAnalysis from "@/components/ChartAnalysis";
import HistoryDrawer from "@/components/HistoryDrawer";
import PaywallModal from "@/components/PaywallModal";
import AuthModal from "@/components/AuthModal";
import { checkUsageLimit, incrementUsage, getRemainingAnalyses, isPremium, getMaxFreeAnalyses, setPremium } from "@/lib/usage";
import { saveAnalysis, getHistoryCount, AnalysisHistoryItem } from "@/lib/history";
import { useAuth } from "@/lib/supabase/client";
import Link from "next/link";
import { ArrowLeft, History, Crown } from "lucide-react";

export default function AnalyzePage() {
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);
    const [showAuth, setShowAuth] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showHistory, setShowHistory] = useState(false);
    const [historyCount, setHistoryCount] = useState(0);
    const [hasPremium, setHasPremium] = useState(false);

    // Use auth hook
    const { user } = useAuth();

    // Wait for client mount before reading localStorage
    useEffect(() => {
        setMounted(true);
        setHistoryCount(getHistoryCount());

        // Secret beta access: ?beta=frog2026 activates premium
        const params = new URLSearchParams(window.location.search);
        if (params.get("beta") === "frog2026") {
            setPremium();
        }

        setHasPremium(isPremium());
    }, []);

    const handleImageUpload = async (imageData: string) => {
        setError(null);

        // Check if user is logged in first
        if (!user) {
            setShowAuth(true);
            return;
        }

        // Check usage limit (premium users skip this)
        const canAnalyze = checkUsageLimit();
        if (!canAnalyze) {
            setShowPaywall(true);
            return;
        }

        setUploadedImage(imageData);
        setIsAnalyzing(true);

        try {
            const response = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: imageData }),
            });

            const result = await response.json();

            // Strict Validation Check
            if (result.isValid === false) {
                const reason = result.reason || "Pour que l'IA puisse analyser le marché, merci d'importer une capture d'écran valide (Forex, Crypto, Stocks) avec des chandeliers ou une courbe.";
                const suggestion = result.suggestion ? `\n\n💡 ${result.suggestion}` : "";
                setError(`🐸 ${reason}${suggestion}`);
                setUploadedImage(null);
                setAnalysisResult(null);
                return;
            }

            setAnalysisResult(result);
            incrementUsage();

            // Save to history
            await saveAnalysis(imageData, result);
            setHistoryCount(getHistoryCount());
        } catch (err) {
            console.error("Analysis failed:", err);
            setError("Oups ! Une erreur technique est survenue. Veuillez réessayer.");
            setUploadedImage(null);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleNewAnalysis = () => {
        setAnalysisResult(null);
        setUploadedImage(null);
        setError(null);
    };

    // Handler for selecting a historical analysis
    const handleSelectHistory = (item: AnalysisHistoryItem) => {
        setUploadedImage(item.imageThumbnail);
        setAnalysisResult(item.result);
        setShowHistory(false);
    };

    const handlePaywallSuccess = () => {
        setShowPaywall(false);
        setHasPremium(true);
    };

    // Only get remaining from localStorage after mount to avoid hydration mismatch
    const remaining = mounted ? getRemainingAnalyses() : getMaxFreeAnalyses();

    return (
        <>
            {/* If we have results, show ChartAnalysis FULLSCREEN */}
            {analysisResult && (
                <ChartAnalysis
                    result={analysisResult}
                    uploadedImage={uploadedImage!}
                    onNewAnalysis={handleNewAnalysis}
                />
            )}

            {/* Otherwise, show the upload interface */}
            {!analysisResult && (
                <main className="min-h-screen bg-gradient-to-b from-frog-dark to-frog-darker py-12">
                    <div className="container mx-auto px-4 max-w-4xl">
                        {/* Header */}
                        <div className="mb-6 flex items-center justify-between">
                            <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-frog-green transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                                Retour à l'Accueil
                            </Link>

                            {/* History Button */}
                            <button
                                onClick={() => setShowHistory(true)}
                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm text-gray-300 hover:text-white transition-all"
                            >
                                <History className="w-4 h-4" />
                                <span>Historique {historyCount > 0 && `(${historyCount})`}</span>
                            </button>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-8"
                        >
                            {/* HERO FROG MASCOT - PROMINENT */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.6, type: "spring" }}
                                className="mb-6 relative inline-block"
                            >
                                {/* Glow ring behind */}
                                <div className="absolute inset-0 bg-frog-green/20 blur-3xl rounded-full scale-150" />
                                <motion.img
                                    src="/frog-transparent-final.png"
                                    alt="Frog AI Mascot"
                                    className="w-28 h-28 md:w-36 md:h-36 mx-auto object-contain relative z-10 drop-shadow-[0_0_40px_rgba(0,255,157,0.5)]"
                                    style={{ imageRendering: 'pixelated' }}
                                    animate={{ y: [0, -8, 0] }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </motion.div>

                            {/* Brand Text */}
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <span className="text-3xl font-black tracking-tighter">
                                    FROG<span className="text-frog-green">AI</span>
                                </span>
                                <span className="text-[10px] text-gray-500 font-mono bg-white/5 px-1.5 py-0.5 rounded">v2.0</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black mb-3">
                                <span className="text-white">Scanner IA </span>
                                <span className="text-gradient">Premium</span>
                            </h1>
                            <p className="text-gray-400 max-w-md mx-auto">
                                Intelligence artificielle de pointe pour l'analyse technique
                            </p>

                            {/* Status badge */}
                            <div className="mt-4">
                                {hasPremium ? (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-frog-green/20 to-frog-cyan/20 border border-frog-green/30 rounded-full">
                                        <Crown className="w-4 h-4 text-frog-green" />
                                        <span className="text-sm font-bold text-frog-green">
                                            Accès Lifetime Illimité
                                        </span>
                                    </div>
                                ) : (
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-frog-green/10 border border-frog-green/20 rounded-full">
                                        <div className="w-2 h-2 bg-frog-green rounded-full animate-pulse" />
                                        <span className="text-sm font-medium text-frog-green">
                                            {remaining} {remaining === 1 ? 'scan gratuit restant' : 'scans gratuits restants'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-8 p-6 bg-red-900/30 border-2 border-red-500/50 rounded-xl text-center backdrop-blur-sm"
                            >
                                <p className="text-lg text-white font-bold mb-1">Attention 🐸</p>
                                <p className="text-red-300 whitespace-pre-line">{error.replace("⛔️ Image refusée : ", "").replace("🐸 Attention : ", "")}</p>
                            </motion.div>
                        )}

                        <ImageUpload
                            onUpload={handleImageUpload}
                            isAnalyzing={isAnalyzing}
                        />
                    </div>
                </main>
            )}

            {/* Paywall Modal */}
            <PaywallModal
                isOpen={showPaywall}
                onClose={() => setShowPaywall(false)}
                onSuccess={handlePaywallSuccess}
            />

            {/* Auth Modal */}
            <AuthModal
                isOpen={showAuth}
                onClose={() => setShowAuth(false)}
                onSuccess={() => {
                    setShowAuth(false);
                    // After login, only show paywall if no free scans left and not premium
                    if (!isPremium() && !checkUsageLimit()) {
                        setShowPaywall(true);
                    }
                }}
            />

            {/* History Drawer */}
            <HistoryDrawer
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                onSelectAnalysis={handleSelectHistory}
            />
        </>
    );
}

