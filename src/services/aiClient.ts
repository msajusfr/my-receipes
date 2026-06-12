import type { FormatRecipeResponse, RecipeChatResponse } from '../types/ai';
import type { Recipe, RecipeDraft } from '../types/recipe';

async function requestJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Le service IA n'est pas disponible pour le moment.");
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
