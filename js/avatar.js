// Avatar SVG en couches : changer une couleur = changer un fill.

import { SHOP } from './data.js';

const INK = '#3D2C4E';
const line = `stroke="${INK}" stroke-width="3" stroke-linejoin="round"`;

function hairBack(style, c) {
  const f = `fill="${c}" ${line}`;
  switch (style) {
    case 'court': return `<rect x="44" y="40" width="112" height="96" rx="46" ${f}/>`;
    case 'long': return `<rect x="40" y="40" width="120" height="150" rx="52" ${f}/>`;
    case 'couettes': return `<circle cx="38" cy="100" r="24" ${f}/><circle cx="162" cy="100" r="24" ${f}/>
      <circle cx="56" cy="92" r="6" fill="#FF6FA8"/><circle cx="144" cy="92" r="6" fill="#FF6FA8"/>`;
    case 'tresses': {
      let s = '';
      for (let y = 112; y <= 200; y += 17) s += `<circle cx="50" cy="${y}" r="12" ${f}/><circle cx="150" cy="${y}" r="12" ${f}/>`;
      return s + `<circle cx="50" cy="214" r="6" fill="#FF6FA8"/><circle cx="150" cy="214" r="6" fill="#FF6FA8"/>`;
    }
    case 'boucles': {
      let s = '';
      for (let a = -30; a <= 210; a += 20) {
        const r = (a * Math.PI) / 180;
        s += `<circle cx="${100 + 56 * Math.cos(r)}" cy="${95 - 56 * Math.sin(r)}" r="18" ${f}/>`;
      }
      // Boucles longues qui tombent sur les épaules.
      for (let y = 128; y <= 184; y += 18) s += `<circle cx="46" cy="${y}" r="16" ${f}/><circle cx="154" cy="${y}" r="16" ${f}/>`;
      return s;
    }
    case 'afro': {
      // Bosses avec contour, puis un disque plein qui cache les contours intérieurs.
      let s = '';
      for (let a = 0; a < 360; a += 24) {
        const r = (a * Math.PI) / 180;
        s += `<circle cx="${100 + 64 * Math.cos(r)}" cy="${88 - 64 * Math.sin(r)}" r="18" ${f}/>`;
      }
      return s + `<circle cx="100" cy="88" r="66" fill="${c}"/>`;
    }
    case 'chignon': return `<circle cx="100" cy="34" r="24" ${f}/>`;
  }
  return '';
}


// Bijoux et costumes portés : a.worn = { emplacement: id }.
const GOLD = '#FFC83D';
const gem = (x, y, r, c) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${INK}" stroke-width="1.5"/>`;

function jewel({ style, color: c }) {
  switch (style) {
    case 'beads': return Array.from({ length: 9 }, (_, i) => { const t = i / 8; return gem(80 + 40 * t, 150 + 48 * t * (1 - t), 4.5, c); }).join('');
    case 'drop': return [49, 151].map(x => `${gem(x, 108, 3, GOLD)}${gem(x, 119, 6, c)}`).join('');
    case 'flower': return [49, 151].map(x => [0, 72, 144, 216, 288].map(a => gem(x + 5 * Math.cos(a * Math.PI / 180), 114 + 5 * Math.sin(a * Math.PI / 180), 4, c)).join('') + gem(x, 114, 3, GOLD)).join('');
    case 'ring': return [54, 146].map(x => `<ellipse cx="${x}" cy="199" rx="10" ry="5" fill="none" stroke="${INK}" stroke-width="8"/><ellipse cx="${x}" cy="199" rx="10" ry="5" fill="none" stroke="${c}" stroke-width="5"/>`).join('');
    case 'shells': return jewel({ style: 'ring', color: '#F2C46D' }) + [54, 146].map(x => gem(x, 205, 5, c)).join('');
    case 'bow': return `<path d="M132 52 L116 42 L116 62 Z M132 52 L148 42 L148 62 Z" fill="${c}" ${line}/>${gem(132, 52, 5, c)}`;
    case 'rose': return `<path d="M124 64 L150 52" stroke="${GOLD}" stroke-width="6" stroke-linecap="round"/>${gem(138, 52, 11, c)}<path d="M133 52 Q138 45 143 52 Q138 58 135 53" fill="none" stroke="#8B1E2B" stroke-width="2"/>`;
    case 'forehead': return `<path d="M56 74 Q100 92 144 74" fill="none" stroke="${GOLD}" stroke-width="3"/><path d="M100 83 L94 92 L100 101 L106 92 Z" fill="${c}" ${line}/>`;
    case 'tiara': return `<path d="M66 54 L76 34 L88 48 L100 24 L112 48 L124 34 L134 54 Q100 44 66 54 Z" fill="${GOLD}" ${line}/>${gem(100, 38, 4, '#FF6FA8')}${gem(78, 45, 3, '#4D8BFF')}${gem(122, 45, 3, '#4D8BFF')}`;
    case 'crown': return `<path d="M68 52 L66 20 L84 36 L100 14 L116 36 L134 20 L132 52 Z" fill="${GOLD}" ${line}/>${gem(100, 40, 5, '#E63946')}${gem(82, 44, 4, '#2EC4B6')}${gem(118, 44, 4, '#2EC4B6')}`;
  }
  return '';
}

