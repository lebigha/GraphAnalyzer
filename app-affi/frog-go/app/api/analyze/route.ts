import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// ============================================================================
// CONFIGURATION
// ============================================================================

// Modèle Groq pour l'analyse d'images (Llama 4 Scout - recommandé par Groq)
const VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

// Température basse pour des réponses cohérentes et précises
const TEMPERATURE = 0;

// Tokens maximum pour la réponse
const MAX_TOKENS = 2048;

// ============================================================================
// INITIALISATION DU CLIENT GROQ
// ============================================================================

const groq = process.env.GROQ_API_KEY
    ? new Groq({ apiKey: process.env.GROQ_API_KEY })
    : null;

// ============================================================================
// PROMPT D'ANALYSE
// ============================================================================

function getAnalysisPrompt(lang: string = "en") {
    const isFr = lang === "fr";

    return isFr
        ? `Tu es un analyste technique expert en trading avec 20 ans d'expérience. Tu dois analyser ce graphique de trading de manière TRÈS DÉTAILLÉE et PROFESSIONNELLE.

INSTRUCTIONS IMPORTANTES:
1. Toutes les réponses doivent être en FRANÇAIS
2. Sois PRÉCIS et SPÉCIFIQUE dans ton analyse
3. Utilise le jargon technique approprié
4. Fournis des niveaux de prix CONCRETS quand c'est visible

IMPORTANT - ACCEPTATION DES IMAGES:
- Accepte les SCREENSHOTS de graphiques (TradingView, Binance, MetaTrader, etc.)
- Accepte les PHOTOS prises avec un téléphone d'un écran d'ordinateur ou téléphone montrant un graphique
- Accepte les graphiques même s'ils sont légèrement flous, inclinés ou avec des reflets
- Si tu vois des chandeliers (candlesticks), des lignes de prix, des axes avec des prix/dates, c'est un graphique VALIDE
- En cas de doute, considère que c'est un graphique et analyse-le

Retourne UNIQUEMENT du JSON valide avec cette structure:
{
  "isValid": true,
  "trend": "bullish" | "bearish" | "neutral",
  "signal": "BULLISH" | "BEARISH" | "NEUTRAL",
  "tradeGrade": "A" | "B" | "C" (A = setup excellent, B = correct, C = à éviter),
  "marketStructure": "string (description de la structure: higher highs/lows, range, etc.)",
  "pattern": "string (pattern identifié: double bottom, triangle, etc.) or null",
  "support": number,
  "resistance": number,
  "stopLoss": number,
  "target1": number,
  "target2": number,
  "riskReward": "string (ex: 1:2.5)",
  "rsi": number or null,
  "macd": "string or null",
  "ema": "string or null",
  "volume": "string (ex: 'Volume croissant', 'Volume faible')",
  "confidence": 1-5,
  "keyObservations": ["string", "string", "string"],
  "whyThisTrade": "string (2-3 phrases expliquant POURQUOI ce trade est intéressant)",
  "invalidation": "string (conditions qui invalideraient ce trade)",
  "actionSteps": ["string", "string", "string"],
  "bestEntry": "string (moment idéal pour entrer)",
  "dangerZones": ["string", "string"],
  "mistakesToAvoid": ["string", "string"],
  "marketContext": "string (contexte général du marché)",
  "timeEstimate": "string (temps estimé pour que le trade se joue)",
  "analysisSummary": "string (résumé court de l'analyse)",
  "projection": { "direction": "up" | "down" | "sideways", "percentage": number },
  "narrative": "string (explication excitante et motivante du scénario)"
}

SEULEMENT si tu ne peux PAS analyser l'image, retourne ce JSON avec une raison SPÉCIFIQUE et UTILE:
{
  "isValid": false,
  "reason": "RAISON SPÉCIFIQUE ICI",
  "suggestion": "CONSEIL POUR AMÉLIORER LA PHOTO"
}

IMPORTANT: Essaie TOUJOURS d'analyser le graphique si tu vois des chandeliers ou des courbes de prix. Ne rejette que si c'est vraiment impossible.`
        : `You are an expert technical analyst in trading with 20 years of experience. You must analyze this trading chart in a VERY DETAILED and PROFESSIONAL manner.

IMPORTANT INSTRUCTIONS:
1. All responses must be in ENGLISH
2. Be PRECISE and SPECIFIC in your analysis
3. Use appropriate technical jargon
4. Provide CONCRETE price levels when visible

IMPORTANT - IMAGE ACCEPTANCE:
- Accept SCREENSHOTS of charts (TradingView, Binance, MetaTrader, etc.)
- Accept PHOTOS taken with a phone of a computer or phone screen showing a chart
- Accept charts even if they are slightly blurry, tilted, or have reflections
- If you see candlesticks, price lines, axes with prices/dates, it's a VALID chart
- When in doubt, consider it a chart and analyze it

Return ONLY valid JSON with this structure:
{
  "isValid": true,
  "trend": "bullish" | "bearish" | "neutral",
  "signal": "BULLISH" | "BEARISH" | "NEUTRAL",
  "tradeGrade": "A" | "B" | "C" (A = excellent setup, B = decent, C = avoid),
  "marketStructure": "string (structure description: higher highs/lows, range, etc.)",
  "pattern": "string (identified pattern: double bottom, triangle, etc.) or null",
  "support": number,
  "resistance": number,
  "stopLoss": number,
  "target1": number,
  "target2": number,
  "riskReward": "string (e.g.: 1:2.5)",
  "rsi": number or null,
  "macd": "string or null",
  "ema": "string or null",
  "volume": "string (e.g.: 'Increasing volume', 'Low volume')",
  "confidence": 1-5,
  "keyObservations": ["string", "string", "string"],
  "whyThisTrade": "string (2-3 sentences explaining WHY this trade is interesting)",
  "invalidation": "string (conditions that would invalidate this trade)",
  "actionSteps": ["string", "string", "string"],
  "bestEntry": "string (ideal entry timing)",
  "dangerZones": ["string", "string"],
  "mistakesToAvoid": ["string", "string"],
  "marketContext": "string (general market context)",
  "timeEstimate": "string (estimated time for the trade to play out)",
  "analysisSummary": "string (short analysis summary)",
  "projection": { "direction": "up" | "down" | "sideways", "percentage": number },
  "narrative": "string (exciting and motivating scenario explanation)"
}

ONLY if you CANNOT analyze the image, return this JSON with a SPECIFIC and HELPFUL reason:
{
  "isValid": false,
  "reason": "SPECIFIC REASON HERE",
  "suggestion": "TIP TO IMPROVE THE PHOTO"
}

IMPORTANT: ALWAYS try to analyze the chart if you see candlesticks or price curves. Only reject if it is truly impossible.`;
}

