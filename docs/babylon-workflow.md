# Bien utiliser Babylon pour un monde musical

Référence de travail vérifiée le 10 octobre 2026, avec les paquets Babylon **9.30.0**. Les quatre albums peuvent partager les méthodes et modules de ce dépôt ; leur univers visuel, musique et progression restent dans leurs propres applications.

## Choisir l'outil pour le travail

| Besoin | Outil | Sortie à conserver |
| --- | --- | --- |
| Examiner une scène Vite en cours | Inspector V2, `ShowInspector(scene)` | changement reporté dans le code, captures et mesures |
| Interroger cette scène en terminal | `StartInspectable(scene)` et `babylon-inspector` | commandes et résultats du diagnostic |
| Construire un matériau | Node Material Editor, MCP `nme` | graphe JSON et ressources utilisées |
| Construire une géométrie procédurale | Node Geometry Editor, MCP `nge` | graphe JSON, paramètres et validation de géométrie |
| Travailler un graphe de rendu, particules ou interface | MCP `nrge`, `npe`, `gui` | graphe correspondant, uniquement si l'application en a besoin |
| Éditer une scène comme un projet | Babylon.js Editor Linux | projet de l'éditeur et assets référencés |

Les sept serveurs du paquet officiel comprennent aussi `flow-graph` et `smart-filters`. Ce sont des outils de graphes ; ils ne constituent pas un contrôleur universel de toutes les scènes Web. Le pont MCP du Desktop Editor est un autre composant, à vérifier dans la version de l'éditeur réellement installée. [Paquet MCP officiel](https://github.com/BabylonJS/Babylon.js/blob/master/packages/public/%40babylonjs/mcp-servers/readme.md), [Editor officiel](https://github.com/BabylonJS/Editor).

## Installation et usage reproductibles

Le paquet MCP 9.30.0 déclare Node 20/22/24 compatibles ; utiliser **Node 24**, sans changer le Node de tous les projets. Installation possible dans un répertoire d'outils dédié :

```sh
npm install --save-exact @babylonjs/mcp-servers@9.30.0
node node_modules/@babylonjs/mcp-servers/dist/babylonjs-mcp-servers.js nme
```

Le serveur MCP parle sur stdin/stdout. L'éditeur web se connecte à la session locale fournie par ce serveur. Faire un essai avec un graphe neutre, exporter le JSON, puis fermer la session. Ne pas soumettre les médias privés d'un album à un Playground ou service de partage.

L'Inspector s'installe dans les dépendances de développement de l'application :

```sh
npm install --save-dev --save-exact @babylonjs/inspector@9.30.0
```

Importer dynamiquement l'outil derrière `import.meta.env.DEV` et une option explicite. `ShowInspector` ouvre l'interface ; `StartInspectable` donne accès au pont CLI. Conserver et libérer les tokens lorsque la scène est détruite. Les ports par défaut du pont Inspector sont 4400/4401, en boucle locale ; `.babyloninspector` peut les configurer. La CLI liste d'abord les sessions, puis les commandes réellement disponibles :

```sh
npx --no-install babylon-inspector --session
npx --no-install babylon-inspector --session <id> --command
npx --no-install babylon-inspector --stop
```

Ne pas inventer un export de projet à partir d'une ancienne API. Les déclarations 9.30.0 ne fournissent pas `SaveProjectFileAsync`. Une sérialisation de scène n'emporte pas automatiquement l'HTML, les fonctions TypeScript, les contrôles ou la progression audio. Vérifier un chargement réel de tout export. [Inspector V2](https://doc.babylonjs.com/toolsAndResources/inspectorv2/), [API publiée du paquet](https://github.com/BabylonJS/Babylon.js/blob/master/packages/public/%40babylonjs/inspector-v2/readme.md).

## Rendu et direction artistique

Commencer par une petite zone témoin représentative : silhouettes, échelle, point de vue et trajet. Comparer le vrai rendu à l'intention artistique avant d'étendre le monde.

Une image de panorama contient son éclairage peint ; un matériau émissif sans éclairage peut le restituer. Le premier plan 3D peut recevoir éclairage physique, normales et rugosité. Ne pas annoncer qu'un panorama devient relightable en lui appliquant PBR.

Pour les matériaux PBR, vérifier les espaces colorimétriques des données, les canaux des cartes, l'orientation des normales et l'échelle des textures. Employer métal/rugosité selon la matière ; pierre et bois sont des diélectriques. Un environnement de réflexion doit être fourni et vérifié lorsque l'effet voulu en dépend. [Introduction PBR](https://doc.babylonjs.com/features/featuresDeepDive/materials/using/introToPBR/), [NME PBR](https://doc.babylonjs.com/features/featuresDeepDive/materials/node_material/NMEPBR/).

Ajouter ombres, reflets ou post-traitement pour un besoin visible et mesurable. Un drapeau `receiveShadows` ne prouve pas l'existence d'un générateur d'ombres. Une image de reflet ne devient pas un miroir dynamique. Conserver les cartes sources et leur licence ; optimiser les copies de diffusion séparément.

## Performance et preuves

Mesurer dans l'Inspector : meshes actifs, draw calls, triangles, matériaux, textures et temps de frame, sur un trajet reproductible. Refaire la mesure après correction. Un chiffre de 60 FPS sur GPU puissant ne vaut pas un test mobile.

Réutiliser les géométries/matériaux et les instances lorsque cela convient. Fusionner seulement les éléments statiques compatibles ; conserver animations, visibilité et culling utiles. Ne pas générer des textures qui seront remplacées aussitôt ; libérer ce que l'on retire. Évaluer les changements avec les mesures plutôt qu'en activant toutes les options. [Optimiser une scène](https://doc.babylonjs.com/features/featuresDeepDive/scene/optimize_your_scene/).

La géométrie visible et les collisions doivent rester cohérentes. Pour une scène procédurale déterministe, une suppression locale ne doit pas modifier par accident la séquence aléatoire du reste du monde.

Vérifier enfin le trajet continu, les retours et limites, la vue avant/après un portail, l'audio sans interruption, Pause/Échap, sauvegarde/reset et commandes tactiles. Vérifier le build de production lui-même et l'absence d'outils développeur dans ses fichiers. Conserver date, version, appareil et limites avec les preuves.
