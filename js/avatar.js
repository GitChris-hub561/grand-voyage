// Avatar SVG en couches : changer une couleur = changer un fill.

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
      return s + `<circle cx="46" cy="132" r="16" ${f}/><circle cx="154" cy="132" r="16" ${f}/>`;
    }
    case 'chignon': return `<circle cx="100" cy="34" r="24" ${f}/>`;
  }
  return '';
}

export function avatarSVG(a, { sleepy = false, head = false, className = 'avatar' } = {}) {
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
    ${eyes}
    <circle cx="68" cy="117" r="8" fill="#FF8FA3" opacity=".55"/>
    <circle cx="132" cy="117" r="8" fill="#FF8FA3" opacity=".55"/>
    <path d="M87 120 Q100 132 113 120" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
  </svg>`;
}
