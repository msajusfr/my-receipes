import { Button } from './Button';

type EmptyStateProps = {
  onAdd: () => void;
  onPaste: () => void;
  onPhoto: () => void;
  onManual: () => void;
};

export function EmptyState({ onAdd, onPaste, onPhoto, onManual }: EmptyStateProps) {
  return (
    <section className="rounded-[34px] border border-white/80 bg-white/55 p-6 text-center shadow-soft backdrop-blur sm:p-10">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-terracotta text-lg font-black text-white">MR</div>
      <h2 className="mt-5 font-serif text-3xl font-semibold text-ink">Le carnet de Hui est pret.</h2>
      <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-ink/70">
        Collez une note iPhone, photographiez une page de carnet, ou creez la premiere recette a la main.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Button onClick={onAdd}>Ajouter une recette</Button>
        <Button variant="secondary" onClick={onPaste}>Coller</Button>
        <Button variant="secondary" onClick={onPhoto}>Photographier</Button>
        <Button variant="ghost" onClick={onManual}>Manuel</Button>
      </div>
    </section>
  );
}
