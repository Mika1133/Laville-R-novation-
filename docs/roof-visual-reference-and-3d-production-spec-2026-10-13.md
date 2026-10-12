# Toiture — Références visuelles et cahier de production 3D
**Date :** 13/10/2026  
**Références :** huit images fournies dans la conversation, correspondant aux huit noms du dossier `public/images/toiture/`.  
**Statut :** audit des références terminé ; **source 3D commune et nouvelles images animables non produites**.

## 1. Référence principale : vue assemblée
- **Forme** : échantillon de toiture traditionnelle à deux pans avec faîtage, versant avant majoritaire, coupe du pignon droit permettant de voir des éléments porteurs.
- **Caméra** : perspective architecturale 3/4 ; on regarde vers le pignon droit depuis un point légèrement au-dessus du débord et de la gouttière.
- **Couverture** : tuiles canal rouge orangé vieillies, creux et recouvrement crédibles, nombreux détails de matière (variation, taches, joints, ombres de contact).
- **Structure** : bois clair avec raccords métalliques ponctuels ; chevrons, appuis et triangulation visibles à la coupe ; texture veinée mate et variations naturelles.
- **Couche de protection** : nappe gris anthracite légèrement texturée sous les tuiles.
- **Isolant** : matériau beige fibreux, placé entre/au-dessus des bois de manière plausible selon le système validé par le couvreur.
- **Zinc** : gouttière demi-ronde et bande en rive avant, métal brossé gris froid, crochets/raccords discrets.
- **À retenir pour le web** : conserver l'équilibre architectural, la richesse photographique et l'angle principal. Le fond blanc des références devient un fond anthracite sur le site, sans déformer les valeurs des matériaux.

## 2. Diagnostic détaillé de chaque référence
| Fichier | Observation vérifiée | Rôle cible |
|---|---|---|
| `vue-assemblee.png` | Toiture complète **à deux pentes**, coupe de pignon droit et gouttière le long du débord au premier plan. | **Master** forme, perspective, proportions, DA. |
| `couverture.png` | Ensemble de tuiles canal en pente avec faîtage, mais cadrage/proportions différents de la vue complète. | Référence fidèle de matériau et du motif de recouvrement ; nouvelle géométrie impérative. |
| `liteaux.png` | Trame de liteaux et contre-liteaux présentée comme **un seul panneau** en perspective, non comme deux versants géométriquement correspondants. | Référence des sections, couleurs du bois et rythme ; reconstruire sur les deux pans. |
| `sous-toiture.png` | **Trois nappes planes séparées** avec léger relief/bord replié, composition déjà éclatée. | Référence de texture ; pour la version physique, une membrane continue par pan avec recouvrements et fixations crédibles (sous réserve de validation technique). |
| `isolation.png` | Empilement/panneau **plat** de matière fibreuse beige ; pas de profil de toit à deux versants. | Référence de rugosité et teinte ; refaire des panneaux positionnés à la pente des chevrons, sans dalle flottante. |
| `charpente.png` | Charpente **à deux versants et pignon triangulé**, bois clair avec chevêtre/liaisons métalliques visibles. Angle et longueur visuelle diffèrent de la couverture. | Référence pour la structure, reconstruction métrique du modèle commun. |
| `zinguerie.png` | Gouttière zinc isolée, avec crochets et raccords, vue sous une orientation indépendante. | Référence de matérialité ; la gouttière finale épouse **exactement** le débord avant réel. |
| `vue-eclatee.png` | Perspective photo attrayante, mais empilement avec sous-toiture représentée par plusieurs nappes et couches plus planes que les pans de toit ; groupes visuellement non imbriqués. | **Storyboard**, espacements, dramaturgie visuelle, **pas** source de maillage ni d'assemblage physique. |

### Incompatibilités à ne pas masquer
1. Les références n'ont pas de caméra calibrée ni d'échelle métrique partagée.
2. `liteaux`, `sous-toiture` et `isolation` ne couvrent pas naturellement les deux pentes du modèle principal.
3. La gouttière séparée ne s'aligne pas aux bords de la charpente par simple translation en pixels.
4. Une reconstruction exacte en 3D **à partir des seules images** n'est pas calculable de façon certaine sans conventions géométriques nouvelles.
5. Les visuels reçus dans la conversation comprennent plusieurs JPEG RGB de prévisualisation ; le dépôt conserve les PNG de référence d'origine, non modifiés.

