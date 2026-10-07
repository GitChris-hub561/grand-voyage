// Tout le contenu du jeu est déclaré ici.

export const SUBJECTS = {
  letters: { icon: '🔤', color: '#FF7A6B', name: 'les lettres' },
  numbers: { icon: '🔢', color: '#2EC4B6', name: 'les chiffres' },
  sounds:  { icon: '👂', color: '#B28DFF', name: 'les sons' },
  spanish: { icon: '💬', color: '#FFB703', name: "l'espagnol" },
  code:    { icon: '🧭', color: '#5CC971', name: 'le code' },
};

// Matière de chacun des 8 niveaux d'un monde (identique pour tous les mondes).
export const LEVEL_PLAN = ['letters', 'numbers', 'code', 'spanish', 'sounds', 'letters', 'numbers', 'code'];

// Il n'existe pas d'emoji pyramide : on la dessine.
const PYRAMIDS = '<svg viewBox="0 0 100 70" class="lm-svg"><polygon points="8,68 40,14 72,68" fill="#E8B860" stroke="#3D2C4E" stroke-width="4" stroke-linejoin="round"/><polygon points="48,68 72,30 96,68" fill="#F2CF86" stroke="#3D2C4E" stroke-width="4" stroke-linejoin="round"/></svg>';

// x, y : position sur la carte (en %). landmark : emoji ou SVG. objects : emoji utilisés dans les exercices.
export const WORLDS = [
  {
    id: 'miami', trap: '🦀', treasure: '🍦', name: 'Miami', landmark: '🌴', x: 17, y: 42,
    sky: '#FFD6E7', ground: '#7FDBDA', accent: '#FF6FA8',
    objects: ['🦩', '🍦', '🐚', '🐬', '🌴'],
    boss: { emoji: '🦩', says: 'Le flamant rose ne sait plus voler. On l\'aide ?' },
    jewel: { id: 'jewel_miami', emoji: '🐚', name: 'le bracelet coquillage' },
  },
  {
    id: 'guadeloupe', trap: '🐊', treasure: '🥥', name: 'Guadeloupe', landmark: '🏝️', x: 30, y: 72,
    sky: '#C8F3FF', ground: '#5CC971', accent: '#1E9E6A',
    objects: ['🥥', '🐢', '🐠', '🍌', '🌺'],
    boss: { emoji: '🐢', says: 'La tortue dort profondément. On la réveille ?' },
    jewel: { id: 'jewel_guadeloupe', emoji: '🌺', name: 'les boucles d\'oreille fleurs' },
  },
  {
    id: 'spain', trap: '🌵', treasure: '🍊', name: 'Espagne', landmark: '🏰', x: 50, y: 30,
    sky: '#FFF1B8', ground: '#FFB070', accent: '#E63946',
    objects: ['🍊', '🎸', '💃', '🐂', '☀️'],
    boss: { emoji: '🐂', says: 'Le taureau est trop timide pour danser. On l\'aide ?' },
    jewel: { id: 'jewel_spain', emoji: '🌹', name: 'le peigne à fleur' },
  },
  {
    id: 'egypt', trap: '🐍', treasure: '🏺', name: 'Égypte', landmark: PYRAMIDS, x: 63, y: 56,
    sky: '#FFE9C2', ground: '#E8B860', accent: '#2856A3',
    objects: ['🐈', '🐊', '🪲', '🐫', '🌙'],
    boss: { emoji: '🦁', says: 'Le sphinx a des devinettes pour toi !' },
    jewel: { id: 'jewel_egypt', emoji: '🪲', name: 'le bijou de tête doré' },
  },
  {
    id: 'dubai', trap: '🌵', treasure: '💎', name: 'Dubaï', landmark: '🏙️', x: 81, y: 40,
    sky: '#FFE3A3', ground: '#F2C46D', accent: '#C98A1B',
    objects: ['🐪', '🌴', '🦅', '⭐', '💎'],
    boss: { emoji: '🐪', says: 'Le chameau a perdu sa tour. On la retrouve ?' },
    jewel: { id: 'jewel_dubai', emoji: '📿', name: 'le collier de perles' },
  },
];

export const AVATAR_OPTIONS = {
  hairStyle: ['court', 'long', 'couettes', 'tresses', 'boucles', 'afro', 'chignon'],
  hairColor: ['#2B1A12', '#5A3420', '#9C4F2A', '#E8C27A', '#121212', '#E86AA6', '#8E6BD8'],
  eyeColor: ['#4A2C17', '#1E6FB8', '#2E8B57', '#8A6A3B', '#5B5B6E'],
  dressColor: ['#FF7A6B', '#FF6FA8', '#B28DFF', '#2EC4B6', '#FFD23F', '#5CC971', '#4D8BFF', '#FFFFFF'],
  skin: ['#FFE0C7', '#F5C9A0', '#D9A066', '#A8693D', '#6E4426'],
};

