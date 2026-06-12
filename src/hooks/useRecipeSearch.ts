import { useMemo } from 'react';
import type { Recipe, RecipeDifficulty } from '../types/recipe';

export function useRecipeSearch(recipes: Recipe[], query: string, tag: string, difficulty: RecipeDifficulty, withImages: boolean) {
  return useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('fr-FR');
    return recipes.filter((recipe) => {
      if (tag && !recipe.tags.includes(tag)) return false;
      if (difficulty && recipe.difficulty !== difficulty) return false;
      if (withImages && recipe.images.length === 0) return false;
      if (!normalized) return true;

      const text = [
        recipe.title,
        recipe.description,
        recipe.notes,
        recipe.tags.join(' '),
        recipe.ingredients.map((ingredient) => ingredient.name).join(' '),
        recipe.steps.map((step) => step.text).join(' ')
      ].join(' ').toLocaleLowerCase('fr-FR');

      return text.includes(normalized);
    });
  }, [recipes, query, tag, difficulty, withImages]);
}