// ============================================================================
// ROUTE API - POST
// ============================================================================

// Maximum image size: 5MB in base64 (base64 is ~33% larger than binary)
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024 * 1.33; // ~6.65MB in base64

export async function POST(request: NextRequest) {
    try {
        console.log("[ANALYZE] Requête reçue");

        // Parse request body with size check
        let body;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { isValid: false, reason: "Format de requête invalide." },
                { status: 400 }
            );
        }

        const { image, lang } = body;

        // Validate image presence
        if (!image) {
            console.error("[ANALYZE] Aucune image fournie");
            return NextResponse.json(
                { isValid: false, reason: "Aucune image fournie." },
                { status: 400 }
            );
        }

        // Validate image is a string
        if (typeof image !== "string") {
            return NextResponse.json(
                { isValid: false, reason: "Format d'image invalide." },
                { status: 400 }
            );
        }

        // Validate base64 format (data:image/xxx;base64,...)
        const base64Regex = /^data:image\/(png|jpeg|jpg|gif|webp);base64,/;
        if (!base64Regex.test(image)) {
            return NextResponse.json(
                { isValid: false, reason: "Format d'image non supporté. Utilisez PNG, JPEG, GIF ou WebP." },
                { status: 400 }
            );
        }

        // Validate image size (max 5MB)
        if (image.length > MAX_IMAGE_SIZE_BYTES) {
            console.warn("[ANALYZE] Image trop grande:", image.length);
            return NextResponse.json(
                { isValid: false, reason: "Image trop volumineuse. Maximum 5MB autorisé." },
                { status: 413 }
            );
        }

        console.log("[ANALYZE] Image validée, taille:", image.length);

        // Vérification que le client Groq est initialisé
        if (!groq) {
            console.error("[ANALYZE] Client Groq non initialisé - Clé API manquante");
            return NextResponse.json(
                { isValid: false, reason: "API non configurée. Vérifiez votre clé GROQ_API_KEY." },
                { status: 500 }
            );
        }

        // Lancement de l'analyse
        console.log("[ANALYZE] Appel à Groq avec le modèle:", VISION_MODEL);
        return await analyzeChartWithGroq(image, lang || "en");

    } catch (error) {
        console.error("[ANALYZE] Erreur critique:", error);
        return NextResponse.json(
            { isValid: false, reason: `Erreur interne: ${error}` },
            { status: 500 }
        );
    }
}

// ============================================================================
// FONCTION D'ANALYSE
// ============================================================================

async function analyzeChartWithGroq(imageBase64: string, lang: string = "en") {
    if (!groq) {
        throw new Error("Client Groq non initialisé");
    }

    try {
        // Appel à l'API Groq avec le modèle vision
        const completion = await groq.chat.completions.create({
            messages: [{
                role: "user",
                content: [
                    { type: "text", text: getAnalysisPrompt(lang) },
                    { type: "image_url", image_url: { url: imageBase64 } },
                ],
            }],
            model: VISION_MODEL,
            temperature: TEMPERATURE,
            max_tokens: MAX_TOKENS,
            response_format: { type: "json_object" },
        });

        // Extraction de la réponse
        const content = completion.choices[0]?.message?.content;

        if (!content) {
            throw new Error("Réponse vide du modèle");
        }

        // Parse du JSON
        const analysis = JSON.parse(content);

        // Assurer que isValid est défini
        if (analysis.isValid === undefined) {
            analysis.isValid = true;
        }

        console.log("[ANALYZE] Analyse terminée avec succès");
        return NextResponse.json(analysis);

    } catch (err) {
        console.error("[GROQ] Erreur:", err);
        throw err;
    }
}
