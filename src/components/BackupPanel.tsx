import { useState } from 'react';
import type { Recipe } from '../types/recipe';
import { downloadRecipesExport, getLastExportAt, readRecipesExport } from '../services/recipeExport';
import { importRecipes } from '../services/recipeStorage';
import { Button } from './Button';

type BackupPanelProps = {
  recipes: Recipe[];
  onClose: () => void;
  onImported: () => void;
};

export function BackupPanel({ recipes, onClose, onImported }: BackupPanelProps) {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const lastExportAt = getLastExportAt();

  async function handleImport(file: File | undefined) {
    if (!file) return;
    try {
      setError('');
      const data = await readRecipesExport(file);
      const result = await importRecipes(data.recipes);
      setMessage(`${result.imported} recette(s) importee(s). ${result.skipped} ignoree(s).`);
      onImported();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import impossible.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ink/35 px-3 py-4 backdrop-blur-sm">
      <section className="mx-auto max-w-3xl rounded-[34px] border border-white/70 bg-[#fffaf2]/95 p-5 shadow-soft sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-serif text-3xl font-semibold text-ink">Sauvegarde</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/70">
              Les recettes vivent sur cet appareil dans IndexedDB. Exportez regulierement un fichier JSON et gardez-le dans iCloud Drive, Google Drive, Dropbox ou Fichiers sur iPhone.
            </p>
          </div>
          <button onClick={onClose} aria-label="Fermer" className="rounded-full bg-ink px-3 py-2 text-sm font-bold text-cream">x</button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[28px] border border-sage/20 bg-white/45 p-5">
            <h3 className="text-lg font-bold text-ink">Exporter</h3>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              Le fichier contient toutes les recettes et les images en dataUrl.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase text-ink/50">
              Dernier export : {lastExportAt ? new Date(lastExportAt).toLocaleString('fr-FR') : 'jamais'}
            </p>
            <Button className="mt-4 w-full" onClick={() => { downloadRecipesExport(recipes); setMessage('Sauvegarde exportee.'); }}>
              Exporter mes recettes
            </Button>
          </div>
          <div className="rounded-[28px] border border-sage/20 bg-white/45 p-5">
            <h3 className="text-lg font-bold text-ink">Importer</h3>
            <p className="mt-2 text-sm leading-6 text-ink/65">
              Importez une sauvegarde MyRecipes. Les doublons gardent une copie separee.
            </p>
            <label className="mt-4 inline-flex min-h-11 w-full cursor-pointer items-center justify-center rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream">
              Importer une sauvegarde
              <input type="file" accept="application/json,.json" className="sr-only" onChange={(event) => handleImport(event.target.files?.[0])} />
            </label>
          </div>
        </div>

        {message && <p className="mt-4 rounded-2xl bg-sage/15 px-4 py-3 text-sm font-semibold text-moss">{message}</p>}
        {error && <p className="mt-4 rounded-2xl bg-terracotta/10 px-4 py-3 text-sm font-semibold text-terracotta">{error}</p>}
      </section>
    </div>
  );
}
