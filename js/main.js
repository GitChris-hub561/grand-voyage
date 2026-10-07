// Routeur d'écrans : accueil, avatar, carte, monde, niveau, boss, rituel, parent.

import { state, save, world, exportSave, importSave, resetSave, childName as name } from './store.js';
import { WORLDS, SUBJECTS, LEVEL_PLAN, AVATAR_OPTIONS, DEFAULT_AVATAR } from './data.js';
import { say, play, sfx, unlockAudio, voices } from './audio.js';
import { avatarSVG } from './avatar.js';
import { $, $$, wait, pick, hud, refreshWallet, fly, confetti, celebrate, longPress, praise } from './ui.js';
import * as games from './games.js';

const app = $('#app');
const session = { endsAt: 0, over: false, starsToday: 0 };
let screen = '';

function show(id, html, back = map) {
  screen = id;
  speechSynthesis?.cancel();
  app.innerHTML = html;
  app.className = `screen-${id}`;
  $('[data-back]')?.addEventListener('click', () => { sfx('pop'); back(); });
  $('[data-wardrobe]')?.addEventListener('click', () => { sfx('pop'); createAvatar(); });
  const lock = $('[data-lock]');
  if (lock) longPress(lock, 3000, parent);
}

// La séance est finie : on termine le niveau en cours, puis rituel de fin.
setInterval(() => {
  if (!session.endsAt || session.over || Date.now() < session.endsAt) return;
  session.over = true;
  if (screen === 'map' || screen === 'world') ritual();
}, 3000);

const afterLevel = w => (session.over ? ritual() : worldScreen(w));

/* ---------- Accueil ---------- */

function start() {
  const m = state.settings.sessionMinutes;
  show('start', `
    <button class="lock start-lock" data-lock aria-label="Espace parent (appui long)"><svg viewBox="0 0 36 36"><circle class="ring" cx="18" cy="18" r="16"/></svg>🔒</button>
    <div class="start-sky">
      <div class="plane">✈️</div>
      ${avatarSVG(state.avatar || DEFAULT_AVATAR, { className: 'avatar start-avatar' })}
      <button class="btn-giant" data-play aria-label="Jouer">▶</button>
      <label class="parent-timer">⏱ Durée de la séance
        <input type="range" min="15" max="30" step="5" value="${m}" data-minutes>
        <output>${m} min</output>
      </label>
      <button class="lock restart" data-restart aria-label="Nouvelle partie (appui long)"><svg viewBox="0 0 36 36"><circle class="ring" cx="18" cy="18" r="16"/></svg>🔄</button>
    </div>`);
  longPress($('[data-restart]'), 3000, () => {
    if (confirm('Nouvelle partie : effacer toute la progression (personnage, étoiles, mondes) ?')) { resetSave(); start(); }
  });
  const range = $('[data-minutes]');
  range.addEventListener('input', () => {
    range.nextElementSibling.textContent = `${range.value} min`;
    state.settings.sessionMinutes = +range.value;
    save();
  });
  $('[data-play]').addEventListener('click', () => {
    unlockAudio();
    session.endsAt = Date.now() + state.settings.sessionMinutes * 60000;
    session.over = false;
    session.starsToday = 0;
    if (!state.avatar) createAvatar();
    else { map(); say(`Bonjour ${name()} ! Où veux-tu aller aujourd'hui ?`); }
  });
}

/* ---------- Création / garde-robe de l'avatar ---------- */

const AVATAR_TABS = [
  { key: 'hairStyle', icon: '💇‍♀️', voice: 'Choisis ta coiffure !' },
  { key: 'hairColor', icon: '🎨', voice: 'Choisis la couleur de tes cheveux !' },
  { key: 'eyeColor', icon: '👀', voice: 'Choisis la couleur de tes yeux !' },
  { key: 'dressColor', icon: '👗', voice: 'Choisis la couleur de ta robe !' },
  { key: 'skin', icon: '✋', voice: 'Choisis ta couleur de peau !' },
];

