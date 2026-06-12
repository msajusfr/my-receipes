export type RecipeDifficulty = 'facile' | 'moyen' | 'difficile' | '';

export type RecipeIngredient = {
  id: string;
  quantity?: string;
  unit?: string;
  name: string;
  note?: string;
};

export type RecipeStep = {
  id: string;
  order: number;
  text: string;
};

export type RecipeImage = {
  id: string;
  dataUrl: string;
  alt?: string;
  createdAt: string;
};

export type Recipe = {
  id: string;
  title: string;
  description?: string;
  servings?: string;
  prepTime?: string;
  cookTime?: string;
  restTime?: string;
  totalTime?: string;
  difficulty?: RecipeDifficulty;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  notes?: string;
  tags: string[];
  images: RecipeImage[];
  sourceText?: string;
  createdAt: string;
  updatedAt: string;
};

export type RecipeDraft = Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type RecipeExport = {
  app: 'MyRecipes';
  version: 1;
  exportedAt: string;
  recipes: Recipe[];
};

export type RecipeSearchFilters = {
  query: string;
  tag?: string;
  difficulty?: RecipeDifficulty;
  withImages?: boolean;
  latestFirst?: boolean;
};
