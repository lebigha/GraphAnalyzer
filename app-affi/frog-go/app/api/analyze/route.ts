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

const ANALYSIS_PROMPT = `Tu es un analyste technique expert en trading avec 20 ans d'expérience. Tu dois analyser ce graphique de trading de manière TRÈS DÉTAILLÉE et PROFESSIONNELLE.

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
  
  "keyObservations": [
    "string (observation clé 1)",
    "string (observation clé 2)",
    "string (observation clé 3)"
  ],
  
  "whyThisTrade": "string (2-3 phrases expliquant POURQUOI ce trade est intéressant)",
  
  "invalidation": "string (conditions qui invalideraient ce trade)",
  
  "actionSteps": [
    "string (étape 1)",
    "string (étape 2)",
    "string (étape 3)"
  ],
  
  "bestEntry": "string (moment idéal pour entrer, ex: 'Attendre un pullback vers 42500' ou 'Entrer sur cassure de 45000 avec volume')",
  
  "dangerZones": [
    "string (zone de danger 1, ex: 'Zone de liquidité à 41500 - risque de mèche')",
    "string (zone de danger 2, ex: 'Résistance forte à 46000 - prendre profits partiels')"
  ],
  
  "mistakesToAvoid": [
    "string (erreur 1 à éviter, ex: 'Ne pas entrer avant confirmation du breakout')",
    "string (erreur 2 à éviter, ex: 'Éviter de mettre le stop trop serré sous 42000')"
  ],
  
  "marketContext": "string (contexte général du marché, ex: 'BTC en tendance haussière sur le Daily, ce setup s'aligne avec la tendance principale')",
  
  "timeEstimate": "string (temps estimé pour que le trade se joue, ex: '4-12 heures' ou '2-3 jours')",
  
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

Exemples de raisons possibles (adapte selon ce que tu vois):
- "📷 Photo trop floue - Les chandeliers ne sont pas lisibles" + suggestion: "Tenez le téléphone stable et faites la mise au point sur l'écran"
- "🔄 Angle trop incliné - Le graphique est difficilement visible" + suggestion: "Prenez la photo bien en face de l'écran"
- "💡 Trop de reflets sur l'écran" + suggestion: "Évitez les sources de lumière derrière vous"
- "🔍 Graphique trop petit dans l'image" + suggestion: "Zoomez sur le graphique ou rapprochez-vous"
- "⬛ Image trop sombre" + suggestion: "Augmentez la luminosité de l'écran"
- "🖼️ Ceci n'est pas un graphique de trading" + suggestion: "Uploadez une capture d'écran ou photo d'un graphique financier (chandeliers, courbes, etc.)"
- "📊 Je ne vois pas assez de données sur le graphique" + suggestion: "Assurez-vous que le graphique montre au moins 20-30 chandeliers"

IMPORTANT: Essaie TOUJOURS d'analyser le graphique si tu vois des chandeliers ou des courbes de prix. Ne rejette que si c'est vraiment impossible.`;

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

        const { image } = body;

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
        return await analyzeChartWithGroq(image);

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

async function analyzeChartWithGroq(imageBase64: string) {
    if (!groq) {
        throw new Error("Client Groq non initialisé");
    }

    try {
        // Appel à l'API Groq avec le modèle vision
        const completion = await groq.chat.completions.create({
            messages: [{
                role: "user",
                content: [
                    { type: "text", text: ANALYSIS_PROMPT },
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
