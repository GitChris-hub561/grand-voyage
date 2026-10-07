// Les 5 jeux. Chaque jeu reçoit ctx = { w, stage, award(el), say, play, setPrompt(fn) }
// et se termine (promesse résolue) quand le niveau est fini.
// Si l'enfant quitte l'écran, ctx.say/ctx.play ne se résolvent jamais : le jeu s'arrête tout seul.

import { state, save } from './store.js';
import { LETTER_STEPS, PHONEME, SOUND_WORDS, NUMBER_WORDS, NUMBER_MAX, SPANISH, CODE_GRIDS } from './data.js';
import { sfx } from './audio.js';
import { $, $$, wait, pick, praise } from './ui.js';

const shuffle = a => [...a].sort(() => Math.random() - 0.5);
const ROUNDS = 5;

// Pose une question : affiche des gros boutons, attend la bonne réponse.
// Erreur : le bouton tremble, on réécoute ; à la 2e erreur la bonne réponse brille.
function choose(ctx, items, rightIndex, { onTap } = {}) {
  return new Promise(resolve => {
    ctx.stage.innerHTML = `<div class="choices">${items.map((html, i) => `<button class="choice" data-i="${i}">${html}</button>`).join('')}</div>`;
    let misses = 0;
    $$('.choice', ctx.stage).forEach(b => b.addEventListener('click', async () => {
      const i = +b.dataset.i;
      if (i === rightIndex) {
        $$('.choice', ctx.stage).forEach(x => (x.disabled = true));
        b.classList.add('right');
        ctx.award(b);
        await onTap?.(i);
        await ctx.say(praise());
        return resolve(misses === 0);
      }
      sfx('oops');
      b.animate([{ translate: '0' }, { translate: '-12px' }, { translate: '12px' }, { translate: '0' }], { duration: 300 });
      if (++misses >= 2) $$('.choice', ctx.stage)[rightIndex].classList.add('hint');
      await onTap?.(i);
      await ctx.say('Presque ! Écoute encore.');
      ctx.replay();
    }));
  });
}

/* ---------- Lettres ---------- */

const known = () => LETTER_STEPS.slice(0, state.skills.letters.step).flat();
const sound = (ctx, L) => ctx.play(`phonemes/${PHONEME[L][0]}`, PHONEME[L][1]);

function pickLetter() {
  const { mastery } = state.skills.letters;
  const fresh = LETTER_STEPS[state.skills.letters.step - 1];
  // Les lettres de l'étape en cours et les moins sues reviennent plus souvent.
  const pool = known().flatMap(L => Array((fresh.includes(L) ? 2 : 1) + ((mastery[L] ?? 0) < 0.8 ? 1 : 0)).fill(L));
  return pick(pool);
}

function learn(L, firstTry) {
  const s = state.skills.letters;
  s.mastery[L] = Math.min(1, Math.max(0, (s.mastery[L] ?? 0) + (firstTry ? 0.2 : -0.1)));
  if (s.step < LETTER_STEPS.length && LETTER_STEPS[s.step - 1].every(x => (s.mastery[x] ?? 0) >= 0.8)) s.step++;
  save();
}

// Découverte : chaque nouvelle lettre apparaît, on la touche pour entendre son son.
async function discover(ctx, letters) {
  await ctx.say('Écoute les lettres. Touche-les !');
  for (const L of letters) {
    ctx.stage.innerHTML = `<div class="choices"><button class="choice letter big">${L}</button></div>`;
    const b = $('.choice', ctx.stage);
    ctx.setPrompt(() => sound(ctx, L));
    await sound(ctx, L);
    await new Promise(r => b.addEventListener('click', r, { once: true }));
    sfx('pop');
    await sound(ctx, L);
    await ctx.say('Répète avec moi !');
    await wait(500);
    await sound(ctx, L);
  }
}

