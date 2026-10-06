# Le Grand Voyage — Spécification

Jeu web éducatif pour une enfant de 3 ans, joué avec un parent 15 à 30 min par jour.
Aucune lecture requise, tout est guidé par la voix, jamais d'échec punitif.

---

## 1. Principes

| Principe | Conséquence concrète |
|---|---|
| L'enfant ne sait pas lire | Toute consigne est dite à voix haute ; aucun texte n'est nécessaire pour jouer (le texte éventuel est décoratif) |
| 3 ans = motricité grossière | Cibles tactiles ≥ 96 px, espacées ≥ 24 px ; seulement **toucher** et **glisser** (pas de double-clic, pas d'appui long côté enfant) |
| Jamais punitif | Une erreur = petite animation neutre/drôle + la voix réencourage (« Presque ! Écoute encore… ») ; pas de vies, pas de chrono, pas de son « buzz » |
| Sons phonétiques exacts | Fichiers audio d'abord, synthèse vocale seulement en secours (voir §5) |
| Simple à maintenir | HTML/CSS/JS sans framework ni build, contenu déclaré dans un seul fichier de données |

---

## 2. Plateforme et technique

- **Stack** : `index.html` + CSS + modules JS natifs (ES modules). Aucun npm, aucun build.
- **Hébergement** : GitHub Pages (URL publique, gratuite).
- **Hors connexion** : PWA (manifest + service worker qui met en cache tous les fichiers à la première visite). Installable sur l'écran d'accueil de la tablette.
- **Cibles** : Chrome/Edge sur PC, Safari iPad, Chrome Android. Orientation **paysage** privilégiée (message visuel « tourne la tablette » en portrait).
- **Sauvegarde** : `localStorage` (progression, avatar, réglages) + `IndexedDB` (enregistrements micro du parent). Chaque appareil a sa propre sauvegarde ; **export/import** d'un fichier `.json` dans le mode parent pour passer de l'un à l'autre.
- **Données personnelles** : le prénom de l'enfant n'est **pas** écrit dans le code (le dépôt est public) ; il est saisi dans le mode parent et stocké localement.

### Arborescence cible

```
index.html
manifest.webmanifest
sw.js                  service worker (cache hors ligne)
css/style.css
js/
  main.js              routeur d'écrans (carte, monde, jeu, boutique, parent)
  store.js             sauvegarde/chargement, export/import
  audio.js             lecture son : enregistrement parent > fichier > synthèse vocale
  ui.js                récompenses, confettis, mascotte, utilitaires
  games/
    letters.js         Lettres
    numbers.js         Chiffres
    spanish.js         Espagnol
    sounds.js          Pré-lecture (son ↔ image)
    code.js            Initiation au code
    boss.js            Boss (enchaîne des mini-épreuves des autres jeux)
  data.js              TOUT le contenu : lettres, mots, mondes, grilles, boutique
audio/
  phonemes/            a.mp3, m.mp3, s.mp3 ...
  sfx/                 star.mp3, diamond.mp3, pop.mp3, whoosh.mp3, fanfare.mp3
  music/               une boucle douce par monde (optionnel)
fonts/                 police auto-hébergée (hors ligne)
```

---

## 3. Structure du jeu

### 3.1 Écran d'accueil et avatar (première partie)

1. Une voix accueille : « Bonjour ! Comment veux-tu être ? »
2. **Création du personnage** (petite fille), 3 choix seulement, chacun avec 6 à 8 grosses pastilles :
   - **Cheveux** : forme (court, long, couettes, tresses, bouclés, chignon) + couleur
   - **Yeux** : couleur
   - **Robe** : couleur
3. Bouton ✔ géant → la fille apparaît sur la carte. Le personnage reste modifiable plus tard (gratuitement) depuis la **Garde-robe**.

Avatar dessiné en **SVG en couches** (corps, cheveux, yeux, robe, accessoires) : changer une couleur = changer un `fill`, aucun dessin à produire par élément.

### 3.2 La carte du monde

Une carte illustrée avec **5 mondes = 5 pays de vos voyages**. Tous sont **ouverts dès le départ** (parcours libre). Un avion relie les pays (animation au déplacement).

| Monde | Décor / ambiance | Objets thématiques utilisés dans les exercices | Boss gentil |
|---|---|---|---|
| 🏙️ **Dubaï** | dunes, gratte-ciel, soleil | chameaux, palmiers, étoiles du désert, faucon | Le chameau qui a perdu sa tour |
| 🇪🇸 **Espagne** | soleil, plage, maisons blanches | oranges, guitares, éventails, taureau rigolo | Le taureau timide qui veut danser |
| 🌴 **Miami** | plage, palmiers, couleurs pastel | flamants roses, glaces, coquillages, dauphins | Le flamant qui ne sait plus voler |
| 🏜️ **Égypte** | pyramides, Nil | pyramides, chats, scarabées, crocodiles du Nil | Le sphinx qui pose des devinettes |
| 🏝️ **Guadeloupe** | île, volcan, cocotiers | noix de coco, tortues, poissons, bananes | La tortue endormie à réveiller |

Chaque monde contient **8 niveaux + 1 boss**, sur un petit chemin. Les niveaux d'un monde se débloquent **un par un** ; le boss se débloque quand les 8 niveaux sont faits. Chaque niveau = **1 activité d'une matière** ; les 5 matières sont mélangées dans chaque monde (ex. Lettres, Chiffres, Code, Espagnol, Sons, Lettres, Chiffres, Code).

**Difficulté indépendante du monde** : la progression est suivie **par matière** (et non par monde). Quel que soit le pays choisi, un niveau « Lettres » sert la prochaine étape du parcours Lettres de l'enfant. Le monde ne change que le décor et les objets. Ainsi l'ordre de visite libre ne casse pas la pédagogie.

Après 5 mondes terminés : les mondes se rejouent (« Saison 2 ») avec la suite des parcours par matière. Pas de fin de jeu.

### 3.3 Déroulé d'un niveau

- 5 à 6 questions courtes (≈ 2–3 min).
- Bonne réponse → ⭐ qui vole vers le compteur + son + la voix félicite (« Bravo [prénom] ! »), avec une phrase variée tirée au hasard.
- Erreur → l'objet tremble gentiment, la voix réexplique. Au 2ᵉ essai raté, la bonne réponse **brille** pour guider. On ne retire jamais d'étoile.
- Fin de niveau → 💎 diamant + petite danse de l'avatar.
- Bouton 🔊 toujours visible pour réécouter la consigne. Bouton 🏠 pour revenir à la carte.

### 3.4 Boss gentil (fin de monde)

Le boss a un « problème » (endormi, triste, perdu…). Pour l'aider, l'enfant réussit **5 mini-épreuves** prises dans les matières déjà vues (difficulté de son niveau actuel). Chaque réussite fait progresser une jauge visuelle (le boss se réveille petit à petit, sourit…). À la fin : grande fête + **bijou unique du monde** (collier de perles de Dubaï, peigne espagnol, bracelet coquillage de Miami, bijou de tête égyptien, boucles d'oreille fleurs de Guadeloupe) ajouté au coffre au trésor et porté automatiquement.

---

## 4. Les 5 matières

### 4.1 Lettres (son phonétique, MAJUSCULES uniquement)

On ne dit **jamais** le nom de la lettre (« èm ») mais son **son** (« mmm »). Majuscules d'imprimerie uniquement, police très lisible (pas de cursive).

**Ordre d'apprentissage** (par groupes de 3 à 4, avec révision permanente des groupes déjà vus) :

| Étape | Lettres | Sons |
|---|---|---|
| 1 | A, I, O | a, i, o |
| 2 | M, S, L | mmm, sss, lll |
| 3 | U, E, F | u, e (comme « le »), fff |
| 4 | R, V, N | rrr, vvv, nnn |
| 5 | J, Z, CH* | jjj, zzz |
| 6 | P, T, B, D | p, t, b, d (soufflés, très brefs, sans « eu » final) |
| 7 | C, G, K | k (C et K), g dur |

*CH est exclu (son composé) ; H, Q, W, X, Y sont exclus en v1.

**Mini-jeux** :
- **Trouve la lettre** : la voix dit « mmm » → 2 à 4 grosses lettres → toucher la bonne. (Le nombre de choix augmente avec le niveau.)
- **Écoute la lettre** : une lettre apparaît, l'enfant la touche, elle entend son son et le répète avec papa/maman (pas de reconnaissance vocale).
- **Trace du doigt** (bonus) : suivre la lettre en pointillés avec le doigt ; la trace se remplit de paillettes. Tolérance très large, réussi dans tous les cas.

### 4.2 Chiffres (1 à 10)

Parcours : 1–3 → 1–5 → 1–7 → 1–10.

**Mini-jeux** :
- **Compte avec moi** : N objets du monde (chameaux, flamants…) ; l'enfant touche chaque objet, la voix compte « un, deux, trois… », l'objet saute. Fin : « Il y en a trois ! »
- **Trouve le chiffre** : la voix dit « cinq » → toucher le bon chiffre parmi 2 à 4.
- **Associe quantité ↔ chiffre** : glisser un chiffre vers le panier contenant le bon nombre d'objets (2 à 3 paniers).
- **Remplis le panier** : « Mets 4 oranges dans le panier » → glisser les objets un par un, la voix compte à chaque dépôt.

### 4.3 Espagnol

Image (emoji/SVG) + **voix espagnole** (accent d'Espagne). La voix française présente, la voix espagnole dit le mot : « En espagnol, on dit… *gato* ! »

**Vocabulaire** (~90 mots, introduits par thèmes de 5) :

| Thème | Mots |
|---|---|
| Couleurs | rojo, azul, amarillo, verde, naranja, rosa, morado, blanco, negro, marrón |
| Animaux | gato, perro, pájaro, pez, caballo, vaca, cerdo, león, elefante, mono, camello, flamenco, tortuga, cocodrilo |
| Chiffres | uno … diez |
| Verbes | comer, beber, caminar, jugar, dormir, nadar, bailar, cantar, ¡quieto! (ne pas bouger), escuchar, hablar, saltar, correr |
| Objets du quotidien | silla, mesa, bicicleta, coche, escuela, casa, ropa, cama, plato, vaso, pelota, libro |
| Le corps | cabeza, ojos, pelo, mano, pie, boca, nariz, orejas, brazo, pierna |
| La famille | mamá, papá, hermano, hermana, abuelo, abuela, tío, tía, primo, prima, amigo, amiga, bebé |

(Pour la famille, on utilise **mamá/papá**, plus naturel pour un enfant que *madre/padre*.)

**Mini-jeux** :
- **Découverte** : 5 cartes du thème, toucher une carte = entendre le mot.
- **Trouve l'image** : voix espagnole « ¡perro! » → toucher la bonne image parmi 2 à 4.
- **Jacques a dit / Simón dice** (verbes, à faire ensemble) : la voix dit « ¡Bailar! », l'avatar fait l'action, l'enfant et le parent la miment pour de vrai, puis touchent ✔. Spécialement pensé pour le jeu à deux.
- **Les couleurs** : peindre un objet du monde avec la couleur demandée (« ¡azul! »).

### 4.4 Pré-lecture : associer un son à une image

La voix fait un son isolé (« sss ») → l'enfant touche l'image dont le mot **commence** par ce son. Le jeu suit le parcours Lettres (seuls les sons déjà vus sont utilisés).

Exemples d'images (emoji) : S 🐍 serpent · M 🐭 mouton/🍯 miel · L 🦁 lion · F 🧚 fée/🔥 feu · R 🤖 robot · V 🚲 vélo · N ☁️ nuage · A ✈️ avion · I 🏝️ île · O 🦢 oie · P 🍕 pizza · T 🐢 tortue · B 🍌 banane · CH exclu.

Variantes :
- **Le son mystère** : 2 puis 3 images.
- **Le panier des sons** : glisser toutes les images qui commencent par « mmm » dans le panier de la lettre M (niveau avancé).

Les mots des images (« serpent ») sont dits par la synthèse vocale française (fiable pour des mots entiers) ou par un fichier si disponible.

### 4.5 Initiation au code

L'avatar se déplace sur une grille ; 4 **grosses flèches** en bas de l'écran. **Chaque flèche déplace le personnage immédiatement** d'une case (pas de programme à exécuter).

**But** : rejoindre le trésor du monde (coffre, glace, coquillage…).

**Pièges** (thème du monde) : trou de sable, crocodile, cactus, flaque, crabe. Toucher un piège n'est **jamais un échec** : le personnage fait un petit saut en arrière, rigole, et la voix dit « Oups, le crocodile fait la sieste ! Passe à côté ! ». Le personnage revient sur la case précédente.

| Étape | Grille | Pièges | Particularité |
|---|---|---|---|
| 1 | 3×3 | 0 | ligne droite |
| 2 | 4×4 | 0–1 | un virage |
| 3 | 5×5 | 2–3 | il faut contourner |
| 4 | 5×5 | 4–5 | chemin plus long, ramasser 1 étoile en route |
| 5 | 6×6 | 5–7 | ramasser 2–3 étoiles avant le trésor |

Les grilles sont **écrites à la main** dans `data.js` (format texte simple, ex. `"S..C.", ".X...", "..X.T"` : S = départ, T = trésor, X = piège, * = étoile), pas de génération automatique.

---

## 5. Voix et audio

### 5.1 Ordre de priorité (`audio.js`)

Pour chaque son à jouer (`id` : `phoneme_m`, `es_perro`, `fr_bravo_1`…) :

1. **Enregistrement du parent** (IndexedDB), s'il existe
2. **Fichier audio** livré avec le jeu (`audio/...mp3`)
3. **Synthèse vocale** du navigateur (`speechSynthesis`, `fr-FR` ou `es-ES`), en dernier recours

### 5.2 Origine des fichiers de sons phonétiques (sans travail pour le parent)

Le parent ne doit **rien** avoir à enregistrer. Les sons isolés des lettres sont fournis ainsi :

- **Source** : les enregistrements libres de droits de l'**alphabet phonétique international sur Wikimedia Commons** (un fichier par son : [m], [s], [l], [f], [v], [ʒ], [z], [ʁ], [a], [i], [o], [y], [ə], [p], [t]…). Ils sont téléchargés **une seule fois pendant le développement**, convertis en MP3 courts, normalisés en volume et commités dans `audio/phonemes/`. La licence et la provenance de chaque fichier sont notées dans `audio/CREDITS.md`.
- **Contrôle qualité** : une page de test cachée (`?test=sons`) joue tous les sons à la suite pour une écoute de validation par le parent (5 min, une fois).
- Les consonnes continues (m, s, f, l, v…) seront **allongées** (≈ 1 s) si l'enregistrement source est trop court.

### 5.3 Le reste de la voix

- **Consignes et félicitations en français** (« Touche le serpent ! », « Bravo ! ») : synthèse vocale `fr-FR` (fiable sur des phrases). Le prénom est inséré dans certaines félicitations.
- **Mots espagnols** : synthèse vocale `es-ES` (fiable sur des mots entiers).
- Au démarrage, `audio.js` choisit la meilleure voix disponible (préférence aux voix « Natural », « Google », « Siri » / « Premium ») et la garde.
- **Si aucune voix `es-ES` n'est installée** sur l'appareil, le mode parent l'indique avec une explication pour en installer une.

### 5.4 Enregistrement par le parent (optionnel)

Non obligatoire, uniquement pour **corriger un son** qui ne plaît pas. Dans le mode parent : liste des sons, ▶ écouter, ● enregistrer (2 s max, micro via `MediaRecorder`), 🗑 revenir au son d'origine. Les enregistrements sont inclus dans l'export/import.

### 5.5 Effets sonores et musique

Petits sons de récompense joyeux (étoile, diamant, pop, fanfare du boss), une musique douce et légère par monde (désactivable). Sources libres de droits (ex. CC0), créditées dans `audio/CREDITS.md`.

---

## 6. Récompenses, boutique et garde-robe

### 6.1 Monnaie

| Récompense | Comment l'obtenir |
|---|---|
| ⭐ Étoile | chaque bonne réponse (≈ 5 par niveau) |
| 💎 Diamant | chaque niveau terminé ; 3 💎 bonus pour un boss |
| 👑 Bijou unique | un par boss (non achetable) |

### 6.2 Boutique (« La boutique des trésors »)

Accessible depuis la carte (gros bouton coffre). Les articles sont des images avec leur prix en icônes (⭐⭐⭐ ou 💎), sans chiffres à lire ; un article trop cher apparaît grisé avec un cadenas doux (« Encore quelques étoiles ! »).

- **Bijoux et accessoires** (prix en ⭐) : colliers, boucles d'oreille, bracelets, bijoux de tête/diadèmes, barrettes, lunettes de soleil, sacs, chapeaux. Environ 25 articles, plusieurs couleurs.
- **Costumes** (prix en 💎, plus rares) : voir §6.3.

Prix calibrés pour qu'une séance de 20 min permette **un achat environ** (récompense quotidienne visible).

### 6.3 ⚠️ Costumes « univers Disney / dessins animés »

Stitch, Monstres & Cie, Peppa Pig et Bluey sont des **marques protégées**. Le jeu étant publié sur une URL publique, on **ne reproduit ni leurs dessins, ni leurs noms, ni leurs logos**. On crée à la place des **costumes clins d'œil** dessinés en SVG simple, que la famille reconnaîtra :

| Costume | Inspiration |
|---|---|
| Petit extraterrestre bleu aux grandes oreilles | Stitch |
| Gros monstre bleu tout doux à taches | Monstres & Cie |
| Petit cochon rose | Peppa Pig |
| Chienne bleue joueuse | Bluey |

Les costumes se mettent par-dessus l'avatar (oreilles, couleur de peau/fourrure, queue).

### 6.4 Garde-robe et coffre au trésor

- **Garde-robe** : changer cheveux, yeux, robe (gratuit) et porter ou retirer les articles achetés.
- **Coffre au trésor** : vitrine de tous les bijoux de boss (cases vides en silhouette pour donner envie).

---

## 7. Séance et rituel de fin

- Durée réglée par le parent au démarrage de chaque session : **15 à 30 min** (par défaut 20), par une simple glissière dans l'écran de lancement parent.
- Pas de chrono visible pour l'enfant, sauf un petit soleil qui se couche lentement dans le coin de la carte.
- À la fin du temps, on termine le niveau en cours (jamais d'interruption), puis le **rituel doux** :
  1. L'avatar bâille, le décor passe en soirée.
  2. « On range les trésors ! » : l'enfant glisse les étoiles gagnées dans le coffre (récapitulatif visuel de la journée).
  3. « Bravo [prénom], à demain ! » + bisou de l'avatar.
- Le parent peut prolonger (« +5 min ») depuis le mode parent.

---

## 8. Mode parent

**Accès** : petit cadenas 🔒 dans un coin, **appui long de 3 s** (anneau qui se remplit).

Contenu (ici, le texte est permis) :
- Prénom de l'enfant
- Durée par défaut de la séance (15–30 min)
- Volume musique / effets / voix, musique on/off
- Progression par matière (lettres et sons maîtrisés, chiffres, mots espagnols vus), avec possibilité de **régler manuellement le niveau** d'une matière (avancer ou revenir en arrière)
- Sons : test de tous les sons, enregistrement de remplacement (§5.4)
- État des voix de synthèse disponibles (fr-FR, es-ES)
- **Exporter / Importer** la sauvegarde (`.json`, enregistrements inclus)
- Réinitialiser (avec double confirmation)

---

## 9. Direction visuelle

- **Ambiance** : carte de voyage illustrée, couleurs vives mais douces, formes très arrondies, gros contours, rien de petit ni de chargé. Un seul focus par écran.
- **Palette** (variables CSS) : fond crème `#FFF7E8`, corail `#FF7A6B`, turquoise `#2EC4B6`, jaune soleil `#FFD23F`, lilas `#B28DFF`, vert feuille `#7BD389`, texte/contours prune `#3D2C4E`. Chaque monde a sa couleur dominante (Dubaï sable/or, Espagne rouge/jaune, Miami rose/turquoise, Égypte ocre/lapis, Guadeloupe vert/bleu lagon).
- **Typographie** : police ronde très lisible pour les lettres et chiffres (ex. *Andika*, conçue pour l'apprentissage de la lecture, ou *Fredoka*), **auto-hébergée** pour fonctionner hors ligne. Lettres à apprendre affichées très grandes (≥ 160 px).
- **Illustrations** : emoji + formes SVG dessinées dans le code (aucun fichier image à produire). Avatar et costumes en SVG en couches.
- **Boutons** : ≥ 96 px, en relief (ombre sous le bouton), qui s'enfoncent au toucher + petit « pop ».
- **Animations** : rebonds, confettis, étoiles qui volent vers le compteur (CSS + petites animations JS). Respect de `prefers-reduced-motion`.
- **Retour au toucher** : chaque toucher produit un son ou une animation, pour que l'enfant sache que son geste a été pris en compte.
- **Interface sans texte** : icônes universelles uniquement (🏠 maison, 🔊 réécouter, 🛍️ boutique, 👗 garde-robe).

---

## 10. Modèle de données (sauvegarde)

```js
{
  version: 1,
  childName: "",                // saisi dans le mode parent
  avatar: { hairStyle, hairColor, eyeColor, dressColor, worn: ["necklace_pearl", ...], costume: null },
  wallet: { stars: 0, diamonds: 0 },
  owned: ["necklace_pearl", ...],
  bossJewels: ["dubai", ...],
  worlds: { dubai: { levelsDone: 3, bossDone: false }, ... },
  skills: {                     // progression par matière, indépendante du monde
    letters: { step: 2, mastery: { A: 0.9, M: 0.4, ... } },
    numbers: { step: 1 },
    spanish: { theme: "animals", seen: ["gato", ...] },
    sounds:  { step: 1 },
    code:    { level: 4 }
  },
  settings: { sessionMinutes: 20, music: true, volumes: {...} }
}
```

Une lettre ou un mot ratés reviennent plus souvent (`mastery` simple : +0,2 si réussi au 1ᵉʳ essai, −0,1 sinon) ; une étape est franchie quand toutes ses lettres dépassent 0,8.

---

## 11. Hors périmètre (v1)

- Synchronisation automatique entre appareils (remplacée par export/import)
- Plusieurs profils enfants
- Reconnaissance vocale
- Sons composés (ou, on, ch…), minuscules, cursive
- Comptes, serveur, publicité, achats réels

---

## 12. Plan de livraison

1. **Socle** : écrans, carte, avatar, sauvegarde, `audio.js`, PWA hors ligne, mode parent minimal.
2. **Lettres + Pré-lecture** (avec le pipeline des sons Wikimedia et la page `?test=sons`).
3. **Chiffres**.
4. **Code** (grilles 3×3 → 6×6 avec pièges).
5. **Espagnol** (dont *Simón dice*).
6. **Boss, boutique, garde-robe, costumes, rituel de fin**.
7. Publication GitHub Pages + test sur la tablette réelle.

Chaque étape est jouable seule, pour pouvoir commencer à jouer avec l'enfant dès l'étape 2.

---

## 13. Points à valider

- Les sons Wikimedia (§5.2) doivent être écoutés une fois par le parent ; en cas de son raté, le mode parent permet de le remplacer, mais ce ne sera pas nécessaire en temps normal.
- Les objets et boss de chaque pays sont des propositions, à personnaliser avec vos souvenirs de voyage (un plat, un monument, un animal vu là-bas).