function createAvatar() {
  const draft = { ...(state.avatar || DEFAULT_AVATAR) };
  let tab = 0;
  show('avatar', `
    <div class="avatar-stage"><div class="preview"></div></div>
    <div class="avatar-panel">
      <nav class="tabs">${AVATAR_TABS.map((t, i) => `<button class="tab" data-tab="${i}">${t.icon}</button>`).join('')}</nav>
      <div class="options"></div>
      <button class="btn-ok" data-ok aria-label="Valider">✔</button>
    </div>`);

  const paint = () => {
    $('.preview').innerHTML = avatarSVG(draft, { className: 'avatar big' });
    const { key } = AVATAR_TABS[tab];
    $$('.tab').forEach((b, i) => b.classList.toggle('on', i === tab));
    $('.options').innerHTML = AVATAR_OPTIONS[key].map(v => {
      const inner = key === 'hairStyle' ? avatarSVG({ ...draft, hairStyle: v }, { head: true, className: 'avatar mini' }) : '';
      const style = key === 'hairStyle' ? '' : `style="background:${v}"`;
      return `<button class="swatch ${draft[key] === v ? 'on' : ''}" data-v="${v}" ${style}>${inner}</button>`;
    }).join('');
    $$('.swatch').forEach(b => b.addEventListener('click', () => {
      sfx('pop');
      draft[key] = b.dataset.v;
      paint();
      $('.preview .avatar').animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06) rotate(-2deg)' }, { transform: 'scale(1)' }], { duration: 300 });
    }));
  };

  $$('.tab').forEach(b => b.addEventListener('click', () => {
    sfx('pop');
    tab = +b.dataset.tab;
    paint();
    say(AVATAR_TABS[tab].voice);
  }));
  $('[data-ok]').addEventListener('click', async () => {
    const first = !state.avatar;
    state.avatar = draft;
    save();
    sfx('fanfare');
    confetti();
    say(first ? `Que tu es belle ! C'est parti pour le grand voyage !` : 'Que tu es belle !');
    await wait(1500);
    map();
  });

  paint();
  say(state.avatar ? 'On change de look ?' : `Bonjour ${name()} ! Comment veux-tu être ? ${AVATAR_TABS[0].voice}`);
}

/* ---------- Carte du monde ---------- */

function map() {
  const route = WORLDS.map(w => `${w.x},${w.y}`).join(' ');
  const here = WORLDS.find(w => w.id === state.lastWorld) || WORLDS[0];
  show('map', `${hud({ wardrobe: true })}
    <div class="sea">
      <svg class="route" viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="${route}"/></svg>
      ${WORLDS.map(w => {
        const p = world(w.id);
        const dots = Array.from({ length: 8 }, (_, i) => `<i class="${i < p.levelsDone ? 'on' : ''}"></i>`).join('');
        return `<button class="island" data-world="${w.id}" style="left:${w.x}%;top:${w.y}%;--ground:${w.ground};--accent:${w.accent}">
          <span class="landmark">${w.landmark}</span>
          <span class="dots">${dots}</span>
          ${p.bossDone ? `<span class="jewel-badge">${w.jewel.emoji}</span>` : ''}
          <span class="label">${w.name}</span>
        </button>`;
      }).join('')}
      <div class="map-avatar" style="left:${here.x}%;top:${here.y}%">${avatarSVG(state.avatar, { className: 'avatar small' })}</div>
    </div>`);

  $$('[data-world]').forEach(b => b.addEventListener('click', async () => {
    const w = WORLDS.find(x => x.id === b.dataset.world);
    sfx('pop');
    const av = $('.map-avatar');
    av.style.transition = 'left 1.2s ease-in-out, top 1.2s ease-in-out';
    av.style.left = `${w.x}%`;
    av.style.top = `${w.y}%`;
    state.lastWorld = w.id;
    save();
    say(`En route pour ${w.name} !`);
    await wait(1400);
    worldScreen(w);
  }));
  if (session.over) ritual();
}

/* ---------- Un monde : chemin de 8 niveaux + boss ---------- */

const PATH = [[8, 78], [20, 58], [32, 78], [44, 58], [56, 78], [68, 58], [80, 78], [90, 54], [80, 26]];