export const DEFAULT_AVATAR = {
  hairStyle: 'couettes', hairColor: '#5A3420', eyeColor: '#4A2C17', dressColor: '#FF6FA8', skin: '#F5C9A0',
};

export const PRAISE = [
  'Bravo {name} !', 'Super !', 'Génial !', 'Tu es trop forte !', 'Waouh, bien joué !', 'Magnifique !', 'Oui, c\'est ça !',
];

/* ---------- Lettres : son phonétique, jamais le nom de la lettre ---------- */

export const LETTER_STEPS = [['A', 'I', 'O'], ['M', 'S', 'L'], ['U', 'E', 'F'], ['R', 'V', 'N'], ['J', 'Z'], ['P', 'T', 'B', 'D'], ['C', 'G', 'K']];

// [fichier audio/phonemes/<x>.mp3, texte de secours pour la synthèse vocale]
export const PHONEME = {
  A: ['a', 'a'], E: ['e', 'eu'], I: ['i', 'i'], O: ['o', 'o'], U: ['u', 'u'],
  M: ['m', 'mmmm'], S: ['s', 'ssss'], L: ['l', 'llll'], F: ['f', 'ffff'], R: ['r', 'rrrr'], V: ['v', 'vvvv'],
  N: ['n', 'nnnn'], J: ['j', 'jjjj'], Z: ['z', 'zzzz'],
  P: ['p', 'p'], T: ['t', 't'], B: ['b', 'b'], D: ['d', 'd'], C: ['k', 'k'], K: ['k', 'k'], G: ['g', 'g'],
};

// Pré-lecture : images dont le mot commence par le son de la lettre (E n'a pas de mot simple).
export const SOUND_WORDS = {
  A: [['✈️', 'avion'], ['🍍', 'ananas'], ['🐝', 'abeille']],
  I: [['🏝️', 'île'], ['🦎', 'iguane']],
  O: [['🦴', 'os'], ['🍊', 'orange']],
  U: [['🏭', 'usine']],
  M: [['🐑', 'mouton'], ['🍯', 'miel'], ['🏍️', 'moto'], ['🍉', 'melon']],
  S: [['🐍', 'serpent'], ['☀️', 'soleil'], ['🐭', 'souris'], ['🎒', 'sac']],
  L: [['🦁', 'lion'], ['🌙', 'lune'], ['🐰', 'lapin'], ['🥛', 'lait']],
  F: [['🔥', 'feu'], ['🧚', 'fée'], ['🌸', 'fleur'], ['🍓', 'fraise']],
  R: [['🤖', 'robot'], ['🌹', 'rose'], ['🦊', 'renard']],
  V: [['🚲', 'vélo'], ['🐄', 'vache'], ['🚗', 'voiture']],
  N: [['☁️', 'nuage'], ['👃', 'nez']],
  J: [['🦒', 'girafe'], ['🧃', 'jus']],
  Z: [['🦓', 'zèbre']],
  P: [['🍕', 'pizza'], ['🐧', 'pingouin'], ['🍐', 'poire'], ['🐼', 'panda']],
  T: [['🐢', 'tortue'], ['🍅', 'tomate'], ['🐯', 'tigre'], ['🚂', 'train']],
  B: [['🍌', 'banane'], ['⛵', 'bateau'], ['🎈', 'ballon'], ['🐋', 'baleine']],
  D: [['🐬', 'dauphin'], ['🦖', 'dinosaure'], ['🎲', 'dé'], ['🦷', 'dent']],
  C: [['🦆', 'canard'], ['🥕', 'carotte'], ['🐷', 'cochon']],
  K: [['🐨', 'koala'], ['🦘', 'kangourou']],
  G: [['🍰', 'gâteau'], ['🎸', 'guitare'], ['🦍', 'gorille']],
};

/* ---------- Chiffres ---------- */

