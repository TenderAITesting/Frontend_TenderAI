# TenderAI — Frontend (Nouvelle génération)

SPA React pour l'interface utilisateur du workflow 5 étapes de génération de propositions commerciales basé sur des agents IA d'analyse d'appels d'offres.

## Stack technique

- **React** 19.2 + **TypeScript** 6.0 — UI
- **Vite** 8.0 + plugin-react — build tool (SWC remplacé par Babel)
- **React Router** v7 avec loaders — routing et pre-fetching
- **TanStack React Query** v5 — gestion état serveur
- **ENGIE Fluid Design System** v6 — composants UI (`NJButton`, `NJModal`, `NJTable`, etc.)
- **MUI** v9 (`@mui/material`) + **Emotion** (`@emotion/react`, `@emotion/styled`) — utilisés uniquement pour le composant `Stepper` dans `HomePage` (stepper de progression inline dans le tableau)
- **Okta Auth JS** v8 + **okta-react** v6 — authentification OAuth 2.0 ENGIE (non activée)
- **ExcelJS** v4 + **xlsx** v0.18 — génération et parsing de fichiers Excel
- **uuid** v14 — génération d'identifiants côté client

## Lancer l'application

```bash
# Prérequis : Node.js v20+, npm ou pnpm
npm install

# Dev server (http://localhost:5173)
npm run dev

# Build production
npm run build

# Lint
npm run lint

# Preview du build
npm run preview
```

> Pas de commande `build:prod` / `build:dev` distincte — un seul `vite build`.

## Architecture du projet

```
Frontend_TenderAI/
├── src/
│   ├── main.tsx                 # Point d'entrée React DOM
│   ├── App.tsx                  # Définition des routes React Router v7
│   ├── TenderPage.tsx           # Conteneur workflow 5 étapes (état central)
│   ├── App.css
│   ├── assets/                  # Images statiques (logo, hero)
│   ├── components/              # Modaux partagés
│   │   ├── Stepper.tsx
│   │   ├── DisclaimerModal.tsx
│   │   ├── ExportModal.tsx
│   │   ├── ResultsModal.tsx
│   │   ├── SrcModal.tsx
│   │   └── UpdateDocsModal.tsx
│   ├── data/
│   │   ├── constants.ts         # Agents, templates ToC, 10 mock tenders initiaux, A3_STATIC_DATA, DOC_PAGES
│   │   ├── mockStore.ts         # Store mock (module-level, remplace le backend)
│   │   ├── Agent1.xlsx          # Template Excel agent 1 (importé comme JSON via xlsxJsonPlugin)
│   │   └── Agent2.xlsx          # Template Excel agent 2 (idem) — A3 utilise A3_STATIC_DATA inline
│   ├── loaders/
│   │   └── tenderLoader.ts      # React Router loader pour /tender/:id/:step
│   └── model/
│       └── useTender.ts         # useQuery tender + hooks useRunAgent / useUpdateAgentStatus
│
├── libs/                        # Bibliothèques de features
│   ├── auth/                    # Authentification (Okta, bypassée en dev)
│   ├── http-client/             # Client HTTP (stub, USE_MOCK = true)
│   ├── layout/                  # TopBar (logo, user info) + TopBarContext (slot pour injection de contenu par les routes enfants)
│   ├── homepage/                # Page liste des tenders
│   ├── upload-page/             # Formulaire création / édition tender
│   ├── tender-documents/        # Étape 1 — Upload documents
│   ├── tender-analysis/         # Étape 2 — Lancement et suivi agents
│   ├── draft-configurator/      # Étape 3 — Configuration de la proposition
│   ├── proposal-planning/       # Étape 4 — Édition de la table des matières
│   ├── proposal-drafting/       # Étape 5 — Rédaction (stub)
│   └── tender-page/             # Répertoire vide (scaffold non utilisé — à supprimer ou implémenter)
│
├── preview/                     # Maquettes HTML statiques (TenderAI.html, v2) — hors build, à titre de référence
├── index.html                   # HTML racine (lang="fr", Lato via Google Fonts)
├── vite.config.ts               # Alias @libs / @src, plugin XLSX custom
├── tsconfig.app.json            # Config TS app (strict: false)
├── tsconfig.node.json           # Config TS Vite (strict: true)
└── package.json
```

**Chaque lib suit la structure :** `src/` (composants) + `model/` (types/hooks) + `loaders/` (React Router loaders) + `index.ts` (exports).

## Routes et pages

| Route | Composant | Rôle |
|-------|-----------|------|
| `/` | `LoginPage` | Bypass Okta → redirect `/homepage` (BYPASS_AUTH = true) |
| `/homepage` | `HomePage` | Liste paginée des tenders, CRUD, recherche |
| `/upload` | `UploadPage` | Création / édition métadonnées tender |
| `/tender/:id` | `TenderDefaultRedirect` | Redirect vers `/tender/:id/documents` |
| `/tender/:id/:step` | `TenderPage` | Workflow 5 étapes |
| `/dashboard` | — | Redirect vers `/homepage` |
| `/tender/new` | — | Redirect vers `/upload` |

