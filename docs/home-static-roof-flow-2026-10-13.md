# Laville Rénovation — Page d'accueil / nouvelle direction (13 octobre 2026)
Statut : **implémentation preview**, sans approbation finale ni fusion.

## Décision produit
Abandon définitif de l'animation scroll de la toiture :
- aucune immobilisation (pin), progression liée au scroll, boucle RAF, WebGL ou superposition d'images indépendantes ;
- **un visuel éclaté officiel** (`public/images/toiture/vue-eclatee.png`) en permanence ;
- six légendes HTML visibles, liées aux pages existantes des services ;
- miniature de la toiture complète (`vue-assemblee.png`) ouvrable dans un autre onglet ;
- pas de compteur fictif type `01/06` ni commandes « précédent/suivant » ;
- scroll vertical naturel, sans interférence avec la navigation.

## Parcours de la homepage
1. **Hero Bordeaux** — promesse « Le savoir-faire au sommet », devis principal, urgence toiture secondaire, lien vers les expertises. Photo de Bordeaux issue d'Unsplash (Louis Gaudiau, photo 1655751583650-83e331f71749, licence Unsplash).
2. **01. Nos expertises** — accès direct aux six prestations, carte photo + titre lisible, grille 6 desktop, 3 tablette, 2 mobile.
3. **02. Au cœur de votre toiture** — visuel éclaté dominant sur fond anthracite et légendes latérales sur desktop ; titre → visuel plein format → six légendes en dessous sur mobile ; sortie vers les prestations.
4. **Le geste & la matière** — respiration éditoriale et lien vers la présentation de l'entreprise.
5. **03. Réalisations récentes** — galerie teaser 3 cartes, lien vers la galerie entière. Les photos existantes restent des illustrations et la mention d'illustration est conservée.
6. **04. Bordeaux & alentours** — présentation de l'ancrage local, exemples de communes, sortie vers la page de zones.
7. **CTA** — « Une question ? Parlons de votre projet » vers demande de devis.

## Parcours de conversion
- Demande immédiate : hero / CTA final → `/demande-de-devis`.
- Intervention urgente : hero → `/prestations/urgence-toiture`.
- Exploration service : les six expertises → `/prestations/[slug]`.
- Compréhension pédagogique : toiture éclatée → six légendes → prestations existantes.
- Réassurance : approche + exemples + zone d'intervention → contact/devis.

## Design / responsive
- Identité conservée : Newsreader, DM Sans, crème/anthracite, accent terre cuite.
- Aucun changement à la navigation, aux autres pages, au design system global ni à Supabase.
- Classes CSS module isolées de l'ancien code `roof-approved`.
- Sur iPhone : visuel 100 % largeur disponible ; liste indépendante sans colonnes compressées ; éléments tactiles à hauteur minimale d'environ 76 px.
- Les textes et liens sont présents dans le HTML initial ; visuel unique chargé via Next Image / lazy loading sous la ligne de flottaison.
- Accessibilité : titre H2, alt descriptif, liste HTML ordonnée, focus des liens, pas de dépendance à un hover ni au mouvement.

## QA effective
- GitHub : branche `feature/home-static-roof-editorial`, PR #3 vers `feature/roof-photoreal-assets` en brouillon.
- Vercel : déploiement preview du commit `b0ff5cb021906ee45ce2eeadb158117676ba935a` **READY**.
- HTTP 200 : `/`, `/toiture-demo`, `/images/toiture/vue-eclatee.png` et `/images/toiture/vue-assemblee.png`.
- HTML inspecté : titres et six légendes présents ; ancien Canvas absent du rendu.
- PNG : image de toiture éclatée servie en PNG RGBA (canal alpha).
- **Non testés** : captures et inspections visuelles réelles dans un navigateur à 390×844 / 430×932 / 768×1024 / 1440×900 ; Safari iPhone ; contrastes mesurés ; Core Web Vitals.
- Les illustrations externes d'Unsplash nécessitent un contrôle de cohérence iconographique final avant publication du site client.

## À valider sur la preview avant fusion
1. Tuiles / liteaux / membranes / isolant / charpente / zinc clairement reconnaissables.
2. Absence de rectangle blanc derrière la toiture et bonne composition avec fond sombre.
3. Mobile : visuel jamais coupé, légendes toutes visibles, pas de débordement horizontal.
4. Compréhension immédiate du parcours et bonne hiérarchie des deux CTA.
5. Le reste de la plateforme reste inchangé.

Ne fusionner **aucune branche** dans `main` sans validation explicite du client.
