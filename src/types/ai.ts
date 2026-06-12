import type { Recipe, RecipeDraft } from './recipe';

export type FormatRecipeTextRequest = {
  sourceText: string;
  locale?: string;
};

export type FormatRecipeImageRequest = {
  imageDataUrl: string;
  optionalHint?: string;
  locale?: string;
};

export type FormatRecipeResponse = {
  recipe: RecipeDraft;
  warning?: string;
};

export type RecipeChatRequest = {
  recipe: Recipe;
  message: string;
  allowWebSearch?: boolean;
};

export type RecipeChatResponse = {
  answer: string;
  sources?: Array<{ title?: string; url?: string }>;
};