### Workflow 5 étapes (`/tender/:id/:step`)

Le paramètre `:step` prend les valeurs `documents`, `agents`, `config`, `planning`, `drafting`.

```
documents → agents → config → planning → drafting
```

La navigation avant est verrouillée par `isNew` + `maxStepIdx` : un tender nouvellement créé ne peut pas sauter d'étapes. `TenderPage.tsx` centralise tout l'état et le passe via props `{ s, handlers }` à chaque lib.

#### Étape 1 — Documents (`tender-documents`)
1. Drag & drop de fichiers PDF/DOCX
2. Sélection des agents par document (A1 et/ou A2, déverrouille A3)
3. Sélection de la langue d'analyse (EN/FR/NL/DE/ES/PT)
4. Modal Disclaimer pour les documents sensibles

#### Étape 2 — Agents (`tender-analysis`)
1. Affichage des 3 agents avec statut (not_selected / pending / running / completed / validated)
2. Chronomètre en temps réel pour les agents en cours
3. Visualisation des résultats via `ResultsModal`
4. Validation des résultats par agent

#### Étape 3 — Configuration (`draft-configurator`)
1. Choix du type de plan : Standard (ToC de base) ou Tailored (adaptatif)
2. Options d'enrichissement : contexte, offres passées, références, méthodologie
3. Upload de documents d'enrichissement par catégorie

#### Étape 4 — Planning (`proposal-planning`)
1. Édition de la table des matières générée dynamiquement
2. Ajout/suppression/renommage de sections
3. Estimation du nombre de pages par section
4. Validation avant rédaction

#### Étape 5 — Rédaction (`proposal-drafting`)
- Stub minimal — implémentation à venir

## Agents IA

| ID | Titre | Objet |
|----|-------|-------|
| `a1` | Tender Key Information | Dates, critères, exigences clés |
| `a2` | Technical Requirements | Cartographie des exigences techniques |
| `a3` | Project Risks | Risques légaux, conformité, opérationnels |

A3 ne peut être sélectionné que si **A2** est aussi sélectionné pour le même document (la case A3 est bloquée si `docAgents[doc].a2 === false`).

## Endpoints backend (à connecter)

URL de base : `import.meta.env.VITE_API_URL` (non définie, tous les appels sont mockés)

| Méthode | Endpoint | Hook / Loader | Usage |
|---------|----------|---------------|-------|
| `GET` | `/tenders` | `useTenders`, `tendersLoader` | Liste des tenders |
| `GET` | `/tenders/:id` | `useTender`, `tenderLoader` | Détail tender |
| `POST` | `/tenders` | `addTender` | Créer un tender |
| `PATCH` | `/tenders/:id` | `updateTender` | Mettre à jour (lastStep, maxStepIdx, etc.) |
| `DELETE` | `/tenders/:id` | `deleteTender` | Supprimer |
| `POST` | `/documents/process_document` | `useCreateTender` | Upload docs + création |
| `POST` | `/agents/agent_process/:id?agent=agent_X` | `useRunAgent` | Lancer un agent |
| `GET` | `/tenders/progressAgent/:progressId` | polling | Avancement agent |
| `PUT` | `/tenders/update_status/:id?agent=agent_X` | `useUpdateAgentStatus` | Valider/rejeter résultats |

**Headers à injecter (quand Okta activé) :**
```
Authorization: Bearer {accessToken}
x-id-token: {idToken}
```

## Statuts tender

Les valeurs `status` côté frontend correspondent exactement aux valeurs backend :

| Valeur | Étape |
|--------|-------|
| `uploaded` | Documents uploadés |
| `analysis_in_progress` | Agents en cours |
| `analysis_validated` | Analyse validée |
| `planning_in_progress` | ToC en édition |
| `drafting_in_progress` | Rédaction en cours |
| `proposal_ready` | Proposition finalisée |

## Gestion de l'état

Pas de store global (pas de Redux/Zustand). Architecture hybride :

- **React Router Loaders** — pre-fetching avant transition de route (`useLoaderData()`)
- **React Query** — état serveur réactif, `staleTime: 30_000` en production
- **useState centralisé** — `TenderPage.tsx` porte ~20 champs d'état passés via `{ s, handlers }` aux libs enfants
- **mockStore** — module `src/data/mockStore.ts` simulant la persistance tant que le backend n'est pas branché

```typescript
// Query keys
['tenders']        // liste complète
['tender', id]     // tender individuel
```

## Client HTTP

`libs/http-client/index.ts` — actuellement un stub. Toutes les méthodes lancent une erreur en mode mock.

