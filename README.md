# MyRecipes

MyRecipes est le carnet de recettes local-first de Hui. L'application permet de coller une recette, photographier une page, creer une recette manuellement, modifier, rechercher, supprimer, exporter et restaurer toutes les recettes.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- PWA avec `vite-plugin-pwa`
- IndexedDB cote navigateur pour les recettes et les images
- Vercel Functions pour les appels OpenAI
- Aucun backend applicatif lourd

## Installation

```bash
npm install
```

## Developpement

```bash
npm run dev
```

Cette commande lance uniquement Vite. Les routes `api/ai/*` sont des Vercel Functions : pour tester l'IA en local, utilisez plutot Vercel CLI avec une cle OpenAI locale :

```bash
vercel env pull .env.local
vercel dev
```

Ou testez directement sur le deploiement Vercel apres avoir ajoute `OPENAI_API_KEY` dans les variables d'environnement du projet.

## Build

```bash
npm run build
```

## Configuration OpenAI sur Vercel

Les fonctionnalites IA passent uniquement par les fonctions Vercel dans `api/ai`. La cle OpenAI ne doit jamais etre exposee cote navigateur.

Copiez `.env.example` vers `.env.local` en local, ou ajoutez les variables dans Vercel :

```bash
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4.1-mini
```

Si vous ajoutez ou modifiez `OPENAI_API_KEY` dans Vercel apres un deploiement, redeployez l'application pour que les fonctions la prennent en compte. Verifiez aussi que la variable est disponible dans le bon environnement Vercel : Production, Preview ou Development.

Endpoints :

- `POST /api/ai/format-recipe`
- `POST /api/ai/format-recipe-image`
- `POST /api/ai/chat-recipe`

## Persistance locale

Les recettes sont stockees dans IndexedDB via `src/services/recipeStorage.ts`. Les images sont compressees cote client avant stockage, puis conservees en `dataUrl` dans la recette.

L'application reste utilisable hors ligne pour consulter, modifier et rechercher les recettes deja sauvegardees. Les fonctions IA necessitent internet et une cle OpenAI configuree cote serveur.

## Import / export

La section Sauvegarde exporte un JSON versionne :

```ts
type RecipeExport = {
  app: "MyRecipes";
  version: 1;
  exportedAt: string;
  recipes: Recipe[];
};
```

Ce fichier contient toutes les recettes et leurs images. Il peut etre garde dans iCloud Drive, Google Drive, Dropbox ou Fichiers sur iPhone, puis importe plus tard pour restaurer les donnees.
