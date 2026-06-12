import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getOpenAI, model, normalizeRecipeDraft, parseJsonObject, readBody, recipeJsonInstruction, sendJson } from './_shared';

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
    const response = await client.responses.create({
      model: model(),
      input: [
        {
          role: 'system',
          content: 'Tu es un assistant culinaire. Transforme une recette brute en JSON structure. Reponds uniquement avec du JSON valide. Ne cree pas d’informations inventees. Si une information manque, laisse le champ vide. Normalise les ingredients et les etapes en francais clair. Conserve le style familial de la recette. Ne mets pas de markdown.'
        },
        {
          role: 'user',
          content: `${recipeJsonInstruction}\n\nLocale: ${body.locale || 'fr-FR'}\n\nRecette brute:\n${sourceText}`
        }
      ],
      text: { format: { type: 'json_object' } }
    } as any);

    const json = parseJsonObject((response as any).output_text || '{}');
    return sendJson(res, 200, { recipe: normalizeRecipeDraft(json, sourceText) });
  } catch (error) {
    return sendJson(res, 500, { error: error instanceof Error ? error.message : 'Erreur OpenAI.' });
  }
}
