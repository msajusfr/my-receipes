import type { Recipe, RecipeSearchFilters } from '../types/recipe';

const DB_NAME = 'myrecipes-db';
const STORE_NAME = 'recipes';
const DB_VERSION = 1;

let dbPromise: Promise<IDBDatabase> | null = null;

function openDb() {
  if (dbPromise) return dbPromise;

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('updatedAt', 'updatedAt');
        store.createIndex('title', 'title');
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  return dbPromise;
}

async function tx<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => IDBRequest<T> | void) {
  const db = await openDb();
  return new Promise<T>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, mode);
    const store = transaction.objectStore(STORE_NAME);
    const request = run(store);
    let value: T;

    if (request) {
      request.onsuccess = () => {
        value = request.result;
      };
      request.onerror = () => reject(request.error);
    }

    transaction.oncomplete = () => resolve(value);
    transaction.onerror = () => reject(transaction.error);
  });
}

export async function getRecipes(): Promise<Recipe[]> {
  const recipes = await tx<Recipe[]>('readonly', (store) => store.getAll());
  return recipes.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getRecipeById(id: string): Promise<Recipe | undefined> {
  return tx<Recipe | undefined>('readonly', (store) => store.get(id));
}

export async function saveRecipe(recipe: Recipe): Promise<Recipe> {
  await tx<IDBValidKey>('readwrite', (store) => store.add(recipe));
  return recipe;
}

export async function updateRecipe(recipe: Recipe): Promise<Recipe> {
  await tx<IDBValidKey>('readwrite', (store) => store.put(recipe));
  return recipe;
}

export async function deleteRecipe(id: string): Promise<void> {
  await tx<undefined>('readwrite', (store) => store.delete(id));
}

export async function importRecipes(recipes: Recipe[]): Promise<{ imported: number; skipped: number }> {
  const existing = await getRecipes();
  const existingIds = new Set(existing.map((recipe) => recipe.id));
  let imported = 0;
  let skipped = 0;

  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    for (const recipe of recipes) {
      if (existingIds.has(recipe.id)) {
        const copy = { ...recipe, id: crypto.randomUUID(), updatedAt: new Date().toISOString() };
        store.put(copy);
        imported += 1;
        continue;
      }
      if (!recipe.title || (!recipe.ingredients?.length && !recipe.steps?.length)) {
        skipped += 1;
        continue;
      }
      store.put(recipe);
      imported += 1;
    }

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
  });

  return { imported, skipped };
}

export async function exportRecipes(): Promise<Recipe[]> {
  return getRecipes();
}

export async function searchRecipes(filters: RecipeSearchFilters): Promise<Recipe[]> {
  const recipes = await getRecipes();
  const query = filters.query.trim().toLocaleLowerCase('fr-FR');

  return recipes
    .filter((recipe) => {
      if (filters.tag && !recipe.tags.includes(filters.tag)) return false;
      if (filters.difficulty && recipe.difficulty !== filters.difficulty) return false;
      if (filters.withImages && recipe.images.length === 0) return false;
      if (!query) return true;

      const searchable = [
        recipe.title,
        recipe.description,
        recipe.notes,
        recipe.tags.join(' '),
        recipe.ingredients.map((ingredient) => `${ingredient.quantity ?? ''} ${ingredient.unit ?? ''} ${ingredient.name} ${ingredient.note ?? ''}`).join(' '),
        recipe.steps.map((step) => step.text).join(' '),
        recipe.sourceText
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('fr-FR');

      return searchable.includes(query);
    })
    .sort((a, b) => (filters.latestFirst === false ? a.updatedAt.localeCompare(b.updatedAt) : b.updatedAt.localeCompare(a.updatedAt)));
}
