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
    id: 'miami', name: 'Miami', landmark: '🌴', x: 17, y: 42,
    sky: '#FFD6E7', ground: '#7FDBDA', accent: '#FF6FA8',
    objects: ['🦩', '🍦', '🐚', '🐬', '🌴'],
    boss: { emoji: '🦩', says: 'Le flamant rose ne sait plus voler. On l\'aide ?' },
    jewel: { id: 'jewel_miami', emoji: '🐚', name: 'le bracelet coquillage' },
  },
  {
    id: 'guadeloupe', name: 'Guadeloupe', landmark: '🏝️', x: 30, y: 72,
    sky: '#C8F3FF', ground: '#5CC971', accent: '#1E9E6A',
    objects: ['🥥', '🐢', '🐠', '🍌', '🌺'],
    boss: { emoji: '🐢', says: 'La tortue dort profondément. On la réveille ?' },
    jewel: { id: 'jewel_guadeloupe', emoji: '🌺', name: 'les boucles d\'oreille fleurs' },
  },
  {
    id: 'spain', name: 'Espagne', landmark: '🏰', x: 50, y: 30,
    sky: '#FFF1B8', ground: '#FFB070', accent: '#E63946',
    objects: ['🍊', '🎸', '💃', '🐂', '☀️'],
    boss: { emoji: '🐂', says: 'Le taureau est trop timide pour danser. On l\'aide ?' },
    jewel: { id: 'jewel_spain', emoji: '🌹', name: 'le peigne à fleur' },
  },
  {
    id: 'egypt', name: 'Égypte', landmark: PYRAMIDS, x: 63, y: 56,
    sky: '#FFE9C2', ground: '#E8B860', accent: '#2856A3',
    objects: ['🐈', '🐊', '🪲', '🐫', '🌙'],
    boss: { emoji: '🦁', says: 'Le sphinx a des devinettes pour toi !' },
    jewel: { id: 'jewel_egypt', emoji: '🪲', name: 'le bijou de tête doré' },
  },
  {
    id: 'dubai', name: 'Dubaï', landmark: '🏙️', x: 81, y: 40,
    sky: '#FFE3A3', ground: '#F2C46D', accent: '#C98A1B',
    objects: ['🐪', '🌴', '🦅', '⭐', '💎'],
    boss: { emoji: '🐪', says: 'Le chameau a perdu sa tour. On la retrouve ?' },
    jewel: { id: 'jewel_dubai', emoji: '📿', name: 'le collier de perles' },
  },
];

export const AVATAR_OPTIONS = {
  hairStyle: ['court', 'long', 'couettes', 'tresses', 'boucles', 'chignon'],
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