// Costume : oreilles/cornes par-dessus les cheveux, et détails du visage.
function costumeTop(style, skin) {
  const f = `fill="${skin}" ${line}`;
  switch (style) {
    case 'alien': return `<ellipse cx="40" cy="70" rx="16" ry="36" transform="rotate(-35 40 70)" ${f}/><ellipse cx="160" cy="70" rx="16" ry="36" transform="rotate(35 160 70)" ${f}/>
      <ellipse cx="42" cy="70" rx="7" ry="24" transform="rotate(-35 42 70)" fill="#FF9EC4"/><ellipse cx="158" cy="70" rx="7" ry="24" transform="rotate(35 158 70)" fill="#FF9EC4"/>`;
    case 'pig': return `<path d="M58 62 L54 36 L78 50 Z M142 62 L146 36 L122 50 Z" ${f}/>`;
    case 'dog': return `<path d="M58 66 L52 20 L84 50 Z M142 66 L148 20 L116 50 Z" fill="#3E6FB0" ${line}/>`;
    case 'monster': return `<path d="M70 52 L76 24 L86 48 Z M130 52 L124 24 L114 48 Z" fill="#E8E0FF" ${line}/>`;
  }
  return '';
}
function costumeFace(style) {
  switch (style) {
    case 'alien': return `<ellipse cx="100" cy="113" rx="9" ry="6" fill="#1E2A5A"/>`;
    case 'pig': return `<ellipse cx="100" cy="115" rx="15" ry="10" fill="#FF8FAB" ${line}/><circle cx="95" cy="115" r="2.5" fill="${INK}"/><circle cx="105" cy="115" r="2.5" fill="${INK}"/>`;
    case 'dog': return `<ellipse cx="100" cy="118" rx="17" ry="11" fill="#CFE3F7"/><ellipse cx="100" cy="111" rx="7" ry="5" fill="#1a1020"/>`;
    case 'monster': return [[70, 80], [130, 78], [62, 104], [138, 102], [100, 66]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="#8E6BD8" opacity=".8"/>`).join('');
  }
  return '';
}

export function avatarSVG(a, { sleepy = false, head = false, className = 'avatar' } = {}) {
  const items = Object.values(a.worn || {}).map(id => SHOP.find(x => x.id === id)).filter(Boolean);
  const costume = items.find(x => x.slot === 'costume');
  a = { ...a, skin: costume?.skin || a.skin };
  const eyes = sleepy
    ? `<path d="M74 102 Q82 108 90 102 M110 102 Q118 108 126 102" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`
    : [82, 118].map(x => `
        <ellipse cx="${x}" cy="100" rx="10" ry="12" fill="#fff" ${line}/>
        <circle cx="${x}" cy="102" r="7" fill="${a.eyeColor}"/>
        <circle cx="${x}" cy="102" r="3.5" fill="#1a1020"/>
        <circle cx="${x + 2.5}" cy="98.5" r="2.2" fill="#fff"/>`).join('');

  return `<svg class="${className}" viewBox="${head ? '10 6 180 180' : '0 0 200 280'}" aria-hidden="true">
    ${hairBack(a.hairStyle, a.hairColor)}
    <rect x="84" y="222" width="13" height="42" rx="6" fill="${a.skin}" ${line}/>
    <rect x="103" y="222" width="13" height="42" rx="6" fill="${a.skin}" ${line}/>
    <ellipse cx="88" cy="267" rx="13" ry="8" fill="${INK}"/>
    <ellipse cx="112" cy="267" rx="13" ry="8" fill="${INK}"/>
    <path d="M74 158 L50 214" stroke="${INK}" stroke-width="17" stroke-linecap="round"/>
    <path d="M126 158 L150 214" stroke="${INK}" stroke-width="17" stroke-linecap="round"/>
    <path d="M74 158 L50 214" stroke="${a.skin}" stroke-width="11" stroke-linecap="round"/>
    <path d="M126 158 L150 214" stroke="${a.skin}" stroke-width="11" stroke-linecap="round"/>
    <rect x="91" y="134" width="18" height="20" fill="${a.skin}" ${line}/>
    <path d="M76 148 Q100 140 124 148 L152 232 Q100 246 48 232 Z" fill="${a.dressColor}" ${line}/>
    <circle cx="76" cy="154" r="12" fill="${a.dressColor}" ${line}/>
    <circle cx="124" cy="154" r="12" fill="${a.dressColor}" ${line}/>
    <path d="M60 222 Q100 234 140 222" fill="none" stroke="#fff" stroke-width="4" stroke-dasharray="2 9" stroke-linecap="round" opacity=".8"/>
    <circle cx="100" cy="95" r="50" fill="${a.skin}" ${line}/>
    <path d="M47 102 C38 20 162 20 153 102 C146 80 128 70 112 74 Q100 64 88 74 C72 70 54 80 47 102 Z" fill="${a.hairColor}" ${line}/>
    ${costume ? costumeTop(costume.style, a.skin) : ''}
    ${eyes}
    ${costume ? costumeFace(costume.style) : ''}
    <circle cx="68" cy="117" r="8" fill="#FF8FA3" opacity=".55"/>
    <circle cx="132" cy="117" r="8" fill="#FF8FA3" opacity=".55"/>
    <path d="M87 120 Q100 132 113 120" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
    ${items.filter(x => x !== costume).map(jewel).join('')}
  </svg>`;
}
