import type { Recipe, RecipeDraft } from '../types/recipe';
import { RecipeForm } from './RecipeForm';

type RecipeEditorProps = {
  recipe?: RecipeDraft | Recipe;
  onSave: (draft: RecipeDraft) => Promise<void> | void;
  onClose: () => void;
  title?: string;
};

export function RecipeEditor({ recipe, onSave, onClose, title = 'Modifier la recette' }: RecipeEditorProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/35 px-3 py-4 backdrop-blur-sm">
      <div className="mx-auto max-w-4xl rounded-[34px] border border-white/70 bg-[#fffaf2]/95 p-4 shadow-soft sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-ink">{title}</h2>
            <p className="mt-1 text-sm text-ink/60">Verifiez les informations avant de sauvegarder.</p>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="rounded-full bg-ink px-3 py-2 text-sm font-bold text-cream">x</button>
        </div>
        <RecipeForm initial={recipe} onSave={onSave} onCancel={onClose} />
      </div>
    </div>
  );
}
