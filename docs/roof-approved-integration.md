# Laville Rénovation — Images de toiture validées

## Provenance et traçabilité
Les huit PNG ci-dessous sont **les fichiers du dépôt Github du client de la conversation**, copiés par référence au même blob Git, sans nouvelle génération.

| Fichier utilisé par le site | Original à la racine de main |
| --- | --- |
| couverture.png | 4783C61E-9DB1-4FF6-993C-8787DF50BF9D.png |
| liteaux.png | 22BE0CD5-3368-43AD-9F75-395E6C5A1DA7.png |
| sous-toiture.png | C6B6841B-0A43-41AA-A15D-4795FE30A9E0.png |
| isolation.png | 0C4EC403-B9EF-4C1E-911F-BBD0656B7A68.png |
| charpente.png | 96F870C2-A056-499F-A6A5-71F0ABE4D28B.png |
| zinguerie.png | E35F7184-85ED-4DD2-AAD8-9EBFB530DFF0.png |
| vue-assemblee.png | 259CE7F5-3D50-4874-B762-A5A84749F2D6.png |
| vue-eclatee.png | 3395CEB9-3D59-47D2-A661-8B9BCA9EF415.png |

## Composition UX / technique

- `components/Roof.jsx`: huit images réelles ; six couches indépendantes dans le DOM ; scroll réversible ; indicateurs et CTAs en HTML.
- L'état initial montre la vue complète validée. La progression fait apparaître les six éléments indépendants ; à la fin, la vue éclatée de référence est réintroduite.
- `/toiture-demo`: page de validation non indexable.
- `next.config.mjs`: optimisation d'images à qualité 90 autorisée.
- Responsive smartphone spécifique et respect du mode « réduire les animations ».
- `main` n'est **pas** modifiée avant validation UX/UI.

## Limitation à ne pas masquer
Les PNG séparés ont été créés à partir de générations distinctes. Ils **n'ont pas une caméra/échelle 3D commune garantie**. L'animation obtenue est une superposition photographique *artistique* et non un assemblage 3D géométriquement exact. Un alignement parfaitement cohérent à chaque frame nécessitera des rendus séparés issus d'un modèle 3D commun. Ne jamais présenter cette version comme un modèle photoréaliste 3D physiquement exact.

## Validation avant fusion
1. Sur iPhone, pas de texte superposé à la scène et pas de débordement.
2. Au début, vue assemblée entière, pas de image cassée.
3. Pendant le scroll, chaque nom de couche s'active, dans l'ordre.
4. À la fin, la vue éclatée de référence est visible.
5. Scroll inverse et navigation par boutons.
6. Test 390 × 844, 430 × 932, tablette 768 × 1024 et desktop 1440 × 900.
7. Ajouter un rendu conforme à la maquette si la perspective des couches devient trop incohérente ; ne pas « corriger » en découpant une seule image.