Quand `USE_MOCK = false` (après connexion backend), il devra :
- Injecter `Authorization: Bearer {accessToken}` et `x-id-token: {idToken}`
- Forcer HTTPS
- Gérer les erreurs HTTP 4xx/5xx
- Construire les URLs via `import.meta.env.VITE_API_URL`

## Configuration par environnement

Pas de fichier `config/config.{mode}.ts` — configuration via variables d'environnement Vite :

| Variable | Usage |
|----------|-------|
| `VITE_API_URL` | URL de base du backend |
| `VITE_OKTA_ISSUER` | Tenant Okta ENGIE |
| `VITE_OKTA_CLIENT_ID` | Client ID app Okta |

Créer un fichier `.env.local` pour le développement local (ne pas committer).

## Plugin Vite XLSX

`vite.config.ts` contient un plugin custom `xlsxJsonPlugin` qui :
- Importe les fichiers `.xlsx` comme modules JSON au build
- Parse les feuilles via ExcelJS
- Gère silencieusement les fichiers chiffrés DRM/IRM (retourne `{}`)

Les fichiers `src/data/Agent1.xlsx` et `Agent2.xlsx` sont importés ainsi dans les composants de résultats.

## Alias de paths

Définis dans `vite.config.ts` et `tsconfig.app.json` :

| Alias | Cible |
|-------|-------|
| `@libs` | `./libs` |
| `@src` | `./src` |

## Points d'attention pour les développeurs

**Mode mock actif :** Les flags `BYPASS_AUTH = true` et `USE_MOCK = true` sont hardcodés dans plusieurs fichiers. Avant de connecter le backend, passer ces flags à `false` de manière coordonnée dans : `libs/auth/model/useAuth.ts`, `libs/auth/src/LoginPage.tsx`, `libs/http-client/index.ts`, `src/loaders/tenderLoader.ts`, `libs/homepage/loaders/tendersLoader.ts`, `src/model/useTender.ts`, `libs/homepage/model/useTenders.ts`, `libs/upload-page/model/useCreateTender.ts`.

**Variables d'environnement manquantes :** Aucun fichier `.env` n'existe dans le repo. Créer `.env.local` avec `VITE_API_URL`, `VITE_OKTA_ISSUER`, `VITE_OKTA_CLIENT_ID` avant d'activer le mode réel.

**État centralisé dans TenderPage :** Contrairement aux libs isolées, `src/TenderPage.tsx` centralise ~20 champs d'état pour tout le workflow. Les handlers sont passés en props `{ s, handlers }`. Ne pas dupliquer cet état dans les libs enfants — les mutations doivent remonter via les handlers.

**Navigation forward verrouillée :** Le `Stepper` ne permet pas d'avancer au-delà de `maxStepIdx`. La progression est persistée via `updateTender({ maxStepIdx, lastStep })`. En mode mock, cette mutation met à jour le `mockStore`, pas le backend.

**React Router v7 :** Ce projet utilise React Router **v7** (package `react-router-dom@^7`), pas v6. L'API est similaire mais les types et certains comportements de loaders diffèrent. Vérifier la doc v7 avant d'utiliser des patterns v6.

**Architecture en libs :** Même convention que l'autre frontend — chaque feature dans `libs/`. Ajouter une feature = créer une nouvelle lib. Éviter les imports circulaires entre libs.

**ENGIE Fluid v6 :** Version **6** (vs v5 dans l'autre projet). L'API des composants peut différer légèrement. Vérifier la version avant de copier des snippets de l'autre frontend.

**Composants ENGIE Fluid :** Utiliser exclusivement les composants du design system ENGIE (`NJButton`, `NJModal`, `NJFormItem`, `NJTable`, etc.). Ne pas introduire d'autres bibliothèques UI sans validation.

**TypeScript strict désactivé :** `tsconfig.app.json` a `strict: false`, `noUnusedLocals: false`, `noUnusedParameters: false`. Ne pas activer sans corriger les erreurs existantes au préalable.

**ESLint ne couvre pas TypeScript :** `eslint.config.js` ne lint que les fichiers `.js/.jsx`. Les fichiers `.ts/.tsx` ne sont pas analysés. Pour activer le lint TypeScript il faudra installer `typescript-eslint` et configurer le parser.

**Pattern TopBar :** `libs/layout` exporte `TopBarProvider`, `TopBar`, et `useTopBar`. Le slot de contenu de la topbar est injecté par les routes enfants via `useTopBar().setSlot(...)` (pattern utilisé dans `TenderPage.tsx` pour afficher breadcrumb + nom du tender). Ne pas mettre le contenu contextuel directement dans `TopBar`.

## Déploiement

- **Build artifacts** : dossier `dist/` (Vite tree-shaking + minification)
- **Variables injectées au build** via `.env` / variables CI — pas de config TypeScript par environnement
- URL de production à définir lors du déploiement Azure
