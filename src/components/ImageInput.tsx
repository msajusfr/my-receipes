import { useState } from 'react';
import type { RecipeImage } from '../types/recipe';
import { compressImage } from '../services/imageUtils';
import { Button } from './Button';

type ImageInputProps = {
  images: RecipeImage[];
  onChange: (images: RecipeImage[]) => void;
};

export function ImageInput({ images, onChange }: ImageInputProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function addFiles(files: FileList | null) {
    if (!files?.length) return;
    try {
      setBusy(true);
      setError('');
      const additions: RecipeImage[] = [];
      for (const file of Array.from(files)) {
        const dataUrl = await compressImage(file);
        additions.push({
          id: crypto.randomUUID(),
          dataUrl,
          alt: file.name,
          createdAt: new Date().toISOString()
        });
      }
      onChange([...images, ...additions]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Impossible d'ajouter cette image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-ink">Images</label>
      <div className="flex flex-wrap gap-3">
        {images.map((image) => (
          <div key={image.id} className="relative h-28 w-28 overflow-hidden rounded-3xl border border-white/70 bg-linen">
            <img src={image.dataUrl} alt={image.alt || 'Photo de recette'} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(images.filter((item) => item.id !== image.id))}
              aria-label="Supprimer cette image"
              className="absolute right-1.5 top-1.5 rounded-full bg-ink/80 px-2 py-1 text-xs font-bold text-white"
            >
              x
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-cream/80 px-5 py-2.5 text-sm font-semibold text-ink ring-1 ring-ink/10">
          Photographier
          <input type="file" accept="image/*" capture="environment" multiple className="sr-only" onChange={(event) => addFiles(event.target.files)} />
        </label>
        <label className="inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full bg-cream/80 px-5 py-2.5 text-sm font-semibold text-ink ring-1 ring-ink/10">
          Importer
          <input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => addFiles(event.target.files)} />
        </label>
        {busy && <Button type="button" disabled variant="ghost">Compression...</Button>}
      </div>
      {error && <p className="text-sm font-medium text-terracotta">{error}</p>}
    </div>
  );
}
