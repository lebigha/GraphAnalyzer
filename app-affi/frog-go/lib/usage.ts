// ============================================================================
// GESTION DE L'UTILISATION - FROG AI
// Limitation du nombre d'analyses gratuites par utilisateur
// ============================================================================

// ============================================================================
// CONFIGURATION
// ============================================================================

const STORAGE_KEY = "frog_ai_usage";
const PREMIUM_KEY = "frog_premium";

// Nombre maximum d'analyses gratuites avant paywall
const MAX_FREE_ANALYSES = 999;

// ============================================================================
// PREMIUM STATUS
// ============================================================================

/**
 * Vérifie si l'utilisateur a un accès premium (lifetime)
 */
export function isPremium(): boolean {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(PREMIUM_KEY) === "true";
}

/**
 * Active le statut premium pour l'utilisateur
 */
export function setPremium(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(PREMIUM_KEY, "true");
    localStorage.setItem("frog_premium_date", new Date().toISOString());
}

// ============================================================================
// API PUBLIQUE
// ============================================================================

/**
 * Vérifie si l'utilisateur peut encore faire des analyses
 */
export function checkUsageLimit(): boolean {
    if (typeof window === "undefined") return true;
    if (isPremium()) return true;
    return getUsage() < MAX_FREE_ANALYSES;
}

/**
 * Incrémente le compteur d'utilisation
 */
export function incrementUsage(): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, String(getUsage() + 1));
}

/**
 * Retourne le nombre d'analyses effectuées
 */
export function getUsage(): number {
    if (typeof window === "undefined") return 0;
    const usage = localStorage.getItem(STORAGE_KEY);
    return usage ? parseInt(usage, 10) : 0;
}

/**
 * Retourne le nombre d'analyses restantes
 */
export function getRemainingAnalyses(): number {
    if (isPremium()) return Infinity;
    return Math.max(0, MAX_FREE_ANALYSES - getUsage());
}

/**
 * Retourne le maximum d'analyses gratuites
 */
export function getMaxFreeAnalyses(): number {
    return MAX_FREE_ANALYSES;
}

/**
 * Réinitialise le compteur d'utilisation
 */
export function resetUsage(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(STORAGE_KEY);
}
