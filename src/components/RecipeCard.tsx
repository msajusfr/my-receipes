import type { Recipe } from '../types/recipe';
import { TagPill } from './TagPill';

type RecipeCardProps = {
  recipe: Recipe;
  onOpen: () => void;
  onEdit: () => void;
};

export function RecipeCard({ recipe, onOpen, onEdit }: RecipeCardProps) {
  const image = recipe.images[0];
  const meta = recipe.totalTime || recipe.prepTime || recipe.cookTime || recipe.difficulty || 'Recette maison';
  const preview = recipe.description || recipe.notes || recipe.steps[0]?.text || 'Aucune note pour le moment.';

  return (
    <article className="group overflow-hidden rounded-[30px] border border-white/70 bg-white/60 shadow-soft backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/75">
      <button onClick={onOpen} className="grid w-full grid-cols-[112px_1fr] text-left sm:grid-cols-[160px_1fr]">
        <div className="h-full min-h-36 bg-linen">
          {image ? (
            <img src={image.dataUrl} alt={image.alt || recipe.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-linen via-cream to-sage/25 text-3xl">MR</div>
          )}
        </div>
        <div className="min-w-0 p-4 sm:p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="break-words font-serif text-xl font-semibold leading-tight text-ink">{recipe.title}</h3>
              <p className="mt-1 text-xs font-semibold uppercase text-terracotta">{meta}</p>
            </div>
          </div>
          <p className="mt-3 line-clamp-2 break-words text-sm leading-6 text-ink/70">{preview}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {recipe.tags.slice(0, 3).map((tag) => <TagPill key={tag}>{tag}</TagPill>)}
          </div>
          <p className="mt-3 text-xs text-ink/50">Modifiee le {new Date(recipe.updatedAt).toLocaleDateString('fr-FR')}</p>
        </div>
      </button>
      <div className="flex justify-end border-t border-ink/5 px-4 py-3">
        <button onClick={onEdit} className="rounded-full px-4 py-2 text-sm font-semibold text-moss hover:bg-sage/10">
          Modifier
        </button>
      </div>
    </article>
  );
}