export async function letters(ctx) {
  const s = state.skills.letters;
  const fresh = LETTER_STEPS[s.step - 1];
  if (fresh.some(L => s.mastery[L] === undefined)) {
    await discover(ctx, fresh);
    fresh.forEach(L => (s.mastery[L] ??= 0));
    save();
  }
  for (let r = 0; r < ROUNDS; r++) await letterRound(ctx);
}

async function letterRound(ctx) {
  const L = pickLetter();
  const n = Math.min(known().length, state.skills.letters.step === 1 ? 2 : 3);
  const items = shuffle([L, ...shuffle(known().filter(x => x !== L && PHONEME[x][0] !== PHONEME[L][0])).slice(0, n - 1)]);
  const prompt = async () => { await ctx.say('Où est'); await sound(ctx, L); };
  ctx.setPrompt(prompt);
  prompt();
  const firstTry = await choose(ctx, items.map(x => `<span class="letter">${x}</span>`), items.indexOf(L), { onTap: i => sound(ctx, items[i]) });
  learn(L, firstTry);
}

/* ---------- Pré-lecture : quel mot commence par ce son ? ---------- */

export async function sounds(ctx) {
  for (let r = 0; r < ROUNDS; r++) await soundRound(ctx);
}

async function soundRound(ctx) {
  const letters = known().filter(L => SOUND_WORDS[L]);
  const L = pick(letters);
  const others = shuffle(letters.filter(x => PHONEME[x][0] !== PHONEME[L][0])).slice(0, state.skills.letters.step === 1 ? 1 : 2);
  const options = shuffle([L, ...others]).map(x => [x, pick(SOUND_WORDS[x])]);
  const right = options.findIndex(([x]) => x === L);
  const prompt = async () => { await ctx.say('Écoute !'); await sound(ctx, L); await ctx.say('Quelle image commence par ce son ?'); };
  ctx.setPrompt(prompt);
  prompt();
  await choose(ctx, options.map(([, [img]]) => `<span class="pic">${img}</span>`), right, {
    onTap: async i => {
      const word = options[i][1][1];
      await ctx.say(word);
      if (i === right) { await sound(ctx, L); await ctx.say(word); }
    },
  });
}

/* ---------- Chiffres ---------- */

const numMax = () => NUMBER_MAX[Math.min(NUMBER_MAX.length - 1, Math.floor((state.skills.numbers.levels ?? 0) / 2))];
const randN = () => 1 + Math.floor(Math.random() * numMax());

export async function numbers(ctx) {
  const games = shuffle([countRound, findDigit, matchBasket, fillBasket, countRound]);
  for (const g of games) await g(ctx);
  state.skills.numbers.levels = (state.skills.numbers.levels ?? 0) + 1;
  save();
}

// Compte avec moi : on touche chaque objet, la voix compte.
async function countRound(ctx) {
  const n = randN(), obj = pick(ctx.w.objects);
  ctx.stage.innerHTML = `<div class="things">${`<button class="thing">${obj}</button>`.repeat(n)}</div>`;
  const prompt = () => ctx.say('Compte avec moi ! Touche chaque image.');
  ctx.setPrompt(prompt);
  prompt();
  let c = 0;
  await new Promise(done => $$('.thing', ctx.stage).forEach(b => b.addEventListener('click', async () => {
    if (b.classList.contains('counted')) return;
    b.classList.add('counted');
    sfx('pop');
    ctx.say(NUMBER_WORDS[++c]);
    if (c === n) { await wait(700); done(); }
  })));
  ctx.award($('.things', ctx.stage));
  await ctx.say(`Il y en a ${NUMBER_WORDS[n]} !`);
}

// Trouve le chiffre.
async function findDigit(ctx) {
  const n = randN();
  const items = shuffle([n, ...shuffle([...Array(numMax()).keys()].map(i => i + 1).filter(x => x !== n)).slice(0, 2)]);
  const prompt = () => ctx.say(`Où est le ${NUMBER_WORDS[n]} ?`);
  ctx.setPrompt(prompt);
  prompt();
  await choose(ctx, items.map(x => `<span class="letter">${x}</span>`), items.indexOf(n), { onTap: i => ctx.say(NUMBER_WORDS[items[i]]) });
}

