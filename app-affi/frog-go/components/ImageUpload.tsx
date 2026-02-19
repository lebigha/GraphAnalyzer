"use client";

import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, ScanLine, Zap, TrendingUp, Shield, Clock, Clipboard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/lib/i18n";

interface ImageUploadProps {
    onUpload: (imageData: string) => void;
    isAnalyzing: boolean;
}

export default function ImageUpload({ onUpload, isAnalyzing }: ImageUploadProps) {
    const [isMobile, setIsMobile] = useState(false);
    const [showPasteHint, setShowPasteHint] = useState(false);
    const { t } = useTranslation();

    const features = [
        { icon: Zap, title: t.upload.instantAnalysis, desc: t.upload.instantDesc },
        { icon: TrendingUp, title: t.upload.patternRecognition, desc: t.upload.patternDesc },
        { icon: Shield, title: t.upload.riskManagement, desc: t.upload.riskDesc },
    ];

    useEffect(() => {
        const checkMobile = () => {
            const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const isSmallScreen = window.innerWidth < 768;
            setIsMobile(hasTouch || isSmallScreen);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const compressImage = useCallback((file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            img.onload = () => {
                const MAX_SIZE = 1200;
                let { width, height } = img;

                if (width > MAX_SIZE || height > MAX_SIZE) {
                    if (width > height) {
                        height = Math.round((height * MAX_SIZE) / width);
                        width = MAX_SIZE;
                    } else {
                        width = Math.round((width * MAX_SIZE) / height);
                        height = MAX_SIZE;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);

                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
                console.log(`[ImageUpload] Compressed: ${(compressedDataUrl.length / 1024).toFixed(0)}KB`);
                resolve(compressedDataUrl);
            };

            img.onerror = () => reject(new Error('Failed to load image'));

            const reader = new FileReader();
            reader.onload = () => {
                img.src = reader.result as string;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    }, []);

    const processFile = useCallback(async (file: File) => {
        try {
            const compressedImage = await compressImage(file);
            onUpload(compressedImage);
        } catch (error) {
            console.error('[ImageUpload] Compression error:', error);
            const reader = new FileReader();
            reader.onload = () => {
                onUpload(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    }, [onUpload, compressImage]);

    // Handle Ctrl+V paste from clipboard
    useEffect(() => {
        const handlePaste = (e: ClipboardEvent) => {
            if (isAnalyzing) return;

            const items = e.clipboardData?.items;
            if (!items) return;

            for (const item of Array.from(items)) {
                if (item.type.startsWith('image/')) {
                    e.preventDefault();
                    const file = item.getAsFile();
                    if (file) {
                        // Brief visual feedback
                        setShowPasteHint(true);
                        setTimeout(() => setShowPasteHint(false), 1500);
                        processFile(file);
                    }
                    break;
                }
            }
        };

        window.addEventListener('paste', handlePaste);
        return () => window.removeEventListener('paste', handlePaste);
    }, [isAnalyzing, processFile]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            if (file) processFile(file);
        },
        [processFile]
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept: { "image/*": [".png", ".jpg", ".jpeg", ".webp"] },
        maxFiles: 1,
        disabled: isAnalyzing,
    });

    return (
        <div className="space-y-8">
            {/* SCANNER-STYLE UPLOAD ZONE */}
            <div
                {...getRootProps()}
                className={`
                    relative group cursor-pointer
                    ${isAnalyzing ? "opacity-50 cursor-not-allowed" : ""}
                `}
            >
                <input {...getInputProps()} />

                {/* Outer glow effect on hover */}
                <div className={`
                    absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500
                    bg-gradient-to-r from-frog-green/20 via-frog-cyan/20 to-frog-green/20 blur-xl
                `} />

                {/* Main container */}
                <div className={`
                    relative overflow-hidden rounded-2xl
                    bg-gradient-to-b from-white/[0.03] to-transparent
                    border transition-all duration-300
                    ${isDragActive ? "border-frog-green bg-frog-green/5 scale-[1.02]" : "border-white/10 hover:border-frog-green/30"}
                    ${isDragReject ? "border-red-500 bg-red-500/10" : ""}
                `}>

                    {/* Animated grid background */}
                    <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `
                                linear-gradient(rgba(0,255,157,0.03) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(0,255,157,0.03) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px',
                        }} />
                    </div>

                    {/* Scanner corners */}
                    <div className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-frog-green/50 rounded-tl-lg" />
                    <div className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-frog-green/50 rounded-tr-lg" />
                    <div className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-frog-green/50 rounded-bl-lg" />
                    <div className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-frog-green/50 rounded-br-lg" />

                    {/* Animated scan line */}
                    <motion.div
                        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-frog-green/40 to-transparent"
                        animate={{ top: ["10%", "90%", "10%"] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    />

                    {/* Content */}
                    <div className="relative z-10 px-8 py-16 md:py-20">
                        <div className="flex flex-col items-center text-center">
                            <AnimatePresence mode="wait">
                                {isAnalyzing ? (
                                    <motion.div
                                        key="analyzing"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        className="space-y-6"
                                    >
                                        <div className="relative w-24 h-24 mx-auto">
                                            <div className="absolute inset-0 border-4 border-frog-green/20 rounded-full animate-pulse-slow" />
                                            <div className="absolute inset-0 border-4 border-t-frog-green border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
                                            <ScanLine className="absolute inset-0 m-auto w-10 h-10 text-frog-green animate-pulse" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">{t.upload.analyzing}</h3>
                                            <p className="text-sm text-gray-500 font-mono">{t.upload.identifyingPatterns}</p>
                                        </div>
                                    </motion.div>
                                ) : isDragActive ? (
                                    <motion.div
                                        key="drag-active"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="py-8"
                                    >
                                        <motion.div
                                            className="w-24 h-24 bg-frog-green/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border-2 border-dashed border-frog-green"
                                            animate={{ scale: [1, 1.05, 1] }}
                                            transition={{ duration: 0.5, repeat: Infinity }}
                                        >
                                            <Upload className="w-12 h-12 text-frog-green" />
                                        </motion.div>
                                        <h3 className="text-2xl font-bold text-frog-green">{t.upload.dropHere}</h3>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="idle"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-6"
                                    >
                                        {/* Scanner icon */}
                                        <div className="relative w-24 h-24 mx-auto">
                                            <div className="absolute inset-0 bg-frog-green/5 rounded-2xl border border-frog-green/20" />
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <motion.div
                                                    animate={{ y: [0, -3, 0] }}
                                                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                                >
                                                    <ScanLine className="w-12 h-12 text-frog-green" />
                                                </motion.div>
                                            </div>
                                            {/* Pulse effect */}
                                            <motion.div
                                                className="absolute inset-0 rounded-2xl border border-frog-green/30"
                                                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <h3 className="text-2xl md:text-3xl font-black text-white">
                                                {t.upload.scanTitle} <span className="text-frog-green">{t.upload.scanHighlight}</span>
                                            </h3>
                                            <p className="text-gray-400 max-w-md mx-auto text-sm md:text-base">
                                                {t.upload.scanDesc}
                                            </p>
                                            <p className="text-xs text-gray-600 font-mono">
                                                PNG • JPG • WEBP
                                            </p>
                                            {!isMobile && (
                                                <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                                                    <Clipboard className="w-3 h-3" />
                                                    <span>{t.upload.pasteHint}</span>
                                                </div>
                                            )}
                                        </div>

                                        <motion.button
                                            className="relative overflow-hidden px-8 py-3 bg-frog-green text-black font-bold rounded-xl shadow-lg shadow-frog-green/25"
                                            whileHover={{ scale: 1.03 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <span className="relative z-10">
                                                {isMobile ? t.upload.takePhoto : t.upload.browseFiles}
                                            </span>
                                            {/* Shine effect */}
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                                                animate={{ x: ["-100%", "200%"] }}
                                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                            />
                                        </motion.button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* FEATURE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {features.map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="group p-4 bg-white/[0.02] hover:bg-white/[0.05] border border-white/5 hover:border-frog-green/20 rounded-xl transition-all duration-300"
                    >
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-frog-green/10 rounded-lg group-hover:bg-frog-green/20 transition-colors">
                                <feature.icon className="w-5 h-5 text-frog-green" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-sm">{feature.title}</h4>
                                <p className="text-xs text-gray-500">{feature.desc}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* SUPPORTED PLATFORMS */}
            <div className="text-center">
                <p className="text-xs text-gray-600">
                    {t.upload.compatibleWith} <span className="text-gray-400">TradingView</span> • <span className="text-gray-400">MetaTrader</span> • <span className="text-gray-400">Binance</span> • <span className="text-gray-400">{t.upload.andMore}</span>
                </p>
            </div>
        </div>
    );
}
