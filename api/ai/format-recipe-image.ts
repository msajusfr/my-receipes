import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getOpenAI, model, normalizeRecipeDraft, parseJsonObject, readBody, recipeJsonInstruction, sendError, sendJson } from './_shared.js';

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
    const response = await client.chat.completions.create({
      model: model(),
      temperature: 0.1,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: 'Tu es un assistant culinaire francais. Lis le contenu visible sur une image de recette et retourne uniquement un JSON valide. Ne fais pas de markdown. Si une information manque, laisse le champ vide.'
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `${recipeJsonInstruction}\n\nLocale: ${body.locale || 'fr-FR'}\nIndice optionnel: ${body.optionalHint || ''}`
            },
            { type: 'image_url', image_url: { url: body.imageDataUrl } }
          ]
        }
      ]
    });

    const json = parseJsonObject(response.choices[0]?.message?.content || '{}');
    return sendJson(res, 200, { recipe: normalizeRecipeDraft(json) });
  } catch (error) {
    return sendError(res, error, 'Erreur OpenAI pendant le formatage image.');
  }
}