// Associe le chiffre au bon panier.
async function matchBasket(ctx) {
  const n = randN(), obj = pick(ctx.w.objects);
  const counts = shuffle([n, ...shuffle([...Array(numMax()).keys()].map(i => i + 1).filter(x => x !== n)).slice(0, 2)]);
  const prompt = () => ctx.say(`Quel panier a ${NUMBER_WORDS[n]} ${n > 1 ? 'images' : 'image'} ? Le chiffre ${NUMBER_WORDS[n]} !`);
  ctx.setPrompt(prompt);
  const show = () => { const d = document.createElement('div'); d.className = 'digit-card'; d.textContent = n; ctx.stage.prepend(d); };
  prompt();
  const p = choose(ctx, counts.map(c => `<span class="basket">${obj.repeat(c)}</span>`), counts.indexOf(n), { onTap: i => ctx.say(NUMBER_WORDS[counts[i]]) });
  show();
  await p;
}

// Remplis le panier : mets N objets dedans.
async function fillBasket(ctx) {
  const n = randN(), obj = pick(ctx.w.objects);
  ctx.stage.innerHTML = `<div class="things">${`<button class="thing">${obj}</button>`.repeat(Math.min(10, n + 2))}</div><div class="basket big" id="basket">🧺 <b></b></div>`;
  const prompt = () => ctx.say(`Mets ${NUMBER_WORDS[n]} dans le panier !`);
  ctx.setPrompt(prompt);
  prompt();
  let c = 0;
  await new Promise(done => $$('.thing', ctx.stage).forEach(b => b.addEventListener('click', async () => {
    if (c >= n || b.classList.contains('gone')) return;
    b.classList.add('gone');
    sfx('pop');
    $('#basket b').textContent += obj;
    ctx.say(NUMBER_WORDS[++c]);
    if (c === n) { await wait(700); done(); }
  })));
  ctx.award($('#basket'));
  await ctx.say(`${NUMBER_WORDS[n]} dans le panier !`);
}

/* ---------- Espagnol ---------- */

export async function spanish(ctx) {
  const s = state.skills.spanish;
  const pack = SPANISH[(s.pack ?? 0) % SPANISH.length];
  const es = word => ctx.say(word, 'es-ES');

  // Découverte : toucher chaque carte pour entendre le mot.
  await ctx.say('On apprend l\'espagnol ! Touche chaque image.');
  ctx.stage.innerHTML = `<div class="choices">${pack.words.map(([img], i) => `<button class="choice" data-i="${i}"><span class="pic">${img}</span></button>`).join('')}</div>`;
  ctx.setPrompt(() => ctx.say('Touche chaque image.'));
  const heard = new Set();
  await new Promise(done => $$('.choice', ctx.stage).forEach(b => b.addEventListener('click', async () => {
    const [, word, fr] = pack.words[+b.dataset.i];
    sfx('pop');
    b.classList.add('right');
    heard.add(b.dataset.i);
    await ctx.say(`${fr}, en espagnol on dit :`);
    await es(word);
    if (heard.size === pack.words.length) done();
  })));

  // Jeu : Simón dice pour les verbes, sinon « trouve l'image ».
  for (const [img, word, fr] of shuffle(pack.words)) {
    if (pack.verbs) {
      ctx.stage.innerHTML = `<div class="choices"><div class="choice"><span class="pic">${img}</span></div><button class="btn-ok" data-did>✔</button></div>`;
      const prompt = async () => { await ctx.say('Simón dice :', 'es-ES'); await es(word); await ctx.say(`Fais-le avec papa ou maman : ${fr} !`); };
      ctx.setPrompt(prompt);
      prompt();
      const ok = $('[data-did]', ctx.stage);
      await new Promise(r => ok.addEventListener('click', r, { once: true }));
      ctx.award(ok);
      await ctx.say(praise());
    } else {
      const items = shuffle(pack.words.filter(x => x[1] !== word)).slice(0, 2).concat([[img, word]]);
      const opts = shuffle(items);
      const prompt = () => es(word);
      ctx.setPrompt(prompt);
      prompt();
      await choose(ctx, opts.map(([im]) => `<span class="pic">${im}</span>`), opts.findIndex(x => x[1] === word), { onTap: i => es(opts[i][1]) });
    }
  }
  s.pack = (s.pack ?? 0) + 1;
  save();
}

