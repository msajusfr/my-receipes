import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Recipe, RecipeDraft, RecipeSearchFilters } from '../types/recipe';
import * as recipeStorage from '../services/recipeStorage';

export function normalizeRecipeDraft(draft: RecipeDraft): Recipe {
  const now = new Date().toISOString();
  return {
    id: draft.id || crypto.randomUUID(),
    title: draft.title?.trim() || 'Recette sans titre',
    description: draft.description?.trim(),
    servings: draft.servings?.trim(),
    prepTime: draft.prepTime?.trim(),
    cookTime: draft.cookTime?.trim(),
    restTime: draft.restTime?.trim(),
    totalTime: draft.totalTime?.trim(),
    difficulty: draft.difficulty || '',
    ingredients: (draft.ingredients || []).filter((ingredient) => ingredient.name.trim()).map((ingredient) => ({ ...ingredient, id: ingredient.id || crypto.randomUUID() })),
    steps: (draft.steps || [])
      .filter((step) => step.text.trim())
      .map((step, index) => ({ ...step, id: step.id || crypto.randomUUID(), order: index + 1 })),
    notes: draft.notes?.trim(),
    tags: [...new Set((draft.tags || []).map((tag) => tag.trim().toLocaleLowerCase('fr-FR')).filter(Boolean))],
    images: draft.images || [],
    sourceText: draft.sourceText,
    createdAt: draft.createdAt || now,
    updatedAt: now
  };
}

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setRecipes(await recipeStorage.getRecipes());
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger les recettes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const save = useCallback(async (draft: RecipeDraft) => {
    const recipe = normalizeRecipeDraft(draft);
    const existing = await recipeStorage.getRecipeById(recipe.id);
    if (existing) await recipeStorage.updateRecipe({ ...recipe, createdAt: existing.createdAt, updatedAt: new Date().toISOString() });
    else await recipeStorage.saveRecipe(recipe);
    await refresh();
    return recipe;
  }, [refresh]);

  const remove = useCallback(async (id: string) => {
    await recipeStorage.deleteRecipe(id);
    await refresh();
  }, [refresh]);

  const allTags = useMemo(() => [...new Set(recipes.flatMap((recipe) => recipe.tags))].sort(), [recipes]);

  const search = useCallback((filters: RecipeSearchFilters) => recipeStorage.searchRecipes(filters), []);

  return { recipes, loading, error, allTags, refresh, save, remove, search };
}