function worldScreen(w) {
  const p = world(w.id);
  const nodes = LEVEL_PLAN.map((s, i) => {
    const st = i < p.levelsDone ? 'done' : i === p.levelsDone ? 'current' : 'locked';
    return `<button class="node ${st}" data-level="${i}" style="left:${PATH[i][0]}%;top:${PATH[i][1]}%;--c:${SUBJECTS[s].color}">
      ${SUBJECTS[s].icon}${st === 'done' ? '<span class="tick">⭐</span>' : ''}</button>`;
  }).join('');
  const bossState = p.bossDone ? 'done' : p.levelsDone >= 8 ? 'current' : 'locked';
  const [bx, by] = PATH[8];
  const at = PATH[Math.min(p.levelsDone, 8)];

  show('world', `${hud({ back: true, wardrobe: true })}
    <div class="world" style="--sky:${w.sky};--ground:${w.ground};--accent:${w.accent}">
      <div class="world-landmark">${w.landmark}</div>
      <svg class="route" viewBox="0 0 100 100" preserveAspectRatio="none"><polyline points="${PATH.map(q => q.join(',')).join(' ')}"/></svg>
      ${nodes}
      <button class="node boss ${bossState}" data-boss style="left:${bx}%;top:${by}%">
        ${p.bossDone ? w.jewel.emoji : w.boss.emoji}</button>
      <div class="world-avatar" style="left:${at[0]}%;top:${at[1]}%">${avatarSVG(state.avatar, { className: 'avatar small' })}</div>
    </div>`, map);

  const locked = () => { sfx('oops'); say('Celui-là est encore fermé. Touche le rond qui brille !'); };
  $$('[data-level]').forEach(b => b.addEventListener('click', () => {
    const i = +b.dataset.level;
    if (i > p.levelsDone) return locked();
    sfx('pop');
    levelScreen(w, i);
  }));
  $('[data-boss]').addEventListener('click', () => {
    if (p.levelsDone < 8) return locked();
    sfx('pop');
    bossScreen(w);
  });
  say(p.levelsDone === 0 ? `Bienvenue à ${w.name} ! Touche le rond qui brille.` : `Te revoilà à ${w.name} !`);
}

/* ---------- Niveau : un vrai jeu de la matière ---------- */

// Prépare l'écran de jeu et le contexte passé aux jeux (voir games.js).
function playScreen(id, w, extra = '') {
  show(id, `${hud({ back: true })}
    <div class="play" style="--sky:${w.sky};--ground:${w.ground}">
      ${extra}
      <button class="btn-round replay" data-replay aria-label="Réécouter">🔊</button>
      <div class="stage"></div>
    </div>`, () => worldScreen(w));
  const stage = $('.stage');
  // Écran quitté : les promesses ne se résolvent plus, le jeu s'arrête.
  const alive = fn => (...a) => (stage.isConnected ? fn(...a) : new Promise(() => {}));
  let prompt = () => {};
  const ctx = {
    w, stage,
    avatar: avatarSVG(state.avatar, { className: 'avatar' }),
    say: alive(say),
    play: alive(play),
    setPrompt: fn => (prompt = fn),
    replay: () => stage.isConnected && prompt(),
    award: el => {
      sfx('star');
      state.wallet.stars++;
      session.starsToday++;
      save();
      fly(el, '⭐', '#w-stars').then(refreshWallet);
    },
  };
  $('[data-replay]').addEventListener('click', () => { sfx('pop'); ctx.replay(); });
  return ctx;
}

async function levelScreen(w, i) {
  const subject = LEVEL_PLAN[i];
  const ctx = playScreen('level', w, `<div class="subject-badge" style="--c:${SUBJECTS[subject].color}">${SUBJECTS[subject].icon}</div>`);
  await games[subject](ctx);
  if (!ctx.stage.isConnected) return;
  const p = world(w.id);
  if (i === p.levelsDone) p.levelsDone++;
  state.wallet.diamonds++;
  save();
  refreshWallet();
  sfx('diamond');
  confetti();
  say(`${praise()} Tu gagnes un diamant !`);
  await celebrate('💎');
  afterLevel(w);
}

/* ---------- Boss gentil : 5 épreuves des matières déjà vues ---------- */

async function bossScreen(w) {
  const ctx = playScreen('boss', w, `<div class="boss-big sleepy">${w.boss.emoji}</div><div class="gauge">${'<i></i>'.repeat(5)}</div>`);
  const boss = $('.boss-big');
  await ctx.say(w.boss.says);
  for (let k = 0; k < 5; k++) {
    await pick(games.bossRounds)(ctx);
    if (!ctx.stage.isConnected) return;
    $$('.gauge i')[k].classList.add('on');
    boss.animate([{ transform: 'scale(1) rotate(0)' }, { transform: 'scale(1.2) rotate(-8deg)' }, { transform: 'scale(1) rotate(0)' }], { duration: 500 });
  }
  ctx.stage.innerHTML = '';
  boss.classList.remove('sleepy');
  const p = world(w.id);
  p.bossDone = true;
  if (!state.bossJewels.includes(w.jewel.id)) state.bossJewels.push(w.jewel.id);
  state.wallet.diamonds += 3;
  save();
  refreshWallet();
  sfx('fanfare');
  confetti(80);
  say(`Merci ${name()} ! Voici ${w.jewel.name} pour toi !`);
  await celebrate(`<span class="jewel-big">${w.jewel.emoji}</span>`, 5000);
  afterLevel(w);
}

/* ---------- Rituel de fin de séance ---------- */

