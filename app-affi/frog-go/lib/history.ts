// ============================================================================
// HISTORIQUE DES ANALYSES - FROG AI
// Hybrid storage: Supabase DB for logged-in users + localStorage fallback
// ============================================================================

"use client";

import { createClient } from "@/lib/supabase/client";

// ============================================================================
// TYPES
// ============================================================================

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
// THUMBNAIL UTILITY
// ============================================================================

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

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

// ============================================================================
// SUPABASE HELPERS
// ============================================================================

async function getUser() {
    try {
        const supabase = createClient();
        if (!supabase) return null;
        const { data } = await supabase.auth.getUser();
        return data?.user || null;
    } catch {
        return null;
    }
}

// ============================================================================
// LOCAL STORAGE FUNCTIONS (fallback)
// ============================================================================

function getLocalHistory(): AnalysisHistoryItem[] {
    if (typeof window === "undefined") return [];
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    } catch {
        return [];
    }
}

function saveLocalHistory(history: AnalysisHistoryItem[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch {
        history.splice(Math.floor(MAX_HISTORY_ITEMS / 2));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    }
}

// ============================================================================
// PUBLIC API
// ============================================================================

/**
 * Get analysis history. If user is logged in, fetches from Supabase.
 * Falls back to localStorage.
 */
export function getHistory(): AnalysisHistoryItem[] {
    // Synchronous: always return localStorage for immediate display
    return getLocalHistory();
}

/**
 * Async version: fetches from Supabase if user is logged in
 */
export async function getHistoryAsync(): Promise<AnalysisHistoryItem[]> {
    const user = await getUser();

    if (user) {
        try {
            const supabase = createClient();
            if (supabase) {
                const { data, error } = await supabase
                    .from("analyses")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false })
                    .limit(MAX_HISTORY_ITEMS);

                if (!error && data && data.length > 0) {
                    return data.map((row: Record<string, unknown>) => ({
                        id: row.id as string,
                        timestamp: new Date(row.created_at as string).getTime(),
                        imageThumbnail: (row.image_thumbnail as string) || "",
                        signal: (row.signal as string) || "NEUTRAL",
                        trend: (row.trend as string) || "neutral",
                        tradeGrade: row.trade_grade as string | undefined,
                        pattern: row.pattern as string | undefined,
                        riskReward: row.risk_reward as string | undefined,
                        confidence: (row.confidence as number) || 3,
                        result: row.result as AnalysisResult,
                    }));
                }
            }
        } catch (err) {
            console.warn("[HISTORY] Supabase fetch failed, using localStorage:", err);
        }
    }

    return getLocalHistory();
}

/**
 * Save analysis to both localStorage and Supabase (if logged in)
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

    // Always save to localStorage (immediate)
    const history = getLocalHistory();
    history.unshift(item);
    if (history.length > MAX_HISTORY_ITEMS) {
        history.splice(MAX_HISTORY_ITEMS);
    }
    saveLocalHistory(history);

    // Also save to Supabase if user is logged in (async, non-blocking)
    const user = await getUser();
    if (user) {
        try {
            const supabase = createClient();
            if (supabase) {
                await supabase.from("analyses").insert({
                    user_id: user.id,
                    image_thumbnail: thumbnail,
                    signal: result.signal || "NEUTRAL",
                    trend: result.trend || "neutral",
                    trade_grade: result.tradeGrade,
                    pattern: result.pattern,
                    risk_reward: result.riskReward,
                    confidence: result.confidence || 3,
                    result: result,
                });
            }
        } catch (err) {
            console.warn("[HISTORY] Supabase save failed:", err);
        }
    }

    return item;
}

/**
 * Delete analysis from localStorage and Supabase
 */
export function deleteAnalysis(id: string): void {
    const history = getLocalHistory();
    const filtered = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    // Also delete from Supabase (async, non-blocking)
    getUser().then(user => {
        if (user) {
            const supabase = createClient();
            if (supabase) {
                supabase.from("analyses").delete().eq("id", id).then(() => { });
            }
        }
    });
}

/**
 * Clear all history from localStorage and Supabase
 */
export function clearHistory(): void {
    localStorage.removeItem(STORAGE_KEY);

    // Also clear from Supabase (async, non-blocking)
    getUser().then(user => {
        if (user) {
            const supabase = createClient();
            if (supabase) {
                supabase.from("analyses").delete().eq("user_id", user.id).then(() => { });
            }
        }
    });
}

/**
 * Get history count
 */
export function getHistoryCount(): number {
    return getLocalHistory().length;
}
