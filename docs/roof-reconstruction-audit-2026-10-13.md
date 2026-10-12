# Laville Rénovation — Audit technique de la toiture (phase 1)
**Date : 13 octobre 2026**
**Dépôt :** Mika1133/Laville-R-novation-
**Base auditée :** `feature/roof-photoreal-assets` @ `6f662334b362c7114fadc7ff624502564c0528d3`
**PR historique :** #1 (brouillon, pas fusionnée)
**Périmètre :** uniquement « Au cœur de votre toiture » ; aucune modification à `main`, aux autres pages, à la navigation ni à Supabase.

## 1. Verdict / décision de production
**Ne pas reconstruire une cinquième approximation à partir de six PNG indépendants.**

Le blocage principal n'est pas le CSS : il manque une **scène source unique** avec six ensembles ajustés dans le même espace 3D. Ni des translations Canvas, ni un décalage de perspective CSS, ni une interpolation GSAP ne reconstruisent une géométrie commune absente.

La PR #1 l'indique déjà : les six PNG ont été générés séparément. Leur alignement photographique ne peut pas être garanti. Une nouvelle animation avec ces six calques ne satisferait pas les critères 1–4.

**Approche recommandée :** Blender (maquette 3D unique et matériaux PBR calibrés sur les références validées) → séquences photoréalistes précalculées synchronisées au scroll (option B) → affichage Canvas piloté par rAF et texte accessible en HTML. Le modèle 3D est le master de production ; les rendus découlent tous de la **même scène et caméra par déclinaison d'écran**, y compris les différentes étapes et les couches.

Option A (GLB temps réel) à réévaluer uniquement si un essai avec les bons matériaux et un vrai mobile prouve que le niveau de photoréalisme est atteint sans dégradation de FPS ou surcharge mémoire.

## 2. Constat dans le code audité
### `components/RoofCanvas.jsx`
- Six images sources distinctes : `charpente`, `zinguerie`, `isolation`, `sous-toiture`, `liteaux`, `couverture`.
- Leur `scale` est arbitraire (de 0,58 à 0,68), et leurs décalages Y `start/end` sont réglés à l'œil. Il n'y a aucun point d'ancrage partagé dans la géométrie et aucune transformation 3D réelle.
- **État initial non physiquement assemblé :** à `progress=0`, les déplacements déjà non nuls sont `charpente=170`, `zinguerie=175`, `isolation=70`, `sous-toiture=20`, `liteaux=26`, `couverture=-25` (pixels logiques Canvas).
- Caméra Canvas fixe `850 x 1050` : une scène composite 2D centrée, sans garantie de perspective cohérente.
- Un `requestAnimationFrame` est relancé en permanence tant que la zone est visible, même après stabilisation de la progression. Les redraws sont limités, mais le polling continue.
- L'intersection stoppe le rendu, **pas le chargement** : les six PNG sont décodés immédiatement au montage du composant, avant que l'utilisateur arrive à la section.
- Les bitmaps intermédiaires et ombres en caches Canvas peuvent amplifier le pic de mémoire mobile ; mesure nécessaire.
- Le calcul de chaque animation (`step * .14`, durée `.22`) et l'étape UI (`floor(progress * 6)`) n'ont pas les mêmes bornes : le label peut changer avant/après que sa pièce ait achevé son mouvement.
- Le fallback du Canvas n'apparaît qu'après échec explicite de chargement ; la progression initiale en cours de décodage n'affiche pas la vue assemblée approuvée.

### `components/Roof.jsx`
- Scroll = progression continue calculée depuis la hauteur du bloc. Les 6 labels restent en HTML ; c'est un bon principe à conserver.
- La navigation par couche calcule un `scrollTo`, et n'anime pas directement des positions arbitraires ; bon principe.
- La section est importée dans la page d'accueil, avec Canvas dynamique rendu côté client. Il faut déclencher le chargement lourd à l'approche de la section plutôt qu'au montage immédiat.
- La numérotation et le texte « Au cœur de votre toiture » sont présents et accessibles.

### `components/RoofScene.jsx`
- Prototype Three.js avec tuiles et charpente faites de géométries basiques, matériaux couleurs simples, sans textures PBR de référence. Ne constitue pas une solution photoréaliste.
- Non utilisé dans `Roof.jsx` actuel. À ne pas substituer automatiquement au Canvas V4.

### `app/globals.css`
- Les règles `roof-approved` et `roof-continuous` s'accumulent par variantes successives.
- À largeur inférieure à 760 px, la scène et les légendes partagent une grille proche de 2/3 – 1/3. À 390 px, scène 60 %, libellés 40 %, puis scène élargie à 130 % ; `overflow:hidden` coupe ce qui dépasse. Cela réduit le sujet principal et crée une tension entre scène, textes et recadrage.
- Les cibles de pagination descendues à `28 x 28 px` sur mobile sont trop petites pour l'objectif tactile de 44 x 44 px.
- Sous 760 px, le sous-titre de chaque couche et les liens `En savoir plus` sont cachés.
- `100svh` est préférable à `100vh` pour les changements de barre Safari, mais ne garantit pas à lui seul la bonne composition en mode zoom, faible hauteur ou clavier ouvert.
- Isoler les nouveaux styles dans un module CSS du composant ; ne pas toucher au design system général.

### `app/toiture-demo/page.jsx`
- Route de démonstration existante, définie avec `robots.index=false`. Bonne base pour une prévisualisation dédiée.

