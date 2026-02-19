"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { TrendingUp, Zap, Target, ArrowRight, Shield, Globe, Award, ChevronRight, X, Check, Sparkles } from "lucide-react";
import Testimonials from "@/components/Testimonials";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import FomoCounter from "@/components/FomoCounter";
import WaitlistModal from "@/components/WaitlistModal";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "@/lib/i18n";

export default function Home() {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <main className="min-h-screen relative overflow-hidden bg-[#05070a] selection:bg-frog-green/20">

        {/* Language Switcher - Fixed top right */}
        <div className="fixed top-4 right-4 z-50">
          <LanguageSwitcher />
        </div>

        {/* Background Gradient Mesh */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[1000px] h-[1000px] bg-frog-green/5 blur-[150px] rounded-full mix-blend-screen opacity-50" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-500/5 blur-[150px] rounded-full mix-blend-screen opacity-50" />
          <div className="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-frog-cyan/5 blur-[120px] rounded-full mix-blend-screen opacity-30 animate-pulse-slow" />
        </div>

        {/* Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:4rem_4rem]" />

        {/* --- HERO SECTION --- */}
        <section className="relative z-10 pt-24 pb-20 md:pt-32 md:pb-32 px-4">
          <div className="container mx-auto max-w-6xl text-center">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center mb-8"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-frog-green opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-frog-green"></span>
                </span>
                <span className="text-xs font-mono text-gray-300 font-medium tracking-wide">{t.home.badge}</span>
              </div>
            </motion.div>

            {/* Hero Mascot - PROMINENT WITH ANIMATION */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.1, type: "spring" }}
              className="mb-8 relative inline-block"
            >
              {/* Glow ring behind */}
              <div className="absolute inset-0 bg-frog-green/25 blur-3xl rounded-full scale-[2]" />
              <motion.img
                src="/frog-transparent-final.png"
                alt="Frog AI"
                className="w-40 h-40 md:w-52 md:h-52 object-contain relative z-10 drop-shadow-[0_0_60px_rgba(0,255,157,0.5)]"
                style={{ imageRendering: 'pixelated' }}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-8 leading-[0.95]"
            >
              <span className="text-white">{t.home.heroTitle1}</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-frog-green via-frog-cyan to-frog-green animate-gradient bg-[length:200%_auto]">
                {t.home.heroTitle2}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
            >
              {t.home.heroSubtitle} <span className="text-white font-medium">{t.home.heroAssets}</span> — et recevez <span className="text-frog-green font-semibold">{t.home.heroResult}</span> {t.home.heroResultSuffix}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/analyze">
                <button className="btn-neon group flex items-center gap-3 text-lg px-8 py-4 shadow-[0_0_40px_rgba(0,255,157,0.2)] hover:shadow-[0_0_60px_rgba(0,255,157,0.4)] transition-shadow">
                  {t.home.ctaAnalyze} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <div className="flex items-center gap-3 text-sm text-gray-500 font-mono">
                <span className="flex items-center gap-1"><Shield className="w-4 h-4" /> {t.home.noSignup}</span>
                <span className="text-white/20">•</span>
                <span>{t.home.resultIn2s}</span>
              </div>
            </motion.div>

            {/* FOMO Counter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-12"
            >
              <FomoCounter onWaitlistClick={() => setShowWaitlist(true)} />
            </motion.div>

          </div>
        </section>

        {/* --- SOCIAL PROOF --- */}
        <section className="py-12 border-y border-white/5 bg-white/[0.02]">
          <div className="container mx-auto text-center px-4">
            <p className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-8">{t.home.socialProof}</p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-40 grayscale pointer-events-none select-none">
              <h3 className="text-2xl font-black text-white">BINANCE</h3>
              <h3 className="text-2xl font-black text-white">COINBASE</h3>
              <h3 className="text-2xl font-black text-white">BYBIT</h3>
              <h3 className="text-2xl font-black text-white">TRADINGVIEW</h3>
            </div>
          </div>
        </section>

        {/* --- PROBLEM / SOLUTION --- */}
        <section className="py-24 px-4 bg-[#05070a]">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black mb-4">{t.home.problemTitle}</h2>
              <p className="text-gray-400 text-lg">{t.home.problemSubtitle}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* The Old Way */}
              <div className="glass-card p-10 bg-red-500/5 border-red-500/10 hover:border-red-500/30 transition-all duration-500 group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <X className="w-32 h-32 text-red-500 transform rotate-12" />
                </div>
                <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-3 relative z-10">
                  <X className="w-6 h-6" /> {t.home.oldWayTitle}
                </h3>
                <ul className="space-y-4 text-gray-400 relative z-10">
                  <li className="flex items-start gap-3"><span className="text-red-500 mt-1">😤</span> {t.home.oldWay1}</li>
                  <li className="flex items-start gap-3"><span className="text-red-500 mt-1">💸</span> {t.home.oldWay2}</li>
                  <li className="flex items-start gap-3"><span className="text-red-500 mt-1">🤯</span> {t.home.oldWay3}</li>
                  <li className="flex items-start gap-3"><span className="text-red-500 mt-1">😰</span> {t.home.oldWay4}</li>
                </ul>
              </div>

              {/* The Frog Way */}
              <div className="glass-card p-10 bg-frog-green/5 border-frog-green/20 hover:border-frog-green/50 hover:shadow-[0_0_30px_rgba(0,255,157,0.1)] transition-all duration-500 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-700">
                  <Check className="w-32 h-32 text-frog-green -rotate-12" />
                </div>
                <h3 className="text-2xl font-bold text-frog-green mb-6 flex items-center gap-3 relative z-10">
                  <Check className="w-6 h-6" /> {t.home.newWayTitle}
                </h3>
                <ul className="space-y-4 text-gray-300 relative z-10">
                  <li className="flex items-start gap-3"><span className="text-frog-green mt-1">🎯</span> {t.home.newWay1}</li>
                  <li className="flex items-start gap-3"><span className="text-frog-green mt-1">🧠</span> {t.home.newWay2}</li>
                  <li className="flex items-start gap-3"><span className="text-frog-green mt-1">⚡</span> {t.home.newWay3}</li>
                  <li className="flex items-start gap-3"><span className="text-frog-green mt-1">📱</span> {t.home.newWay4}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* --- HOW IT WORKS --- */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-frog-purple/5 blur-[100px] rounded-full pointer-events-none" />

          <div className="container mx-auto max-w-6xl px-4 relative z-10">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-black mb-6">{t.home.howTitle}</h2>
              <p className="text-xl text-gray-400">{t.home.howSubtitle}</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              {/* Connector Line */}
              <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-gradient-to-r from-transparent via-frog-green/30 to-transparent border-none" />

              {[
                { icon: <Shield className="w-8 h-8" />, title: t.home.step1Title, desc: t.home.step1Desc },
                { icon: <Zap className="w-8 h-8" />, title: t.home.step2Title, desc: t.home.step2Desc },
                { icon: <Target className="w-8 h-8" />, title: t.home.step3Title, desc: t.home.step3Desc }
              ].map((step, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center group cursor-default">
                  <div className="w-24 h-24 rounded-2xl bg-[#0B0F17] border border-white/10 flex items-center justify-center text-frog-green shadow-2xl mb-8 group-hover:scale-110 group-hover:border-frog-green group-hover:bg-frog-green/10 group-hover:shadow-[0_0_30px_rgba(0,255,157,0.3)] transition-all duration-500 ease-out">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-frog-green transition-colors">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed px-4">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* --- AI PREDICTION FEATURE --- */}
        <section className="py-24 md:py-32 relative overflow-hidden bg-gradient-to-b from-[#05070a] via-[#0a1020] to-[#05070a]">
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-frog-cyan/10 blur-[150px] rounded-full pointer-events-none" />

          <div className="container mx-auto max-w-6xl px-4 relative z-10">
            <div className="grid md:grid-cols-2 gap-12 items-center">

              {/* Left: Content */}
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-frog-cyan/10 border border-frog-cyan/20 mb-6">
                  <Sparkles className="w-4 h-4 text-frog-cyan" />
                  <span className="text-xs font-mono text-frog-cyan uppercase tracking-wide">{t.home.exclusiveFeature}</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                  <span className="text-white">{t.home.predTitle1}</span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-frog-cyan to-frog-green">{t.home.predTitle2}</span>
                </h2>

                <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                  {t.home.predDesc} <span className="text-white font-semibold">{t.home.predDescBold}</span> {t.home.predDescEnd}
                </p>

                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 rounded-lg bg-frog-green/10 flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-frog-green" />
                    </div>
                    <span>{t.home.predFeature1}</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 rounded-lg bg-frog-cyan/10 flex items-center justify-center">
                      <Target className="w-4 h-4 text-frog-cyan" />
                    </div>
                    <span>{t.home.predFeature2}</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <Shield className="w-4 h-4 text-red-400" />
                    </div>
                    <span>{t.home.predFeature3}</span>
                  </li>
                </ul>

                <Link href="/analyze">
                  <button className="group flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-frog-cyan to-frog-green text-black font-bold hover:shadow-[0_0_40px_rgba(0,240,255,0.3)] transition-all">
                    {t.home.predCta}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>

              {/* Right: Visual */}
              <div className="relative">
                <div className="glass-card p-6 md:p-8 relative overflow-hidden">
                  {/* Fake chart preview */}
                  <div className="aspect-video bg-[#0B0F17] rounded-lg mb-4 relative overflow-hidden border border-white/5">
                    {/* Simulated chart lines */}
                    <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                      {/* Price line */}
                      <motion.path
                        d="M 0 150 Q 50 140, 100 120 T 200 100 T 300 80 T 400 50"
                        fill="none"
                        stroke="url(#gradient)"
                        strokeWidth="3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
                      />
                      {/* Prediction zone */}
                      <motion.path
                        d="M 300 80 Q 350 60, 400 30"
                        fill="none"
                        stroke="#00F0FF"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 1, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      />
                      <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#00FF9D" />
                          <stop offset="100%" stopColor="#00F0FF" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Prediction badge */}
                    <motion.div
                      className="absolute top-4 right-4 px-3 py-1.5 bg-frog-cyan/20 border border-frog-cyan/30 rounded-full"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-xs font-mono text-frog-cyan">+12.5% {t.home.predicted}</span>
                    </motion.div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-black text-frog-green">87%</div>
                      <div className="text-xs text-gray-500">{t.home.accuracy}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-frog-cyan">2.5s</div>
                      <div className="text-xs text-gray-500">{t.home.analysisTime}</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-white">24/7</div>
                      <div className="text-xs text-gray-500">{t.home.available}</div>
                    </div>
                  </div>
                </div>

                {/* Floating elements */}
                <motion.div
                  className="absolute -top-4 -right-4 w-20 h-20 bg-frog-green/20 rounded-full blur-xl"
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- TESTIMONIALS --- */}
        <Testimonials />

        {/* --- FAQ --- */}
        <FAQ />

        {/* --- FINAL CTA --- */}
        <section className="py-32 px-4 text-center relative overflow-hidden">
          {/* Glow behind */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-frog-green/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="container mx-auto max-w-4xl relative z-10">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tighter">
              {t.home.finalTitle1}<br /><span className="text-frog-green">{t.home.finalTitle2}</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
              {t.home.finalSubtitle}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-8">
              <Link href="/analyze">
                <button className="btn-neon text-xl px-12 py-5 shadow-2xl shadow-frog-green/20 hover:shadow-frog-green/40">
                  {t.home.finalCta}
                </button>
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 font-mono">
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-frog-green" /> {t.home.noSignup}</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-frog-green" /> {t.home.noCard}</span>
              <span className="flex items-center gap-2"><Check className="w-4 h-4 text-frog-green" /> {t.home.resultIn2sFull}</span>
            </div>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <Footer />

      </main>

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={showWaitlist}
        onClose={() => setShowWaitlist(false)}
      />
    </>
  );
}
