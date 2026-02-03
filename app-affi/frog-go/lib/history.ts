// ============================================================================
// HISTORIQUE DES ANALYSES - FROG AI
// Gestion du stockage local pour l'historique des analyses
// ============================================================================

"use client";

// ============================================================================
// TYPES
// ============================================================================

/**
 * Item d'historique d'analyse
 */
export interface AnalysisHistoryItem {
    id: string;
    timestamp: number;
    imageThumbnail: string;
    signal: string;
    trend: string;
    tradeGrade?: string;
    pattern?: string;
    riskReward?: string;
    confidence: number;
    result: AnalysisResult;
}

/**
 * Résultat d'analyse (structure partielle)
 */
export interface AnalysisResult {
    isValid: boolean;
    trend?: string;
    signal?: string;
    tradeGrade?: string;
    pattern?: string;
    support?: number;
    resistance?: number;
    stopLoss?: number;
    target1?: number;
    target2?: number;
    riskReward?: string;
    confidence?: number;
    [key: string]: unknown;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const STORAGE_KEY = "frog-ai-history";
const MAX_HISTORY_ITEMS = 20;
const THUMBNAIL_MAX_WIDTH = 200;
const THUMBNAIL_QUALITY = 0.6;

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Crée une miniature depuis une image base64
 */
function createThumbnail(base64Image: string, maxWidth = THUMBNAIL_MAX_WIDTH): Promise<string> {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            const ratio = maxWidth / img.width;
            canvas.width = maxWidth;
            canvas.height = img.height * ratio;

            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                resolve(canvas.toDataURL("image/jpeg", THUMBNAIL_QUALITY));
            } else {
                resolve(base64Image);
            }
        };
        img.onerror = () => resolve(base64Image);
        img.src = base64Image;
    });
}

/**
 * Génère un ID unique
 */
function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

// ============================================================================
// API PUBLIQUE
// ============================================================================

/**
 * Récupère tout l'historique
 */
export function getHistory(): AnalysisHistoryItem[] {
    if (typeof window === "undefined") return [];

    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

/**
 * Sauvegarde une nouvelle analyse dans l'historique
 */
export async function saveAnalysis(
    image: string,
    result: AnalysisResult
): Promise<AnalysisHistoryItem> {
    const thumbnail = await createThumbnail(image);

    const item: AnalysisHistoryItem = {
        id: generateId(),
        timestamp: Date.now(),
        imageThumbnail: thumbnail,
        signal: result.signal || "NEUTRAL",
        trend: result.trend || "neutral",
        tradeGrade: result.tradeGrade,
        pattern: result.pattern,
        riskReward: result.riskReward,
        confidence: result.confidence || 3,
        result: result,
    };

    const history = getHistory();
    history.unshift(item);

    // Garder seulement MAX_HISTORY_ITEMS
    if (history.length > MAX_HISTORY_ITEMS) {
        history.splice(MAX_HISTORY_ITEMS);
    }

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
        // Si le stockage est plein, supprimer les anciens éléments
        console.warn("[HISTORY] Stockage plein, suppression des anciens éléments...");
        history.splice(Math.floor(MAX_HISTORY_ITEMS / 2));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }

    return item;
}

/**
 * Supprime une analyse de l'historique
 */
export function deleteAnalysis(id: string): void {
    const history = getHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
}

/**
 * Efface tout l'historique
 */
export function clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);
}

/**
 * Retourne le nombre d'analyses dans l'historique
 */
export function getHistoryCount(): number {
    return getHistory().length;
}