## 3. Modèle maître nécessaire
**Livrable préalable obligatoire** : `assets/roof/master-roof.blend` ou équivalent éditable, avec définition paramétrique documentée et export GLB pour consultation.
- **Un seul espace de coordonnées** pour tous les groupes.
- **Un seul rig** et les mêmes ombres/lumières ; aucune texture de l'image assemblée appliquée sur des plans 2D.
- **Caméra principale verrouillée** pour le plan desktop ; cadrage mobile distinct autorisé, mais caméra fixe sur *chaque séquence* mobile.
- Géométrie *double pan* avec faîtage, rives, égouts, épaisseurs, pignons et raccords cohérents.
- Regroupement sémantique : `01_couverture` (tuiles + faîtières), `02_liteaux`, `03_ecran_sous_toiture`, `04_isolation`, `05_charpente`, `06_zinguerie` (gouttière/bavettes).
- Les groupes sont indépendants mais **se touchent ou s'appuient correctement à p=0**. Garder des collisions, assemblages et systèmes de fixation techniquement plausibles.
- L'absence d'une cotation réelle impose des paramètres *illustratifs* à valider (largeur, longueur, pente, hauteur des chevrons, espacement des liteaux). Ne pas figer des mesures réelles sans plan constructeur ou validation métier.
- Les six groupes doivent être exportables séparément **depuis cette même scène**. Les éléments doivent avoir leurs matériaux, normales, UV, dimensions et pivots documentés.

### Validation métier de la représentation
Une toiture réelle n'empile pas nécessairement les six éléments dans l'ordre d'un diagramme marketing. La **zinguerie** est raccordée aux rives et aux égouts, et ne doit pas devenir une sixième dalle horizontale. L'**isolation** peut être située entre chevrons, sous chevrons ou au-dessus selon le système. Choisir un schéma pédagogique constructivement plausible, documenté et approuvé par le couvreur ; éviter de prétendre qu'il représente toute toiture.

## 4. Storyboard de contrôle (progression continue)
- `0.00` — assemblée, aucune pièce ne flotte, rendu proche de `vue-assemblee`.
- `0.17` — dépose couverture suivant une trajectoire locale normale/hauteur avec recul léger, début révélation des liteaux.
- `0.33` — séparation des liteaux ; membrane visible et physiquement continue.
- `0.50` — sortie de membrane sans traverser ni masquer l'isolant.
- `0.67` — dégagement de l'isolant ; bois de charpente lisible.
- `0.83` — charpente isolée et structure présentée sans déplacement incohérent.
- `1.00` — zinguerie mise en évidence **au niveau des rives/égout** ; vue éclatée complète lisible.

Toutes les transformations doivent être définies en coordonnées communes, pilotées par **une seule variable** `p∈[0,1]` et être déterministes : à chaque p, le même état est rendu, qu'on défile vers le haut ou le bas. La caméra reste stable à l'intérieur d'un cadrage donné. Ne pas changer arbitrairement de rendu au passage d'une étape.

## 5. Méthode de livraison
**Gate A — Stills du modèle maître avant animation :**
1. rendre `assemblée` avec caméra/éclairage définitifs desktop + mobile ;
2. rendre `1/2 éclatée` ;
3. rendre `éclatée complète` ;
4. comparer les deux vues majeures aux références approuvées : tuiles, fibre, bois, métal, détails, cohérence du faîtage et de la gouttière, proportions et angle caméra ;
5. obtenir validation visuelle **avant** de générer toute une séquence.

**Gate B — Choix runtime sur données mesurées :**
- tester le poids et la qualité d'une petite séquence commune de 10–20 images, WebP/AVIF avec transparence si nécessaire, sur 390×844, 430×932, 768×1024 et 1440×900 ;
- comparer au GLB optimisé (draco/meshopt + KTX2) issu du master, sur Safari iPhone réel si possible ;
- choisir séquence Canvas ou WebGL selon **qualité visuelle conservée**, mémoire de décodage, transfert initial, coût GPU et qualité du scrub inverse ; ne pas décider du nombre final de frames sans ces mesures.

**Gate C — Intégration réelle :**
- section inchangée en dehors de son périmètre ;
- pin naturel sans scroll bloquant, `requestAnimationFrame` à la demande, images préchargées à proximité, fallback assemblé, reduced-motion, légendes HTML indexables ;
- composition mobile autonome : toiture au centre dominant ; labels dans une zone distincte lisible, boutons >=44×44 px ;
- screenshots de navigateur **du site réel** aux 7 étapes et à mi-transition sur les quatre résolutions ;
- tests sens inverse, scroll lent/rapide, direct au label, rotation/resize, Safari si disponible ; documenter chaque test réellement exécuté.

## 6. Statut réel et limitation de l'environnement
- **Oui :** huit références inspectées visuellement, code V4/PR et styles audités, références matérielles inventoriées.
- **Non :** fichier source Blender/GLB disponible ; le dépôt actuel ne contient que des images et des prototypes JS.
- **Non :** moteur Blender disponible dans l'environnement d'exécution actuel (`blender` introuvable à l'audit).
- **Non :** nouveau master 3D, rendu photoréaliste, capture réelle, tests iPhone et nouveau déploiement créés.
- **Ne pas lancer une nouvelle superposition photographique** sous prétexte que l'audit visuel est terminé.

**Décision : la réalisation du master 3D fidèle est la dépendance critique du développement.** Il est préférable d'obtenir/produire ce master dans Blender ou une station 3D équipée avant d'intégrer l'animation.
