import type { RecipeDifficulty } from '../types/recipe';

type SearchBarProps = {
  query: string;
  onQueryChange: (value: string) => void;
  tags: string[];
  tag: string;
  onTagChange: (value: string) => void;
  difficulty: RecipeDifficulty;
  onDifficultyChange: (value: RecipeDifficulty) => void;
  withImages: boolean;
  onWithImagesChange: (value: boolean) => void;
};

export function SearchBar({ query, onQueryChange, tags, tag, onTagChange, difficulty, onDifficultyChange, withImages, onWithImagesChange }: SearchBarProps) {
  return (
    <section className="rounded-[28px] border border-white/70 bg-white/55 p-4 shadow-soft backdrop-blur">
      <label className="block text-sm font-semibold text-ink" htmlFor="recipe-search">
        Rechercher
      </label>
      <input
        id="recipe-search"
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        placeholder="Titre, ingredient, tag, note..."
        className="mt-2 w-full rounded-2xl border border-ink/10 bg-cream/70 px-4 py-3 text-base text-ink outline-none transition placeholder:text-ink/45 focus:border-terracotta focus:ring-2 focus:ring-terracotta/20"
      />
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
          Tag
          <select value={tag} onChange={(event) => onTagChange(event.target.value)} className="mt-1 w-full rounded-2xl border border-ink/10 bg-cream/80 px-3 py-2 text-sm normal-case tracking-normal text-ink">
            <option value="">Tous</option>
            {tags.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold uppercase tracking-wide text-ink/60">
          Difficulte
          <select value={difficulty} onChange={(event) => onDifficultyChange(event.target.value as RecipeDifficulty)} className="mt-1 w-full rounded-2xl border border-ink/10 bg-cream/80 px-3 py-2 text-sm normal-case tracking-normal text-ink">
            <option value="">Toutes</option>
            <option value="facile">Facile</option>
            <option value="moyen">Moyen</option>
            <option value="difficile">Difficile</option>
          </select>
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-cream/80 px-3 py-2 text-sm font-semibold text-ink">
          <input checked={withImages} onChange={(event) => onWithImagesChange(event.target.checked)} type="checkbox" className="h-5 w-5 accent-terracotta" />
          Avec photos
        </label>
      </div>
    </section>
  );
}
