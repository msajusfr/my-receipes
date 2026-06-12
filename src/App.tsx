import { useState } from 'react';
import { AiRecipeImporter } from './components/AiRecipeImporter';
import { AppShell } from './components/AppShell';
import { BackupPanel } from './components/BackupPanel';
import { RecipeDetail } from './components/RecipeDetail';
import { RecipeEditor } from './components/RecipeEditor';
import type { Recipe, RecipeDifficulty, RecipeDraft } from './types/recipe';
import { useRecipes } from './hooks/useRecipes';
import { useRecipeSearch } from './hooks/useRecipeSearch';
import { HomePage } from './pages/HomePage';

type Modal =
  | { type: 'none' }
  | { type: 'choice' }
  | { type: 'manual' }
  | { type: 'text' }
  | { type: 'photo' }
  | { type: 'edit'; recipe: Recipe }
  | { type: 'draft'; draft: RecipeDraft }
  | { type: 'detail'; recipe: Recipe }
  | { type: 'backup' };

export default function App() {
  const { recipes, loading, error, allTags, save, remove, refresh } = useRecipes();
  const [modal, setModal] = useState<Modal>({ type: 'none' });
  const [query, setQuery] = useState('');
  const [tag, setTag] = useState('');
  const [difficulty, setDifficulty] = useState<RecipeDifficulty>('');
  const [withImages, setWithImages] = useState(false);
  const visibleRecipes = useRecipeSearch(recipes, query, tag, difficulty, withImages);

  async function saveDraft(draft: RecipeDraft) {
    const saved = await save(draft);
    setModal({ type: 'detail', recipe: saved });
  }

  async function deleteSelected(recipe: Recipe) {
    const ok = window.confirm(`Supprimer "${recipe.title}" ?`);
    if (!ok) return;
    await remove(recipe.id);
    setModal({ type: 'none' });
  }

  return (
    <AppShell onAdd={() => setModal({ type: 'choice' })} onBackup={() => setModal({ type: 'backup' })}>
      {error && <p className="mb-4 rounded-2xl bg-terracotta/10 px-4 py-3 text-sm font-semibold text-terracotta">{error}</p>}
      <HomePage
        recipes={recipes}
        visibleRecipes={visibleRecipes}
        allTags={allTags}
        loading={loading}
        query={query}
        setQuery={setQuery}
        tag={tag}
        setTag={setTag}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        withImages={withImages}
        setWithImages={setWithImages}
        onAdd={() => setModal({ type: 'choice' })}
        onPaste={() => setModal({ type: 'text' })}
        onPhoto={() => setModal({ type: 'photo' })}
        onManual={() => setModal({ type: 'manual' })}
        onOpenRecipe={(recipe) => setModal({ type: 'detail', recipe })}
        onEditRecipe={(recipe) => setModal({ type: 'edit', recipe })}
      />

      {modal.type === 'choice' && (
        <div className="fixed inset-0 z-50 flex items-end bg-ink/35 px-3 py-4 backdrop-blur-sm sm:items-center">
          <section className="mx-auto w-full max-w-xl rounded-[34px] border border-white/70 bg-[#fffaf2]/95 p-5 shadow-soft sm:p-7">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-serif text-3xl font-semibold text-ink">Ajouter une recette</h2>
                <p className="mt-1 text-sm text-ink/60">Choisissez la maniere la plus rapide.</p>
              </div>
              <button onClick={() => setModal({ type: 'none' })} aria-label="Fermer" className="rounded-full bg-ink px-3 py-2 text-sm font-bold text-cream">x</button>
            </div>
            <div className="mt-5 grid gap-3">
              <button onClick={() => setModal({ type: 'text' })} className="rounded-[26px] bg-ink p-5 text-left font-semibold text-cream">Coller une recette<span className="mt-1 block text-sm font-medium text-cream/70">L'IA transforme le texte en brouillon.</span></button>
              <button onClick={() => setModal({ type: 'photo' })} className="rounded-[26px] bg-sage/25 p-5 text-left font-semibold text-ink">Photographier une recette<span className="mt-1 block text-sm font-medium text-ink/60">Capture mobile ou image existante.</span></button>
              <button onClick={() => setModal({ type: 'manual' })} className="rounded-[26px] bg-cream p-5 text-left font-semibold text-ink ring-1 ring-ink/10">Creer manuellement<span className="mt-1 block text-sm font-medium text-ink/60">Saisie complete sans IA.</span></button>
            </div>
          </section>
        </div>
      )}

      {modal.type === 'manual' && <RecipeEditor title="Nouvelle recette" onSave={saveDraft} onClose={() => setModal({ type: 'none' })} />}
      {modal.type === 'edit' && <RecipeEditor recipe={modal.recipe} onSave={saveDraft} onClose={() => setModal({ type: 'detail', recipe: modal.recipe })} />}
      {modal.type === 'draft' && <RecipeEditor title="Verifier le brouillon" recipe={modal.draft} onSave={saveDraft} onClose={() => setModal({ type: 'none' })} />}
      {modal.type === 'text' && <AiRecipeImporter mode="text" onDraft={(draft) => setModal({ type: 'draft', draft })} onClose={() => setModal({ type: 'none' })} />}
      {modal.type === 'photo' && <AiRecipeImporter mode="photo" onDraft={(draft) => setModal({ type: 'draft', draft })} onClose={() => setModal({ type: 'none' })} />}
      {modal.type === 'detail' && <RecipeDetail recipe={modal.recipe} onClose={() => setModal({ type: 'none' })} onEdit={() => setModal({ type: 'edit', recipe: modal.recipe })} onDelete={() => deleteSelected(modal.recipe)} />}
      {modal.type === 'backup' && <BackupPanel recipes={recipes} onClose={() => setModal({ type: 'none' })} onImported={refresh} />}
    </AppShell>
  );
}
