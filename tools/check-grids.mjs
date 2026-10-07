// Vérifie que chaque grille du jeu de code a un chemin du départ au trésor et à chaque étoile.
import { CODE_GRIDS } from '../js/data.js';

CODE_GRIDS.forEach((g, i) => {
  const at = ch => g.flatMap((r, y) => [...r].map((c, x) => (c === ch ? [y, x] : null))).filter(Boolean);
  const [s] = at('S'), seen = new Set([`${s}`]), q = [s];
  if (g.some(r => r.length !== g[0].length)) throw new Error(`grille ${i} : lignes de longueurs différentes`);
  while (q.length) {
    const [y, x] = q.shift();
    for (const [dy, dx] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const n = [y + dy, x + dx];
      if (g[n[0]]?.[n[1]] === undefined || g[n[0]][n[1]] === 'X' || seen.has(`${n}`)) continue;
      seen.add(`${n}`);
      q.push(n);
    }
  }
  for (const p of [...at('T'), ...at('*')]) if (!seen.has(`${p}`)) throw new Error(`grille ${i} : case ${p} inaccessible`);
});
console.log(`${CODE_GRIDS.length} grilles OK`);