const CHEST = `<svg viewBox="0 0 120 100"><rect x="10" y="40" width="100" height="55" rx="8" fill="#C98A1B" stroke="#3D2C4E" stroke-width="4"/>
  <path d="M10 45 Q10 10 60 10 Q110 10 110 45 Z" fill="#E0A63A" stroke="#3D2C4E" stroke-width="4"/>
  <rect x="50" y="38" width="20" height="24" rx="4" fill="#FFD23F" stroke="#3D2C4E" stroke-width="4"/></svg>`;

function ritual() {
  const n = Math.min(Math.max(session.starsToday, 3), 10);
  show('ritual', `
    <div class="night">
      <div class="moon">🌙</div>
      ${avatarSVG(state.avatar, { sleepy: true, className: 'avatar ritual-avatar' })}
      <div class="chest" id="chest">${CHEST}</div>
      ${Array.from({ length: n }, (_, i) => `<button class="target night-star" style="left:${10 + (i % 5) * 16}%;top:${18 + Math.floor(i / 5) * 22}%">⭐</button>`).join('')}
    </div>`);
  let left = n;
  $$('.night-star').forEach(b => b.addEventListener('click', async () => {
    if (b.disabled) return;
    b.disabled = true;
    b.style.visibility = 'hidden';
    sfx('star');
    fly(b, '⭐', '#chest');
    if (--left) return;
    await wait(900);
    sfx('diamond');
    say(`Bravo ${name()} ! À demain pour la suite du voyage !`);
    await celebrate('😘', 5000);
    session.endsAt = 0;
    start();
  }));
  say(`C'est l'heure de se reposer. On range les trésors dans le coffre !`);
}

/* ---------- Espace parent ---------- */

function parent() {
  const v = l => voices[l] ? `${voices[l].name}` : '⚠️ aucune voix trouvée sur cet appareil';
  const remaining = session.endsAt ? Math.max(0, Math.round((session.endsAt - Date.now()) / 60000)) : null;
  show('parent', `
    <div class="parent">
      <h1>Espace parent</h1>
      <label>Prénom de l'enfant <input data-name value="${state.childName.replace(/"/g, '&quot;')}" maxlength="20"></label>
      <p><button data-hear>🔊 Écouter le prénom</button></p>
      <p class="hint">Si la voix le prononce mal, écrivez-le comme il se prononce (par exemple « Énaïa »).</p>
      <label>Durée de séance par défaut : <output>${state.settings.sessionMinutes} min</output>
        <input type="range" min="15" max="30" step="5" value="${state.settings.sessionMinutes}" data-minutes></label>
      ${remaining !== null ? `<p>Séance en cours : ${session.over ? 'terminée' : `${remaining} min restantes`} <button data-more>+5 min</button></p>` : ''}
      <h2>Voix</h2>
      <p>Français : ${v('fr-FR')}<br>Espagnol : ${v('es-ES')}</p>
      <p class="hint">Si une voix manque, ajoutez-la dans les réglages de l'appareil (Langue / Synthèse vocale).</p>
      <h2>Sauvegarde</h2>
      <p class="row"><button data-export>Exporter</button>
        <label class="btn-like">Importer<input type="file" accept=".json,application/json" data-import hidden></label>
        <button class="danger" data-reset>Tout effacer</button></p>
      <button class="btn-back" data-close>↩ Retour au jeu</button>
    </div>`);

  $('[data-name]').addEventListener('input', e => { state.childName = e.target.value.trim(); save(); });
  $('[data-hear]').addEventListener('click', () => say(`Bravo ${name()} !`));
  const range = $('[data-minutes]');
  range.addEventListener('input', () => {
    state.settings.sessionMinutes = +range.value;
    range.previousElementSibling.textContent = `${range.value} min`;
    save();
  });
  $('[data-more]')?.addEventListener('click', () => {
    session.endsAt = Math.max(session.endsAt, Date.now()) + 5 * 60000;
    session.over = false;
    parent();
  });
  $('[data-export]').addEventListener('click', exportSave);
  $('[data-import]').addEventListener('change', async e => {
    try { await importSave(e.target.files[0]); alert('Sauvegarde importée.'); parent(); }
    catch { alert('Ce fichier n\'est pas une sauvegarde du Grand Voyage.'); }
  });
  $('[data-reset]').addEventListener('click', () => {
    if (confirm('Effacer toute la progression ?') && confirm('Vraiment ? Cette action est définitive.')) { resetSave(); start(); }
  });
  $('[data-close]').addEventListener('click', () => (state.avatar ? map() : start()));
}

/* ---------- Démarrage ---------- */

start();
if ('serviceWorker' in navigator && location.protocol !== 'file:') navigator.serviceWorker.register('sw.js');
