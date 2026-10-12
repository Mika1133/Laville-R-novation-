# Étude géométrique 3D v0 — contrôle technique (13 octobre 2026)

**Statut : GABARIT DE TRAVAIL, NON VALIDÉ VISUELLEMENT.** Le GLB et les rendus de diagnostic sont fournis à l'utilisateur en fichiers téléchargeables dans cette conversation, **pas intégrés au dépôt**. Ce document ne constitue pas la livraison d'une animation premium.

## Production effectuée hors dépôt
- Source déterministe Python générant une géométrie de toiture double-pente, sans découpage ni superposition des PNG originaux.
- Export `laville-roof-common-geometry-v0.glb`, taille **7,33 MiB**, avec **6 groupes/meshes nommés** dans le même espace 3D, environ **127 944 triangles** au total.
- `01_couverture`, `02_liteaux`, `03_ecran_sous_toiture`, `04_isolation`, `05_charpente`, `06_zinguerie` : groupes distincts, même référentiel métrique et pivots initiaux sans translation.
- Paramètres et trajectoires de sortie dans `roof-model-manifest.json`. Les poses sont calculées à partir d'une progression unique (transformations déterministes, réversibles).
- Trois **images de contrôle de géométrie** produites avec VTK : assemblée, intermédiaire, éclatée. Il ne s'agit ni de rendus photographiques, ni de captures du site.
- Script `blender_render_setup.py` préparé pour ajouter des shaders PBR procéduraux et rendre des stills Cycles dans Blender. **Syntaxe Python vérifiée uniquement, exécution Blender non testée** : Blender absent de la session.

## QA factuelle
| Contrôle | Résultat |
|---|---|
| Chargement du GLB avec trimesh | OK |
| 6 groupes distincts dans la scène | OK |
| Matrices initiales d'assemblage identité | OK |
| 8 positions de pose déterministes testées | OK |
| Rendus techniques 3 états via VTK | Fichiers produits ; conformité artistique **NON** |
| Niveau photoréaliste des huit références | **ÉCHEC à ce stade** ; couleurs et détails schématiques |
| Validation de l'assemblage par un couvreur | Non réalisée |
| Rendu Cycles Blender et `.blend` éditable | Non réalisés |
| Intégration Next.js / captures de navigateur | Non réalisées |
| Vérification tactile iPhone / Safari | Non réalisée |
| Nouveau build Vercel | Non réalisé |

## Décision de qualité
**Ne pas intégrer le GLB dans `Roof.jsx` ni déployer ces images comme art final.** Les premiers rendus démontrent la cohérence du repère et la séparation des groupes, mais restent nettement en dessous de la photographie validée. La prochaine étape obligatoire est le **lookdev/modélisation 3D haut de gamme dans Blender ou outil équivalent** et l'approbation des trois vrais rendus comparés aux huit références, avant de produire les frames et de modifier l'application.

## Traçabilité et restrictions
- **Aucun PNG officiel remplacé.**
- **Aucun changement à `main`, à la navigation, aux autres pages ou à Supabase.**
- Le modèle, ses scripts, les trois captures VTK et le manifest se trouvent dans **l'archive remise à l'utilisateur dans la conversation**, non dans le repository distant ; les opérations GitHub ici sont limitées à la documentation pour éviter de publier un prototype comme production.
