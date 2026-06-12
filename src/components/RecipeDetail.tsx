import type { Recipe } from '../types/recipe';
import { Button } from './Button';
import { RecipeChat } from './RecipeChat';
import { TagPill } from './TagPill';

type RecipeDetailProps = {
  recipe: Recipe;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function RecipeDetail({ recipe, onClose, onEdit, onDelete }: RecipeDetailProps) {
  const hero = recipe.images[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/35 px-3 py-4 backdrop-blur-sm">
      <article className="mx-auto max-w-5xl overflow-hidden rounded-[34px] border border-white/70 bg-[#fffaf2]/95 shadow-soft">
        {hero && <img src={hero.dataUrl} alt={hero.alt || recipe.title} className="h-72 w-full object-cover sm:h-96" />}
        <div className="p-5 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <h2 className="break-words font-serif text-4xl font-semibold leading-tight text-ink">{recipe.title}</h2>
              {recipe.description && <p className="mt-3 max-w-3xl text-base leading-7 text-ink/70">{recipe.description}</p>}
              <div className="mt-4 flex flex-wrap gap-2">
                {recipe.tags.map((tag) => <TagPill key={tag}>{tag}</TagPill>)}
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button variant="secondary" onClick={onClose}>Fermer</Button>
              <Button onClick={onEdit}>Modifier</Button>
            </div>
          </div>

          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {[
              ['Personnes', recipe.servings],
              ['Preparation', recipe.prepTime],
              ['Cuisson', recipe.cookTime],
              ['Repos', recipe.restTime],
              ['Difficulte', recipe.difficulty]
            ].map(([label, value]) => value && (
              <div key={label} className="rounded-3xl border border-ink/5 bg-white/45 p-4">
                <dt className="text-xs font-bold uppercase text-ink/45">{label}</dt>
                <dd className="mt-1 break-words text-sm font-semibold text-ink">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <section>
              <h3 className="font-serif text-2xl font-semibold text-ink">Ingredients</h3>
              <ul className="mt-3 space-y-2">
                {recipe.ingredients.map((ingredient) => (
                  <li key={ingredient.id} className="rounded-2xl bg-white/45 px-4 py-3 text-sm text-ink">
                    <span className="font-semibold">{[ingredient.quantity, ingredient.unit, ingredient.name].filter(Boolean).join(' ')}</span>
                    {ingredient.note && <span className="text-ink/60"> - {ingredient.note}</span>}
                  </li>
                ))}
              </ul>
            </section>
            <section>
              <h3 className="font-serif text-2xl font-semibold text-ink">Preparation</h3>
              <ol className="mt-3 space-y-3">
                {recipe.steps.map((step, index) => (
                  <li key={step.id} className="flex gap-3 rounded-3xl bg-white/45 p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terracotta text-sm font-bold text-white">{index + 1}</span>
                    <p className="break-words text-sm leading-6 text-ink/80">{step.text}</p>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          {recipe.images.length > 1 && (
            <section className="mt-7">
              <h3 className="font-serif text-2xl font-semibold text-ink">Photos</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {recipe.images.slice(1).map((image) => <img key={image.id} src={image.dataUrl} alt={image.alt || recipe.title} className="aspect-square rounded-3xl object-cover" />)}
              </div>
            </section>
          )}

          {recipe.notes && (
            <section className="mt-7 rounded-[30px] border border-sage/20 bg-sage/10 p-5">
              <h3 className="font-serif text-2xl font-semibold text-ink">Notes</h3>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-7 text-ink/75">{recipe.notes}</p>
            </section>
          )}

          <div className="mt-7">
            <RecipeChat recipe={recipe} />
          </div>

          <div className="mt-7 flex justify-end">
            <Button variant="danger" onClick={onDelete}>Supprimer la recette</Button>
          </div>
        </div>
      </article>
    </div>
  );
}
