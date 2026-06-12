import { useState } from 'react';
import type { RecipeDraft, RecipeImage } from '../types/recipe';
import { formatRecipeFromImage, formatRecipeFromText } from '../services/aiClient';
import { compressImage } from '../services/imageUtils';
import { Button } from './Button';

type AiRecipeImporterProps = {
  mode: 'text' | 'photo';
  onDraft: (draft: RecipeDraft) => void;
  onClose: () => void;
};

export function AiRecipeImporter({ mode, onDraft, onClose }: AiRecipeImporterProps) {
  const [sourceText, setSourceText] = useState('');
  const [hint, setHint] = useState('');
  const [image, setImage] = useState<RecipeImage | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function selectImage(file: File | undefined) {
    if (!file) return;
    const dataUrl = await compressImage(file);
    setImage({ id: crypto.randomUUID(), dataUrl, alt: file.name, createdAt: new Date().toISOString() });
  }

  async function run() {
    try {
      setLoading(true);
      setError('');
      if (mode === 'text') {
        if (!sourceText.trim()) throw new Error('Collez une recette avant de lancer le formatage.');
        onDraft(await formatRecipeFromText(sourceText));
      } else {
        if (!image) throw new Error('Ajoutez une photo avant de lancer le formatage.');
        const draft = await formatRecipeFromImage(image.dataUrl, hint);
        onDraft({ ...draft, images: [image, ...(draft.images || [])] });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "L'IA n'a pas pu preparer cette recette. Vous pouvez continuer en manuel.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/35 px-3 py-4 backdrop-blur-sm">
      <div className="mx-auto max-w-3xl rounded-[34px] border border-white/70 bg-[#fffaf2]/95 p-5 shadow-soft sm:p-7">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-ink">{mode === 'text' ? 'Coller une recette' : 'Photographier une recette'}</h2>
            <p className="mt-1 text-sm text-ink/60">MyRecipes prepare un brouillon modifiable avant sauvegarde.</p>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="rounded-full bg-ink px-3 py-2 text-sm font-bold text-cream">x</button>
        </div>

        {mode === 'text' ? (
          <label className="block text-sm font-semibold text-ink">
            Texte source
            <textarea value={sourceText} onChange={(event) => setSourceText(event.target.value)} className="mt-2 min-h-72 w-full rounded-3xl border border-ink/10 bg-cream/80 px-4 py-3 text-base outline-none focus:border-terracotta focus:ring-2 focus:ring-terracotta/20" placeholder="Collez ici la recette depuis Notes iPhone..." />
          </label>
        ) : (
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream">
                Prendre une photo
                <input type="file" accept="image/*" capture="environment" className="sr-only" onChange={(event) => selectImage(event.target.files?.[0])} />
              </label>
              <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-cream/80 px-5 py-2.5 text-sm font-semibold text-ink ring-1 ring-ink/10">
                Importer une image
                <input type="file" accept="image/*" className="sr-only" onChange={(event) => selectImage(event.target.files?.[0])} />
              </label>
            </div>
            {image && <img src={image.dataUrl} alt={image.alt || 'Photo importee'} className="max-h-[420px] w-full rounded-[28px] object-cover" />}
            <label className="block text-sm font-semibold text-ink">
              Indice optionnel
              <input value={hint} onChange={(event) => setHint(event.target.value)} className="mt-2 w-full rounded-2xl border border-ink/10 bg-cream/80 px-4 py-3 outline-none" placeholder="Ex : recette de gateau au yaourt" />
            </label>
          </div>
        )}

        {error && <p className="mt-4 rounded-2xl bg-terracotta/10 px-4 py-3 text-sm font-semibold text-terracotta">{error}</p>}
        <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="secondary" onClick={onClose}>Annuler</Button>
          <Button onClick={run} disabled={loading}>{loading ? 'Analyse...' : 'Creer le brouillon'}</Button>
        </div>
      </div>
    </div>
  );
}
