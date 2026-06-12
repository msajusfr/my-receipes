import type { Recipe } from '../types/recipe';
import { EmptyState } from '../components/EmptyState';
import { RecipeCard } from '../components/RecipeCard';
import { SearchBar } from '../components/SearchBar';
import type { RecipeDifficulty } from '../types/recipe';

type HomePageProps = {
  recipes: Recipe[];
  visibleRecipes: Recipe[];
  allTags: string[];
  loading: boolean;
  query: string;
  setQuery: (value: string) => void;
  tag: string;
  setTag: (value: string) => void;
  difficulty: RecipeDifficulty;
  setDifficulty: (value: RecipeDifficulty) => void;
  withImages: boolean;
  setWithImages: (value: boolean) => void;
  onAdd: () => void;
  onPaste: () => void;
  onPhoto: () => void;
  onManual: () => void;
  onOpenRecipe: (recipe: Recipe) => void;
  onEditRecipe: (recipe: Recipe) => void;
};

export function HomePage(props: HomePageProps) {
  const {
    recipes,
    visibleRecipes,
    allTags,
    loading,
    query,
    setQuery,
    tag,
    setTag,
    difficulty,
    setDifficulty,
    withImages,
    setWithImages,
    onAdd,
    onPaste,
    onPhoto,
    onManual,
    onOpenRecipe,
    onEditRecipe
  } = props;

  return (
    <div className="space-y-5">
      <section className="rounded-[34px] border border-white/70 bg-white/50 p-5 shadow-soft backdrop-blur sm:p-7">
        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase text-terracotta">Cuisine locale-first</p>
            <h2 className="mt-2 max-w-2xl font-serif text-3xl font-semibold leading-tight text-ink sm:text-4xl">
              Toutes les recettes de Hui, rangees et retrouvables.
            </h2>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            <button onClick={onPaste} className="min-h-20 rounded-[26px] border border-ink/10 bg-cream/85 px-4 py-3 text-left font-semibold text-ink transition hover:bg-white">
              Coller une recette
              <span className="mt-1 block text-xs font-medium text-ink/55">Notes iPhone</span>
            </button>
            <button onClick={onPhoto} className="min-h-20 rounded-[26px] border border-ink/10 bg-cream/85 px-4 py-3 text-left font-semibold text-ink transition hover:bg-white">
              Photographier
              <span className="mt-1 block text-xs font-medium text-ink/55">Carnet ou livre</span>
            </button>
            <button onClick={onManual} className="min-h-20 rounded-[26px] border border-ink/10 bg-cream/85 px-4 py-3 text-left font-semibold text-ink transition hover:bg-white">
              Creer manuellement
              <span className="mt-1 block text-xs font-medium text-ink/55">Sans IA</span>
            </button>
          </div>
        </div>
      </section>

      <SearchBar
        query={query}
        onQueryChange={setQuery}
        tags={allTags}
        tag={tag}
        onTagChange={setTag}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        withImages={withImages}
        onWithImagesChange={setWithImages}
      />

      {loading && <p className="rounded-3xl bg-white/50 p-5 text-sm font-semibold text-ink/65">Chargement des recettes...</p>}
      {!loading && recipes.length === 0 && <EmptyState onAdd={onAdd} onPaste={onPaste} onPhoto={onPhoto} onManual={onManual} />}
      {!loading && recipes.length > 0 && visibleRecipes.length === 0 && (
        <p className="rounded-3xl bg-white/50 p-5 text-sm font-semibold text-ink/65">Aucune recette ne correspond a cette recherche.</p>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {visibleRecipes.map((recipe) => (
          <RecipeCard key={recipe.id} recipe={recipe} onOpen={() => onOpenRecipe(recipe)} onEdit={() => onEditRecipe(recipe)} />
        ))}
      </div>
    </div>
  );
}