/* ---------- Code : guider le personnage avec les flèches ---------- */

const DIRS = { up: [-1, 0, '⬆️', 'en haut'], down: [1, 0, '⬇️', 'en bas'], left: [0, -1, '⬅️', 'à gauche'], right: [0, 1, '➡️', 'à droite'] };

export async function code(ctx) {
  const s = state.skills.code;
  const i = Math.min(s.level - 1, CODE_GRIDS.length - 2);
  await codeGrid(ctx, CODE_GRIDS[i]);
  await codeGrid(ctx, CODE_GRIDS[i + 1]);
  s.level = Math.min(s.level + 1, CODE_GRIDS.length - 1);
  save();
}

async function codeGrid(ctx, grid) {
  const { w } = ctx;
  const cells = grid.map(r => [...r]);
  let pos = cells.flatMap((r, y) => r.map((c, x) => (c === 'S' ? [y, x] : null))).find(Boolean);
  const cols = cells[0].length;
  const { avatar } = ctx;
  const draw = () => {
    ctx.stage.innerHTML = `
      <div class="grid" style="--cols:${cols};--rows:${cells.length}">
        ${cells.map((r, y) => r.map((c, x) => `<div class="cell">${
          y === pos[0] && x === pos[1] ? `<span class="hero">${avatar}</span>` :
          c === 'T' ? w.treasure : c === 'X' ? w.trap : c === '*' ? '⭐' : ''}</div>`).join('')).join('')}
      </div>
      <div class="arrows">${Object.entries(DIRS).map(([k, d]) => `<button class="arrow" data-dir="${k}">${d[2]}</button>`).join('')}</div>`;
  };
  ctx.setPrompt(() => ctx.say(`Aide-moi à aller jusqu'au trésor ! Attention aux pièges !`));
  draw();
  ctx.replay();
  await new Promise(done => {
    let busy = false;
    const move = async k => {
      if (busy) return;
      busy = true;
      const [dy, dx, , word] = DIRS[k];
      const n = [pos[0] + dy, pos[1] + dx];
      const c = cells[n[0]]?.[n[1]];
      if (c === undefined) { sfx('oops'); await ctx.say('Oh, c\'est le bord !'); busy = false; return; }
      ctx.say(word);
      if (c === 'X') {
        sfx('oops');
        $$('.cell', ctx.stage)[n[0] * cols + n[1]].animate([{ scale: 1 }, { scale: 1.3 }, { scale: 1 }], { duration: 400 });
        await ctx.say('Oups ! Il fait la sieste, passe à côté !');
        busy = false;
        return;
      }
      pos = n;
      sfx('pop');
      draw();
      bind();
      if (c === '*') { cells[n[0]][n[1]] = '.'; ctx.award($('.hero', ctx.stage)); }
      if (c === 'T') { ctx.award($('.hero', ctx.stage)); await ctx.say(`${praise()} Tu as trouvé le trésor !`); document.removeEventListener('keydown', key); return done(); }
      busy = false;
    };
    const bind = () => $$('.arrow', ctx.stage).forEach(b => b.addEventListener('click', () => move(b.dataset.dir)));
    const key = e => { const k = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }[e.key]; if (k && ctx.stage.isConnected) move(k); };
    document.addEventListener('keydown', key);
    bind();
  });
}

/* ---------- Boss : une épreuve tirée au hasard ---------- */

export const bossRounds = [letterRound, soundRound, findDigit, countRound, matchBasket];
