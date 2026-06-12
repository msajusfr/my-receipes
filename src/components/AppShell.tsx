import type { ReactNode } from 'react';
import { Button } from './Button';

type AppShellProps = {
  children: ReactNode;
  onAdd: () => void;
  onBackup: () => void;
};

export function AppShell({ children, onAdd, onBackup }: AppShellProps) {
  return (
    <div className="min-h-screen overflow-hidden bg-cream text-ink">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_8%,rgba(189,101,69,0.20),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(143,165,139,0.26),transparent_28%),linear-gradient(135deg,#fffaf2_0%,#f4e9d8_55%,#fffaf2_100%)]" />
      <header className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 pb-5 pt-5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="font-serif text-4xl font-semibold leading-none text-ink sm:text-5xl">MyRecipes</h1>
            <p className="mt-2 text-sm font-medium text-ink/65">Le carnet de recettes de Hui</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="secondary" onClick={onBackup} className="px-4">Sauvegarde</Button>
            <Button onClick={onAdd} className="px-4">Ajouter</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}
