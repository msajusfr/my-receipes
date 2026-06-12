import type { FormatRecipeResponse, RecipeChatResponse } from '../types/ai';
import type { Recipe, RecipeDraft } from '../types/recipe';

async function requestJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const contentType = response.headers.get('content-type') || '';
  const rawText = contentType.includes('application/json') ? '' : await response.text().catch(() => '');
  const data = contentType.includes('application/json') ? await response.json().catch(() => ({})) : {};
  if (!response.ok) {
    if (response.status === 404 && url.startsWith('/api/')) {
      throw new Error(
        "Les fonctions IA ne sont pas lancees sur ce serveur local. Utilisez le deploiement Vercel, ou lancez l'app avec `vercel dev` apres avoir configure OPENAI_API_KEY."
      );
    }
    const detail = data.error || rawText.slice(0, 180);
    throw new Error(detail || `Le service IA n'est pas disponible pour le moment. Code HTTP ${response.status}.`);
  }
  return data as T;
}

export async function formatRecipeFromText(sourceText: string): Promise<RecipeDraft> {
  const data = await requestJson<FormatRecipeResponse>('/api/ai/format-recipe', {
    sourceText,
    locale: 'fr-FR'
  });
  return data.recipe;
}

export async function formatRecipeFromImage(imageDataUrl: string, optionalHint?: string): Promise<RecipeDraft> {
  const data = await requestJson<FormatRecipeResponse>('/api/ai/format-recipe-image', {
    imageDataUrl,
    optionalHint,
    locale: 'fr-FR'
  });
  return data.recipe;
}

export async function chatAboutRecipe(recipe: Recipe, message: string, allowWebSearch = false): Promise<RecipeChatResponse> {
  return requestJson<RecipeChatResponse>('/api/ai/chat-recipe', {
    recipe,
    message,
    allowWebSearch
  });
}
