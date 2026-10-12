# Toiture — prototype V4 de fluidité (non final)
## Pourquoi ce changement
La V3 affichait d'abord la photo « assemblée », puis les six PNG, puis la photo « éclatée ». Ces changements de visuels provoquaient des sauts, même lorsque les déplacements CSS étaient interpolés.

## Nouveau fonctionnement
- `components/RoofCanvas.jsx` : **un seul canvas** (850 × 1050 unités internes), six PNG *originaux approuvés*, chargés une fois et décodés, puis réduits et mis en cache avec leur ombre une seule fois.
- `components/Roof.jsx` : section épinglée avec progression `p∈[0,1]` issue du scroll. Seule l'étape active est mise à jour dans React ; le canvas lit la progression via une ref stable.
- Six calques **toujours présents de la première à la dernière frame** ; aucun remplacement, aucune opacité qui fait disparaître des pièces et aucun « hard cut » vers une image de synthèse différente.
- Trajectoires continues et progressives via `smoothstep(clamp((p − phase) / durée))`. Lissage de la valeur de scroll dans `requestAnimationFrame` avec interpolation `current += 0.23 × (target − current)`. Redessin uniquement lorsque la progression change.
- Les noms restent de vrais boutons HTML, les liens vers les prestations restent accessibles, « Vue complète » et les flèches contrôlent le scroll.
- Sur mobile : grille dédiée, libellés placés dans leur propre colonne ; pas d'overlay par-dessus la toiture.
- Respect de `prefers-reduced-motion` : progression statique, sans animation imposée.
- Les deux images de référence assemblée/éclatée et les six PNG originaux restent stockés et traçables. La scène animée est faite **uniquement** des six sources indépendantes ; les deux vues d'ensemble ne sont plus remplacées au milieu de l'expérience.

## Problème NON résolu
**Les six visuels photoréalistes ne partagent pas une géométrie/caméra physique commune.** Les trajectoires ont été recalibrées pour conserver la lisibilité de chaque couche dans le même espace pixel. L'animation est cohérente temporellement, mais pas un démontage mécanique exact. Pour un assemblage 3D parfaitement aligné, il faudrait retravailler un modèle 3D photoréaliste unique et en exporter toutes les couches avec caméra constante.

## Vérifications effectuées
- Montage d'états à cinq positions généré depuis les PNG d'origine, sans substituer de nouveaux visuels.
- Déploiement Vercel GitHub opérationnel ; compilation Next.js réussie.
- Route `/toiture-demo` HTTP 200 et images servies en HTTP 200.
- Test direct de scroll tactile sur iPhone **non réalisé à ce stade**.

## Tests d'acceptation avant merge
- Sur iPhone 390 × 844 et 430 × 932 : visibilité, z-index, textes, sens inverse, rotation, fiabilité de `decode()`, performances.
- Sur ordinateur 1440 × 900 et tablette 768 × 1024 : bonne composition et continuité.
- Aucune image blanche, absence de saut à l'entrée/sortie de la section, chargement stable.
- Ne pas merger sur `main` sans validation explicite de la prévisualisation.
