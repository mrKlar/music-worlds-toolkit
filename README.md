# Music Worlds Toolkit

Ressources génériques réutilisables pour plusieurs mondes musicaux : un adaptateur audio HTML, des commandes clavier/souris/tactiles, la mise en pause liée au cycle de vie du navigateur et cinq ensembles de textures PBR 1K.

Ce dépôt ne contient aucun morceau, illustration d’album, texte narratif, référence artistique ni document personnel. Le code est `UNLICENSED` : sa visibilité publique n’accorde pas de droit de redistribution. Les quinze textures sont des actifs séparés sous CC0 ; leur provenance et leurs empreintes figurent dans `textures.json`.

## Installation à une révision précise

```sh
npm install "https://codeload.github.com/mrKlar/music-worlds-toolkit/tar.gz/<REVISION_GIT>"
```

Le paquet distribue volontairement ses sources TypeScript, sans bundler de bibliothèque. Il est destiné à une application Vite qui consomme directement :

```ts
import {createAudio} from '@mrklar/music-worlds-toolkit/audio';
import {createControls} from '@mrklar/music-worlds-toolkit/controls';
import {installLifecycle} from '@mrklar/music-worlds-toolkit/lifecycle';
```

### Contrôles souris et tactiles

Sur ordinateur, le déplacement de la souris au-dessus du canvas actif oriente la vue sans clic. Le premier mouvement établit la position de référence ; les mouvements au-dessus de l’interface ou hors du canvas sont ignorés. Les gestes tactiles et le joystick restent fondés sur le glissement.

Une action explicite du visiteur peut aussi demander le verrouillage du pointeur :

```ts
const controls = createControls(canvas, {onInteract, onPause});
controls.setEnabled(true);
enterButton.addEventListener('click', () => controls.capturePointer());
```

Si le navigateur refuse le verrouillage, la vue au survol reste disponible. `setEnabled(false)` et `dispose()` restaurent le curseur du canvas.

## Préparer les textures dans une application

Une étape Node côté consommateur peut copier le dossier publié vers son répertoire statique :

```js
import {cpSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const packageRoot = dirname(require.resolve('@mrklar/music-worlds-toolkit/package.json'));
cpSync(join(packageRoot, 'assets/textures'), 'public/textures', {recursive: true});
```

Le manifeste est importable avec `@mrklar/music-worlds-toolkit/textures.json`. Chaque entrée conserve la page source Poly Haven, l’URL du fichier original, la taille, l’empreinte SHA-256 et la mention CC0.

## Vérification locale

```sh
npm test
npm run typecheck
npm pack --dry-run
```

## Méthode Babylon

Lire [le guide commun](docs/babylon-workflow.md) pour choisir les éditeurs, travailler les matériaux, mesurer le rendu et vérifier les parcours. Les consignes de contribution sont dans [AGENTS.md](AGENTS.md).

Les copies CC0 sont déjà incluses. Pour les actualiser volontairement depuis Poly Haven, le checkout contient `scripts/prepare-textures.py` ; cette commande remplace les cartes et régénère le manifeste. Vérifier les empreintes et le diff avant publication.
