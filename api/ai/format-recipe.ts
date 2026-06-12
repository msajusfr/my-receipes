import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getOpenAI, model, normalizeRecipeDraft, parseJsonObject, readBody, recipeJsonInstruction, sendError, sendJson } from './_shared.js';

type Body = {
  sourceText?: string;
  locale?: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Methode non autorisee.' });

  try {
    const body = readBody<Body>(req.body);
    const sourceText = body.sourceText?.trim();
    if (!sourceText) return sendJson(res, 400, { error: 'sourceText est obligatoire.' });

    const client = getOpenAI();
    const response = await client.chat.completions.create({
      model: model(),
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant culinaire. Transforme une recette brute en JSON structure. Reponds uniquement avec du JSON valide. Ne cree pas d’informations inventees. Si une information manque, laisse le champ vide. Normalise les ingredients et les etapes en francais clair. Conserve le style familial de la recette. Ne mets pas de markdown.'
        },
        {
          role: 'user',
          content: `${recipeJsonInstruction}\n\nLocale: ${body.locale || 'fr-FR'}\n\nRecette brute:\n${sourceText}`
        }
      ]
    });

    const json = parseJsonObject(response.choices[0]?.message?.content || '{}');
    return sendJson(res, 200, { recipe: normalizeRecipeDraft(json, sourceText) });
  } catch (error) {
    return sendError(res, error, 'Erreur OpenAI pendant le formatage texte.');
  }
}
