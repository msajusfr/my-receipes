import type { Recipe, RecipeExport } from '../types/recipe';

export function createExport(recipes: Recipe[]): RecipeExport {
  return {
    app: 'MyRecipes',
    version: 1,
    exportedAt: new Date().toISOString(),
    recipes
  };
}

export function downloadRecipesExport(recipes: Recipe[]) {
  const data = createExport(recipes);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `myrecipes-sauvegarde-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
  localStorage.setItem('myrecipes:lastExportAt', data.exportedAt);
}

export async function readRecipesExport(file: File): Promise<RecipeExport> {
  const text = await file.text();
  const data = JSON.parse(text) as Partial<RecipeExport>;

  if (data.app !== 'MyRecipes' || data.version !== 1 || !Array.isArray(data.recipes)) {
    throw new Error('Ce fichier ne ressemble pas a une sauvegarde MyRecipes valide.');
  }

  return data as RecipeExport;
}

export function getLastExportAt() {
  return localStorage.getItem('myrecipes:lastExportAt');
}