export const NUMBER_WORDS = ['zéro', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf', 'dix'];
export const NUMBER_MAX = [3, 5, 7, 10];   // plus grand nombre par étape

/* ---------- Espagnol : paquets de 5 mots, joués dans l'ordre ---------- */

const TABLE = '<svg viewBox="0 0 100 80" class="lm-svg"><rect x="8" y="18" width="84" height="12" rx="4" fill="#C98A1B" stroke="#3D2C4E" stroke-width="4"/><rect x="18" y="30" width="10" height="44" rx="3" fill="#C98A1B" stroke="#3D2C4E" stroke-width="4"/><rect x="72" y="30" width="10" height="44" rx="3" fill="#C98A1B" stroke="#3D2C4E" stroke-width="4"/></svg>';
const dot = c => `<span class="dot" style="background:${c}"></span>`;

// [image, mot espagnol, mot français]. verbs : on mime l'action (Simón dice).
export const SPANISH = [
  { words: [[dot('#E63946'), 'rojo', 'rouge'], [dot('#2F6FED'), 'azul', 'bleu'], [dot('#FFD23F'), 'amarillo', 'jaune'], [dot('#3DBE5C'), 'verde', 'vert'], [dot('#FF8C1A'), 'naranja', 'orange']] },
  { words: [['🐱', 'gato', 'chat'], ['🐶', 'perro', 'chien'], ['🐦', 'pájaro', 'oiseau'], ['🐟', 'pez', 'poisson'], ['🐴', 'caballo', 'cheval']] },
  { words: [['1', 'uno', 'un'], ['2', 'dos', 'deux'], ['3', 'tres', 'trois'], ['4', 'cuatro', 'quatre'], ['5', 'cinco', 'cinq']] },
  { words: [['👩', 'mamá', 'maman'], ['👨', 'papá', 'papa'], ['👶', 'bebé', 'bébé'], ['👴', 'abuelo', 'papi'], ['👵', 'abuela', 'mamie']] },
  { verbs: true, words: [['😋', 'comer', 'manger'], ['🥤', 'beber', 'boire'], ['😴', 'dormir', 'dormir'], ['💃', 'bailar', 'danser'], ['🎤', 'cantar', 'chanter']] },
  { words: [['👀', 'ojos', 'les yeux'], ['👃', 'nariz', 'le nez'], ['👄', 'boca', 'la bouche'], ['👂', 'orejas', 'les oreilles'], ['✋', 'mano', 'la main']] },
  { words: [['🪑', 'silla', 'chaise'], [TABLE, 'mesa', 'table'], ['🚲', 'bicicleta', 'vélo'], ['🚗', 'coche', 'voiture'], ['🏠', 'casa', 'maison']] },
  { words: [[dot('#FF6FA8'), 'rosa', 'rose'], [dot('#8E4FD8'), 'morado', 'violet'], [dot('#FFFFFF'), 'blanco', 'blanc'], [dot('#222222'), 'negro', 'noir'], [dot('#8B5A2B'), 'marrón', 'marron']] },
  { words: [['🐮', 'vaca', 'vache'], ['🐷', 'cerdo', 'cochon'], ['🦁', 'león', 'lion'], ['🐘', 'elefante', 'éléphant'], ['🐵', 'mono', 'singe']] },
  { words: [['6', 'seis', 'six'], ['7', 'siete', 'sept'], ['8', 'ocho', 'huit'], ['9', 'nueve', 'neuf'], ['10', 'diez', 'dix']] },
  { verbs: true, words: [['🚶‍♀️', 'caminar', 'marcher'], ['🧸', 'jugar', 'jouer'], ['🏊‍♀️', 'nadar', 'nager'], ['🧍‍♀️', '¡quieto!', 'ne bouge plus'], ['👂', 'escuchar', 'écouter']] },
  { words: [['👦', 'hermano', 'frère'], ['👧', 'hermana', 'sœur'], ['🧔', 'tío', 'tonton'], ['👩‍🦰', 'tía', 'tata'], ['🧒', 'amigo', 'ami']] },
  { words: [['💇‍♀️', 'pelo', 'les cheveux'], ['🦶', 'pie', 'le pied'], ['💪', 'brazo', 'le bras'], ['🦵', 'pierna', 'la jambe'], ['🙂', 'cabeza', 'la tête']] },
  { words: [['🏫', 'escuela', 'école'], ['👕', 'ropa', 'habits'], ['🛏️', 'cama', 'lit'], ['⚽', 'pelota', 'ballon'], ['📖', 'libro', 'livre']] },
  { words: [['🐫', 'camello', 'chameau'], ['🦩', 'flamenco', 'flamant'], ['🐢', 'tortuga', 'tortue'], ['🐊', 'cocodrilo', 'crocodile'], ['🐸', 'rana', 'grenouille']] },
  { verbs: true, words: [['🗣️', 'hablar', 'parler'], ['🤸‍♀️', 'saltar', 'sauter'], ['🏃‍♀️', 'correr', 'courir'], ['👋', '¡hola!', 'bonjour'], ['🥱', '¡adiós!', 'au revoir']] },
];

/* ---------- Boutique : bijoux (étoiles), costumes (diamants), bijoux de boss (gagnés) ---------- */

// slot : un seul objet porté par emplacement. style : dessin dans avatar.js.
export const SHOP = [
  { id: 'bow_red', name: 'le nœud rouge', slot: 'head', style: 'bow', color: '#FF4D6D', stars: 5 },
  { id: 'bracelet_lilac', name: 'le bracelet violet', slot: 'wrist', style: 'ring', color: '#B28DFF', stars: 6 },
  { id: 'bracelet_green', name: 'le bracelet vert', slot: 'wrist', style: 'ring', color: '#5CC971', stars: 6 },
  { id: 'necklace_pink', name: 'le collier rose', slot: 'neck', style: 'beads', color: '#FF6FA8', stars: 8 },
  { id: 'necklace_gold', name: 'le collier doré', slot: 'neck', style: 'beads', color: '#FFC83D', stars: 10 },
  { id: 'earrings_blue', name: 'les boucles d\'oreille bleues', slot: 'ears', style: 'drop', color: '#4D8BFF', stars: 10 },
  { id: 'earrings_gold', name: 'les boucles d\'oreille dorées', slot: 'ears', style: 'drop', color: '#FFC83D', stars: 12 },
  { id: 'headjewel_turquoise', name: 'le bijou de tête turquoise', slot: 'head', style: 'forehead', color: '#2EC4B6', stars: 15 },
  { id: 'tiara', name: 'le diadème de princesse', slot: 'head', style: 'tiara', color: '#FFC83D', stars: 20 },
  { id: 'crown', name: 'la couronne de reine', slot: 'head', style: 'crown', color: '#FFC83D', stars: 30 },
  { id: 'costume_alien', name: 'le costume de petit extraterrestre bleu', slot: 'costume', style: 'alien', skin: '#5B8DEF', diamonds: 3 },
  { id: 'costume_pig', name: 'le costume de petit cochon rose', slot: 'costume', style: 'pig', skin: '#FFB3C7', diamonds: 3 },
  { id: 'costume_dog', name: 'le costume de chienne bleue', slot: 'costume', style: 'dog', skin: '#7FB2E5', diamonds: 4 },
  { id: 'costume_monster', name: 'le costume de gros monstre tout doux', slot: 'costume', style: 'monster', skin: '#4FC3E8', diamonds: 5 },
  // Gagnés contre les boss (voir WORLDS[].jewel.id).
  { id: 'jewel_miami', name: 'le bracelet coquillage', slot: 'wrist', style: 'shells', color: '#FFE4D6', boss: true },
  { id: 'jewel_guadeloupe', name: 'les boucles d\'oreille fleurs', slot: 'ears', style: 'flower', color: '#FF5FA2', boss: true },
  { id: 'jewel_spain', name: 'le peigne à fleur', slot: 'head', style: 'rose', color: '#E63946', boss: true },
  { id: 'jewel_egypt', name: 'le bijou de tête doré', slot: 'head', style: 'forehead', color: '#FFC83D', boss: true },
  { id: 'jewel_dubai', name: 'le collier de perles', slot: 'neck', style: 'beads', color: '#FFFFFF', boss: true },
];

/* ---------- Drapeaux (les emoji drapeaux ne s'affichent pas sous Windows) ---------- */

const flag = inner => `<svg viewBox="0 0 30 20" class="flag-svg">${inner}<rect width="30" height="20" fill="none" stroke="#3D2C4E" stroke-width="1.2"/></svg>`;
const stripes = (colors, vertical) => colors.map((c, i) => vertical
  ? `<rect x="${(30 / colors.length) * i}" width="${30 / colors.length + 0.1}" height="20" fill="${c}"/>`
  : `<rect y="${(20 / colors.length) * i}" width="30" height="${20 / colors.length + 0.1}" fill="${c}"/>`).join('');

export const FLAGS = {
  miami: flag(`${stripes(['#B22234', '#fff', '#B22234', '#fff', '#B22234', '#fff', '#B22234'])}<rect width="13" height="11" fill="#3C3B6E"/>${[2.5, 6.5, 10.5].flatMap(x => [2.5, 5.5, 8.5].map(y => `<circle cx="${x}" cy="${y}" r=".9" fill="#fff"/>`)).join('')}`),
  guadeloupe: flag(stripes(['#0055A4', '#fff', '#EF4135'], true)),
  spain: flag(`<rect width="30" height="20" fill="#C60B1E"/><rect y="5" width="30" height="10" fill="#FFC400"/>`),
  egypt: flag(`${stripes(['#CE1126', '#fff', '#000'])}<circle cx="15" cy="10" r="2.2" fill="#C09300"/>`),
  dubai: flag(`${stripes(['#00732F', '#fff', '#000'])}<rect width="8" height="20" fill="#FF0000"/>`),
};
