// Petits outils d'interface : barre du haut, récompenses, confettis, appui long.

import { state } from './store.js';
import { PRAISE } from './data.js';

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export const wait = ms => new Promise(r => setTimeout(r, ms));
export const pick = arr => arr[Math.floor(Math.random() * arr.length)];

export const praise = () => pick(PRAISE).replace('{name}', state.childName || 'ma championne');

export function hud({ back = false, wardrobe = false } = {}) {
  return `<header class="hud">
    ${back ? '<button class="btn-round" data-back aria-label="Retour">🏠</button>' : '<span></span>'}
    <div class="wallet">
      <span class="pill" id="w-stars">⭐ <b>${state.wallet.stars}</b></span>
      <span class="pill" id="w-diamonds">💎 <b>${state.wallet.diamonds}</b></span>
    </div>
    <div class="hud-right">
      ${wardrobe ? '<button class="btn-round" data-wardrobe aria-label="Garde-robe">👗</button>' : ''}
      <button class="lock" data-lock aria-label="Espace parent (appui long)"><svg viewBox="0 0 36 36"><circle class="ring" cx="18" cy="18" r="16"/></svg>🔒</button>
    </div>
  </header>`;
}

export function refreshWallet() {
  const s = $('#w-stars b'), d = $('#w-diamonds b');
  if (s) s.textContent = state.wallet.stars;
  if (d) d.textContent = state.wallet.diamonds;
}

// Fait voler un emoji d'un élément vers un autre.
export async function fly(fromEl, emoji, toSel) {
  const to = $(toSel);
  if (!fromEl || !to) return;
  const a = fromEl.getBoundingClientRect(), b = to.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'flyer';
  el.textContent = emoji;
  el.style.left = `${a.left + a.width / 2}px`;
  el.style.top = `${a.top + a.height / 2}px`;
  document.body.append(el);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  await el.animate(
    [{ transform: 'translate(-50%,-50%) scale(1)' },
     { transform: `translate(calc(-50% + ${dx * 0.4}px), calc(-50% + ${dy * 0.4 - 80}px)) scale(1.6)` },
     { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.6)` }],
    { duration: 800, easing: 'ease-in-out' }).finished;
  el.remove();
  to.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 300 });
}

export function confetti(n = 40) {
  const colors = ['#FF7A6B', '#2EC4B6', '#FFD23F', '#B28DFF', '#5CC971', '#FF6FA8'];
  for (let i = 0; i < n; i++) {
    const c = document.createElement('div');
    c.className = 'confetti';
    c.style.left = `${Math.random() * 100}vw`;
    c.style.background = pick(colors);
    c.style.animationDuration = `${1.6 + Math.random() * 1.4}s`;
    c.style.animationDelay = `${Math.random() * 0.4}s`;
    document.body.append(c);
    setTimeout(() => c.remove(), 3500);
  }
}

// Grande récompense au centre de l'écran ; se ferme au toucher ou après `ms`.
export function celebrate(content, ms = 3500) {
  return new Promise(resolve => {
    const o = document.createElement('div');
    o.className = 'celebrate';
    o.innerHTML = `<div class="big-reward">${content}</div>`;
    document.body.append(o);
    const close = () => { o.remove(); resolve(); };
    o.addEventListener('click', close, { once: true });
    setTimeout(() => o.isConnected && close(), ms);
  });
}

// Appui long (pour le cadenas parent) : l'anneau se remplit pendant `ms`.
export function longPress(el, ms, fn) {
  let t;
  const start = e => { e.preventDefault(); el.classList.add('pressing'); el.style.setProperty('--ms', `${ms}ms`); t = setTimeout(() => { stop(); fn(); }, ms); };
  const stop = () => { clearTimeout(t); el.classList.remove('pressing'); };
  el.addEventListener('pointerdown', start);
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => el.addEventListener(ev, stop));
  el.addEventListener('contextmenu', e => e.preventDefault());
}
