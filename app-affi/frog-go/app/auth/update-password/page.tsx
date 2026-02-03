"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function UpdatePasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas");
            setIsLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            setSuccess(true);
            setTimeout(() => {
                router.push("/");
            }, 3000);

        } catch (err: any) {
            console.error("Update password error:", err);
            setError(err.message || "Erreur lors de la mise à jour");
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <main className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full bg-gradient-to-b from-[#0a0a0a] to-[#050505] border border-frog-green/30 rounded-3xl p-8 text-center"
                >
                    <div className="w-20 h-20 mx-auto bg-frog-green/20 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle className="w-10 h-10 text-frog-green" />
                    </div>
                    <h1 className="text-2xl font-black text-white mb-4">Mot de passe modifié !</h1>
                    <p className="text-gray-400 mb-8">
                        Ton mot de passe a été mis à jour avec succès. Tu vas être redirigé...
                    </p>
                    <Link href="/">
                        <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors">
                            Retour à l'accueil
                        </button>
                    </Link>
                </motion.div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-md w-full"
            >
                <div className="text-center mb-8">
                    <img
                        src="/frog-transparent-final.png"
                        alt="Frog AI"
                        className="w-24 h-24 mx-auto mb-6 object-contain drop-shadow-[0_0_30px_rgba(0,255,157,0.3)]"
                    />
                    <h1 className="text-3xl font-black text-white mb-2">Nouveau mot de passe</h1>
                    <p className="text-gray-400">Choisis un nouveau mot de passe sécurisé</p>
                </div>

                <div className="bg-gradient-to-b from-[#0a0a0a] to-[#050505] border border-frog-green/30 rounded-3xl p-6 shadow-[0_0_60px_rgba(0,255,157,0.1)]">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nouveau mot de passe"
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

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 bg-gradient-to-r from-frog-green to-frog-cyan text-black font-bold rounded-xl hover:shadow-[0_0_40px_rgba(0,255,157,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            ) : (
                                "Mettre à jour le mot de passe"
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </main>
    );
}
