"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, Phone, Loader2, Eye, EyeOff, User } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
    const [mode, setMode] = useState<"login" | "signup" | "forgot_password">("signup");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setIsLoading(true);

        if (!supabase) {
            setError("Service d'authentification non disponible");
            setIsLoading(false);
            return;
        }

        try {
            if (mode === "signup") {
                if (password !== confirmPassword) {
                    setError("Les mots de passe ne correspondent pas");
                    setIsLoading(false);
                    return;
                }

                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            phone: phone,
                        },
                    },
                });

                if (error) throw error;

                if (data.user) {
                    setSuccess("Compte créé ! Tu peux maintenant te connecter.");
                    setTimeout(() => {
                        setMode("login");
                        setSuccess("");
                    }, 2000);
                }
            } else if (mode === "forgot_password") {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/update-password`,
                });

                if (error) throw error;

                setSuccess("Un email de réinitialisation a été envoyé !");
                setTimeout(() => {
                    setMode("login");
                    setSuccess("");
                }, 3000);
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;

                onSuccess();
                onClose();
            }
        } catch (err: any) {
            console.error("Auth error:", err);
            if (err.message.includes("Invalid login")) {
                setError("Email ou mot de passe incorrect");
            } else if (err.message.includes("already registered")) {
                setError("Cet email est déjà utilisé. Connecte-toi !");
                setMode("login");
            } else {
                setError(err.message || "Une erreur est survenue");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-md bg-gradient-to-b from-[#0a0a0a] to-[#050505] border border-frog-green/30 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(0,255,157,0.15)]"
                    >
                        {/* Header */}
                        <div className="relative p-6 bg-gradient-to-br from-frog-green/20 via-frog-cyan/10 to-transparent">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center">
                                <motion.img
                                    src="/frog-transparent-final.png"
                                    alt="Frog AI"
                                    className="w-16 h-16 mx-auto mb-4 object-contain"
                                    animate={{ y: [0, -5, 0] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                />
                                <h2 className="text-2xl font-black text-white mb-1">
                                    {mode === "signup" ? "Créer un compte" : mode === "forgot_password" ? "Réinitialisation" : "Connexion"}
                                </h2>
                                <p className="text-gray-400 text-sm">
                                    {mode === "signup"
                                        ? "Rejoins les traders qui utilisent l'IA"
                                        : mode === "forgot_password"
                                            ? "Entre ton email pour recevoir un lien"
                                            : "Content de te revoir !"}
                                </p>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
                                    {error}
                                </div>
                            )}

                            {success && (
                                <div className="p-3 bg-frog-green/20 border border-frog-green/50 rounded-xl text-frog-green text-sm text-center">
                                    {success}
                                </div>
                            )}

                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Email"
                                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-frog-green/50 transition-colors"
                                    required
                                />
                            </div>

                            {mode === "signup" && (
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="Numéro de téléphone"
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-frog-green/50 transition-colors"
                                    />
                                </div>
                            )}

                            {mode !== "forgot_password" && (
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Mot de passe"
                                        className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-frog-green/50 transition-colors"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            )}

                            {mode === "signup" && (
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirmer le mot de passe"
                                        className="w-full pl-12 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-frog-green/50 transition-colors"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            )}

                            {mode === "login" && (
                                <div className="text-right">
                                    <button
                                        type="button"
                                        onClick={() => setMode("forgot_password")}
                                        className="text-xs text-gray-400 hover:text-white transition-colors"
                                    >
                                        Mot de passe oublié ?
                                    </button>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-gradient-to-r from-frog-green to-frog-cyan text-black font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,255,157,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                                ) : (
                                    mode === "signup" ? "Créer mon compte" : mode === "forgot_password" ? "Envoyer le lien" : "Se connecter"
                                )}
                            </button>

                            <div className="text-center pt-4 border-t border-white/10">
                                <p className="text-gray-400 text-sm">
                                    {mode === "signup" ? "Déjà un compte ?" : mode === "forgot_password" ? "Retour à la " : "Pas encore de compte ?"}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMode(mode === "signup" ? "login" : "signup");
                                            setError("");
                                            setSuccess("");
                                        }}
                                        className="ml-2 text-frog-green font-semibold hover:underline"
                                    >
                                        {mode === "signup" ? "Se connecter" : mode === "forgot_password" ? "Connexion" : "S'inscrire"}
                                    </button>
                                </p>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
