import { useMemo, useState } from 'react';
import type { Recipe, RecipeDraft, RecipeDifficulty, RecipeIngredient, RecipeStep } from '../types/recipe';
import { Button } from './Button';
import { ImageInput } from './ImageInput';

type RecipeFormProps = {
  initial?: RecipeDraft | Recipe;
  onSave: (draft: RecipeDraft) => Promise<void> | void;
  onCancel: () => void;
};

function emptyIngredient(): RecipeIngredient {
  return { id: crypto.randomUUID(), quantity: '', unit: '', name: '', note: '' };
}

function emptyStep(order: number): RecipeStep {
  return { id: crypto.randomUUID(), order, text: '' };
}

export function createEmptyRecipeDraft(): RecipeDraft {
  return {
    title: '',
    description: '',
    servings: '',
    prepTime: '',
    cookTime: '',
    restTime: '',
    totalTime: '',
    difficulty: '',
    ingredients: [emptyIngredient()],
    steps: [emptyStep(1)],
    notes: '',
    tags: [],
    images: []
  };
}

export function RecipeForm({ initial, onSave, onCancel }: RecipeFormProps) {
  const seed = useMemo(() => initial || createEmptyRecipeDraft(), [initial]);
  const [draft, setDraft] = useState<RecipeDraft>(seed);
  const [tagText, setTagText] = useState((seed.tags || []).join(', '));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function update<K extends keyof RecipeDraft>(key: K, value: RecipeDraft[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updateIngredient(id: string, patch: Partial<RecipeIngredient>) {
    update('ingredients', draft.ingredients.map((ingredient) => ingredient.id === id ? { ...ingredient, ...patch } : ingredient));
  }

  function updateStep(id: string, text: string) {
    update('steps', draft.steps.map((step) => step.id === id ? { ...step, text } : step));
  }

  function moveStep(id: string, direction: -1 | 1) {
    const steps = [...draft.steps];
    const index = steps.findIndex((step) => step.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= steps.length) return;
    [steps[index], steps[target]] = [steps[target], steps[index]];
    update('steps', steps.map((step, order) => ({ ...step, order: order + 1 })));
  }

  async function submit() {
    const cleanDraft = {
      ...draft,
      tags: tagText.split(',').map((tag) => tag.trim()).filter(Boolean)
    };

    if (!cleanDraft.title.trim()) {
      setError('Le titre est obligatoire.');
      return;
    }
    if (!cleanDraft.ingredients.some((ingredient) => ingredient.name.trim()) && !cleanDraft.steps.some((step) => step.text.trim())) {
      setError('Ajoutez au moins un ingredient ou une etape.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await onSave(cleanDraft);
    } catch (err) {
      setError(err instanceof Error ? err.message : "La recette n'a pas pu etre enregistree.");
    } finally {
      setSaving(false);
    }
  }

  const field = 'w-full rounded-2xl border border-ink/10 bg-cream/75 px-4 py-3 text-base text-ink outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20';
  const label = 'block text-sm font-semibold text-ink';

  return (
    <form className="space-y-5" onSubmit={(event) => { event.preventDefault(); submit(); }}>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={`${label} sm:col-span-2`}>
          Titre
          <input value={draft.title} onChange={(event) => update('title', event.target.value)} className={`${field} mt-1`} placeholder="Tarte tomate moutarde" />
        </label>
        <label className={`${label} sm:col-span-2`}>
          Description
          <textarea value={draft.description || ''} onChange={(event) => update('description', event.target.value)} className={`${field} mt-1 min-h-24`} placeholder="Une phrase courte pour reconnaitre la recette." />
        </label>
        <label className={label}>
          Personnes
          <input value={draft.servings || ''} onChange={(event) => update('servings', event.target.value)} className={`${field} mt-1`} placeholder="4 personnes" />
        </label>
        <label className={label}>
          Difficulte
          <select value={draft.difficulty || ''} onChange={(event) => update('difficulty', event.target.value as RecipeDifficulty)} className={`${field} mt-1`}>
            <option value="">Non precisee</option>
            <option value="facile">Facile</option>
            <option value="moyen">Moyen</option>
            <option value="difficile">Difficile</option>
          </select>
        </label>
        <label className={label}>
          Preparation
          <input value={draft.prepTime || ''} onChange={(event) => update('prepTime', event.target.value)} className={`${field} mt-1`} placeholder="15 min" />
        </label>
        <label className={label}>
          Cuisson
          <input value={draft.cookTime || ''} onChange={(event) => update('cookTime', event.target.value)} className={`${field} mt-1`} placeholder="35 min" />
        </label>
        <label className={label}>
          Repos
          <input value={draft.restTime || ''} onChange={(event) => update('restTime', event.target.value)} className={`${field} mt-1`} placeholder="1 h" />
        </label>
        <label className={label}>
          Temps total
          <input value={draft.totalTime || ''} onChange={(event) => update('totalTime', event.target.value)} className={`${field} mt-1`} placeholder="50 min" />
        </label>
      </div>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">Ingredients</h3>
          <Button type="button" variant="secondary" onClick={() => update('ingredients', [...draft.ingredients, emptyIngredient()])}>Ajouter</Button>
        </div>
        <div className="space-y-2">
          {draft.ingredients.map((ingredient) => (
            <div key={ingredient.id} className="grid gap-2 rounded-3xl border border-white/70 bg-white/40 p-3 sm:grid-cols-[0.8fr_0.8fr_2fr_1.4fr_auto]">
              <input aria-label="Quantite" value={ingredient.quantity || ''} onChange={(event) => updateIngredient(ingredient.id, { quantity: event.target.value })} className={field} placeholder="200" />
              <input aria-label="Unite" value={ingredient.unit || ''} onChange={(event) => updateIngredient(ingredient.id, { unit: event.target.value })} className={field} placeholder="g" />
              <input aria-label="Ingredient" value={ingredient.name} onChange={(event) => updateIngredient(ingredient.id, { name: event.target.value })} className={field} placeholder="farine" />
              <input aria-label="Note ingredient" value={ingredient.note || ''} onChange={(event) => updateIngredient(ingredient.id, { note: event.target.value })} className={field} placeholder="optionnel" />
              <Button type="button" variant="ghost" onClick={() => update('ingredients', draft.ingredients.filter((item) => item.id !== ingredient.id))}>Retirer</Button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">Etapes</h3>
          <Button type="button" variant="secondary" onClick={() => update('steps', [...draft.steps, emptyStep(draft.steps.length + 1)])}>Ajouter</Button>
        </div>
        <div className="space-y-2">
          {draft.steps.map((step, index) => (
            <div key={step.id} className="rounded-3xl border border-white/70 bg-white/40 p-3">
              <div className="mb-2 flex items-center justify-between gap-2">
                <span className="font-serif text-xl font-semibold text-terracotta">{index + 1}</span>
                <div className="flex gap-1">
                  <Button type="button" variant="ghost" onClick={() => moveStep(step.id, -1)} disabled={index === 0}>Monter</Button>
                  <Button type="button" variant="ghost" onClick={() => moveStep(step.id, 1)} disabled={index === draft.steps.length - 1}>Descendre</Button>
                  <Button type="button" variant="ghost" onClick={() => update('steps', draft.steps.filter((item) => item.id !== step.id))}>Retirer</Button>
                </div>
              </div>
              <textarea value={step.text} onChange={(event) => updateStep(step.id, event.target.value)} className={`${field} min-h-24`} placeholder="Decrivez cette etape." />
            </div>
          ))}
        </div>
      </section>

      <label className={label}>
        Notes
        <textarea value={draft.notes || ''} onChange={(event) => update('notes', event.target.value)} className={`${field} mt-1 min-h-28`} placeholder="Astuces, variantes, conservation..." />
      </label>
      <label className={label}>
        Tags
        <input value={tagText} onChange={(event) => setTagText(event.target.value)} className={`${field} mt-1`} placeholder="dessert, rapide, famille" />
      </label>

      <ImageInput images={draft.images} onChange={(images) => update('images', images)} />

      {error && <p className="rounded-2xl bg-terracotta/10 px-4 py-3 text-sm font-semibold text-terracotta">{error}</p>}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>Annuler</Button>
        <Button type="submit" disabled={saving}>{saving ? 'Enregistrement...' : 'Enregistrer'}</Button>
      </div>
    </form>
  );
}
