import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getOpenAI, model, normalizeRecipeDraft, parseJsonObject, readBody, recipeJsonInstruction, sendJson } from './_shared';

type Body = {
  imageDataUrl?: string;
  optionalHint?: string;
  locale?: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Methode non autorisee.' });

  try {
    const body = readBody<Body>(req.body);
    if (!body.imageDataUrl?.startsWith('data:image/')) {
      return sendJson(res, 400, { error: 'imageDataUrl doit contenir une image en dataUrl.' });
    }

    const client = getOpenAI();
    const response = await client.responses.create({
      model: model(),
      input: [
        {
          role: 'system',
          content: 'Tu es un assistant culinaire francais. Lis le contenu visible sur une image de recette et retourne uniquement un JSON valide. Ne fais pas de markdown. Si une information manque, laisse le champ vide.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: `${recipeJsonInstruction}\n\nLocale: ${body.locale || 'fr-FR'}\nIndice optionnel: ${body.optionalHint || ''}`
            },
            { type: 'input_image', image_url: body.imageDataUrl }
          ]
        }
      ],
      text: { format: { type: 'json_object' } }
    } as any);

    const json = parseJsonObject((response as any).output_text || '{}');
    return sendJson(res, 200, { recipe: normalizeRecipeDraft(json) });
  } catch (error) {
    return sendJson(res, 500, { error: error instanceof Error ? error.message : 'Erreur OpenAI vision.' });
  }
}
