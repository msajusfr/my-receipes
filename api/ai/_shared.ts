import OpenAI from 'openai';
import type { RecipeDraft, RecipeDifficulty } from '../../src/types/recipe.js';

export function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY est manquante cote serveur.');
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

export function model() {
  return process.env.OPENAI_MODEL || 'gpt-4.1-mini';
}

export function sendJson(res: { status: (code: number) => { json: (body: unknown) => void } }, status: number, body: unknown) {
  res.status(status).json(body);
}

export function readBody<T>(body: unknown): T {
  if (typeof body === 'string') return JSON.parse(body) as T;
  return body as T;
}

function cleanText(value: unknown) {
  if (typeof value !== 'string') return '';
  return value.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

function difficulty(value: unknown): RecipeDifficulty {
  return value === 'facile' || value === 'moyen' || value === 'difficile' ? value : '';
}

export function normalizeRecipeDraft(input: unknown, sourceText?: string): RecipeDraft {
  const value = (input && typeof input === 'object' ? input : {}) as Record<string, unknown>;
  const ingredients = Array.isArray(value.ingredients) ? value.ingredients : [];
  const steps = Array.isArray(value.steps) ? value.steps : [];
  const tags = Array.isArray(value.tags) ? value.tags : [];

  const draft: RecipeDraft = {
    title: cleanText(value.title) || 'Recette a verifier',
    description: cleanText(value.description),
    servings: cleanText(value.servings),
    prepTime: cleanText(value.prepTime),
    cookTime: cleanText(value.cookTime),
    restTime: cleanText(value.restTime),
    totalTime: cleanText(value.totalTime),
    difficulty: difficulty(value.difficulty),
    ingredients: ingredients
      .map((item) => {
        const ingredient = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
        return {
          id: crypto.randomUUID(),
          quantity: cleanText(ingredient.quantity),
          unit: cleanText(ingredient.unit),
          name: cleanText(ingredient.name),
          note: cleanText(ingredient.note)
        };
      })
      .filter((item) => item.name),
    steps: steps
      .map((item, index) => {
        const step = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
        return {
          id: crypto.randomUUID(),
          order: index + 1,
          text: cleanText(step.text || item)
        };
      })
      .filter((item) => item.text),
    notes: cleanText(value.notes),
    tags: tags.map(cleanText).filter(Boolean),
    images: [],
    sourceText
  };

  if (draft.ingredients.length === 0 && draft.steps.length === 0 && sourceText) {
    draft.steps = [{ id: crypto.randomUUID(), order: 1, text: sourceText.slice(0, 1600) }];
  }

  return draft;
}

export function parseJsonObject(text: string) {
  const trimmed = text.trim().replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```$/i, '').trim();
  return JSON.parse(trimmed);
}

export const recipeJsonInstruction = `Retourne uniquement un objet JSON valide avec ces champs:
{
  "title": "string",
  "description": "string",
  "servings": "string",
  "prepTime": "string",
  "cookTime": "string",
  "restTime": "string",
  "totalTime": "string",
  "difficulty": "facile|moyen|difficile|",
  "ingredients": [{"quantity":"string","unit":"string","name":"string","note":"string"}],
  "steps": [{"order":1,"text":"string"}],
  "notes": "string",
  "tags": ["string"]
}`;
