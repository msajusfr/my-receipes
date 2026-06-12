import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getOpenAI, model, readBody, sendJson } from './_shared.js';
import type { Recipe } from '../../src/types/recipe.js';

type Body = {
  recipe?: Recipe;
  message?: string;
  allowWebSearch?: boolean;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return sendJson(res, 405, { error: 'Methode non autorisee.' });

  try {
    const body = readBody<Body>(req.body);
    if (!body.recipe || !body.message?.trim()) {
      return sendJson(res, 400, { error: 'recipe et message sont obligatoires.' });
    }

    const client = getOpenAI();
    const tools = body.allowWebSearch ? [{ type: 'web_search_preview' }] : [];
    const response = await client.responses.create({
      model: model(),
      tools,
      input: [
        {
          role: 'system',
          content: body.allowWebSearch
            ? 'Tu aides Hui en cuisine. Reponds en francais, court et pratique. Utilise la recherche web si elle est disponible et utile.'
            : "Tu aides Hui en cuisine. Reponds en francais, court et pratique. La recherche web n'est pas active pour cette question."
        },
        {
          role: 'user',
          content: `Recette:\n${JSON.stringify(body.recipe)}\n\nQuestion:\n${body.message}`
        }
      ]
    } as any);

    return sendJson(res, 200, {
      answer: (response as any).output_text || "Je n'ai pas reussi a formuler une reponse.",
      sources: []
    });
  } catch (error) {
    const unavailable = bodyAllowsWebSearch(req.body);
    return sendJson(res, 500, {
      error: unavailable
        ? "Le chat IA n'est pas disponible ou la recherche web n'est pas supportee par ce modele."
        : error instanceof Error ? error.message : 'Erreur OpenAI.'
    });
  }
}

function bodyAllowsWebSearch(body: unknown) {
  try {
    const parsed = readBody<Body>(body);
    return Boolean(parsed.allowWebSearch);
  } catch {
    return false;
  }
}
