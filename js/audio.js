// Voix et effets sonores.
// Ordre pour un son nommé : fichier audio/<id>.mp3, sinon synthèse vocale.
// (Les enregistrements du parent s'ajouteront en tête de cet ordre à l'étape 2.)

const GOOD_VOICE = /natural|neural|google|siri|premium|enhanced|amélie|thomas|mónica|monica|jorge|helena|lucia/i;
export const voices = {};

function pickVoices() {
  const all = speechSynthesis.getVoices();
  for (const lang of ['fr-FR', 'es-ES']) {
    const same = all.filter(v => v.lang.replace('_', '-') === lang);
    const family = all.filter(v => v.lang.startsWith(lang.slice(0, 2)));
    const pool = same.length ? same : family;
    voices[lang] = pool.find(v => GOOD_VOICE.test(v.name)) || pool[0] || null;
  }
}
if ('speechSynthesis' in window) {
  pickVoices();
  speechSynthesis.addEventListener?.('voiceschanged', pickVoices);
}

export function say(text, lang = 'fr-FR') {
  return new Promise(resolve => {
    if (!('speechSynthesis' in window)) return resolve();
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.voice = voices[lang];
    u.rate = 0.9;
    u.pitch = 1.1;
    u.onend = u.onerror = resolve;
    // Certains navigateurs n'envoient jamais « onend » : on n'attend pas plus que nécessaire.
    setTimeout(resolve, 1200 + text.length * 90);
    speechSynthesis.speak(u);
  });
}

let current;
export function play(id, fallbackText, lang) {
  return new Promise(resolve => {
    current?.pause();
    current = new Audio(`audio/${id}.mp3`);
    current.onended = resolve;
    current.onerror = () => say(fallbackText, lang).then(resolve);
    current.play().catch(() => say(fallbackText, lang).then(resolve));
  });
}

// Effets sonores synthétisés : aucun fichier à fournir.
let ctx;
function tone(freq, start, dur, type = 'sine', vol = 0.18) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = type;
  o.frequency.value = freq;
  g.gain.setValueAtTime(vol, ctx.currentTime + start);
  g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);
  o.connect(g).connect(ctx.destination);
  o.start(ctx.currentTime + start);
  o.stop(ctx.currentTime + start + dur);
}

const SFX = {
  pop:     () => tone(660, 0, 0.12, 'triangle'),
  star:    () => { tone(880, 0, 0.15); tone(1320, 0.08, 0.25); },
  diamond: () => [784, 988, 1175, 1568].forEach((f, i) => tone(f, i * 0.09, 0.35, 'triangle')),
  oops:    () => { tone(392, 0, 0.18, 'sine', 0.12); tone(330, 0.12, 0.25, 'sine', 0.12); },
  fanfare: () => [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i * 0.14, 0.4, 'square', 0.08)),
};

export function sfx(name) {
  ctx ??= new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  SFX[name]?.();
}

// À appeler au premier toucher : iOS n'autorise le son qu'après un geste.
export function unlockAudio() {
  sfx('pop');
  say('');
}