## 3. Traçabilité des huit ressources et limite d'inspection
Les huit chemins existent réellement sur la branche auditée :
- `couverture.png` — SHA blob `096454270c29ac281f7ab2dfadf9e1094411a540`
- `liteaux.png` — `031012d5a08868d54d2d128929fcfd7fd4125d9c`
- `sous-toiture.png` — `b766fc7ef31956b00a6d2ef91e12f91dd8975a74`
- `isolation.png` — `c86476aab206119b9b2f724bd063ddaa81ed18e6`
- `charpente.png` — `439740576073d0563e4fb18aa1dc45195e4b1c55`
- `zinguerie.png` — `27dd3d380a9640309f54330a8cb9dff41feb8ccc`
- `vue-assemblee.png` — `8ec233f89f15cb8fd448eb7ca7a1a2bd2fbb5194`
- `vue-eclatee.png` — `44a23edb82bf2d84553607f438ca461cad07de3b`

**Examen visuel effectivement réalisé :** `zinguerie.png` (gouttière/raccord en zinc photoréalistes, détourés). Les sept autres sont vérifiés quant à leur présence, leurs empreintes et leur provenance, **mais pas encore inspectés pixel par pixel** : le connecteur renvoie un contenu vide pour les PNG de plus de 1 Mo. Il ne faut pas déclarer l'audit graphique complet avant d'obtenir ces sept PNG via pièce jointe ou un accès binaire adapté.

Les originaux **ne sont ni écrasés ni remplacés**.

## 4. Spécification de production cible
1. **Références** : examiner l'ensemble des huit originaux, déterminer la pente, le nombre de pans visibles, l'origine des six couches, les couleurs terre cuite / bois / métal, l'orientation des joints et les rapports d'échelle. Signer la correspondance visuelle avant le rigging.
2. **Master 3D** : un fichier Blender versionné et documenté, unités métriques, une caméra verrouillée par variante de cadrage, éclairages verrouillés, groupes `roof_cover`, `battens`, `underlay`, `insulation`, `structure`, `zinc`. Les interfaces des éléments doivent réellement coïncider à `progress=0`.
3. **Matériaux** : textures et normal maps PBR traçables ; micro-reliefs des tuiles, variations crédibles, bois non répétitif, membrane, isolant, zinc, fixations. Aucune simple extrusion de formes non texturées.
4. **Animation source** : positions spline/courbes d'animation à partir du master, trajectoires sans changement de caméra dans une même variante. Cinq stades intermédiaires et une vue éclatée finale ; trajet parfaitement inversable.
5. **Rendu** : comparaison sur 2–3 stills de contrôle (assemblé, mi-parcours, éclaté) avant de générer toutes les images. Encodage et nombre d'images dimensionnés selon mesures réelles de transfert/qualité pour desktop et mobile. Ne pas inventer un budget de Mo ou de FPS sans benchmark.
6. **Intégration** : `RoofExperience` isolé, labels HTML, progression continue clampée, image prédécodée et ring buffer de frames visibles, `requestAnimationFrame` à la demande, IntersectionObserver pour charger seulement près du viewport, placeholders statiques, reset/cleanup.
7. **Mobile** : composer spécifiquement en vertical ; grande scène au centre et légendes dans un groupe indépendant plutôt qu'une scène comprimée à 60 % de largeur ; conserver accès direct aux six couches et cibles tactiles >=44 px.
8. **Accessibilité** : `prefers-reduced-motion` → image statique + contenu lisible sans pin prolongé ; contrôles clavier et lecteurs d'écran ; `aria-live` dosé sans annonces pour chaque pixel de scroll.
9. **Versioning** : ne pas remplacer les PNG historiques ; conserver le master, les sources/licences, le pipeline d'export et le manifest de frames. Les PR de reconstruction devront montrer l'impact exact sur les fichiers et sur le poids initial.

## 5. Plan de validation obligatoire
- Captures **issues du vrai rendu** : 0, 1/6, 2/6, 3/6, 4/6, 5/6, 1 ; plus une frame de transition au milieu d'un déplacement.
- Résolutions : 390×844, 430×932, 768×1024, 1440×900.
- Scroll lent, scroll rapide, inverse, arrêt arbitraire, accès direct aux étapes, orientation/resize, reduced motion.
- Contrôler `performance.now()` / frame time, mémoire, réseau des assets et chargement initial sur device réel ou équivalent ; noter l'environnement exact.
- Tests Safari iPhone **non réalisés** tant qu'aucun appareil/environnement Safari ne permet une vraie séance de vérification.
- Build Next.js réussi et déploiement READY sont des **contrôles techniques**, non une validation visuelle.

## 6. État de cette intervention
**Réalisé :** lecture des composants, CSS, route de test, packages, docs et PR #1 ; traçabilité Git des huit PNG ; observation réelle de la gouttière `zinguerie.png` ; inspection du statut de déploiement Vercel existant.

**Non réalisé :** inspection visuelle complète des sept autres PNG, reconstruction/modélisation 3D, nouveaux rendus, nouvelle animation, captures écran de l'implémentation, tests appareils, build/QA de la nouvelle version.

**Blocage de production :** source 3D commune absente + inspection graphique de sept PNG indisponible via l'accès binaire présent. Obtenir les références comme fichiers consultables et produire/valider un master 3D fidèle **avant de lancer le développement**. Aucune branche `main` ni donnée Supabase modifiée.
