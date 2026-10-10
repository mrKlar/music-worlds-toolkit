# Monde musical — consignes communes

Lire `README.md`, puis `docs/babylon-workflow.md` avant un changement Babylon. Ce dépôt est public. N'y ajouter ni chanson, parole, illustration d'album, identité artistique privée, secret, capture d'un projet privé ou historique provenant d'un autre dépôt.

- Réutiliser les modules présents ; conserver leurs interfaces et tests. Le contenu narratif et la progression d'un album appartiennent à son application.
- Les textures de `assets/textures` sont CC0. Préserver tailles, SHA-256 et sources dans `textures.json`. Ne pas attribuer cette licence au code ni aux médias des applications.
- Consommer le paquet depuis une révision Git précise ; aucune dépendance à un dossier frère ou un chemin de machine.
- Versions Babylon alignées. Lire les déclarations du paquet installé avant de proposer une API. Distinguer disponibilité publiée, installation locale et essai réussi.
- Tester `npm test`, `npm run typecheck` et le contenu de `npm pack --dry-run` après modification du paquet. Les tests visiteurs appartiennent aussi à chaque application consommatrice.
- Garder l'audio soumis au geste du visiteur, pause explicite, nettoyage des écouteurs, commandes clavier/tactiles et préférence de réduction des mouvements.
- Toute modification visible se vérifie sur une capture réelle et en déplacement ; un résultat de génération d'image n'est pas une preuve du rendu WebGL.
- Ne jamais publier le contenu ou les données d'une application pour faire une démonstration d'outil. Utiliser des scènes neutres pour les services et éditeurs hébergés.
