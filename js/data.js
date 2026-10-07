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

/* ---------- Code : S départ, T trésor, X piège, * étoile bonus ---------- */

export const CODE_GRIDS = [
  ['...', 'S.T', '...'],
  ['S..', '...', '..T'],
  ['..T', '...', 'S..'],
  ['S...', '.X..', '....', '...T'],
  ['....', 'S.X.', '..X.', '...T'],
  ['T...', 'XX..', '....', '..XS'],
  ['S....', '.XX..', '...X.', 'X....', '...XT'],
  ['S.X..', '..X*.', '....X', 'XX...', 'T...X'],
  ['..X.T', '.X...', '...X.', 'X*...', 'S..X.'],
  ['S.X...', '..X.X.', 'X...X.', '..X...', '.*..X.', 'X..X.T'],
  ['T.X..*', '..X.X.', 'X....X', '..XX..', '.X....', '...X.S'],
];
