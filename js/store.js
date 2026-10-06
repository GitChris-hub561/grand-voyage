// Sauvegarde locale (localStorage) + export/import d'un fichier .json.

const KEY = 'grand-voyage-save';

const fresh = () => ({
  version: 1,
  childName: '',
  avatar: null,
  wallet: { stars: 0, diamonds: 0 },
  owned: [],
  bossJewels: [],
  worlds: {},                    // { miami: { levelsDone: 3, bossDone: false } }
  skills: {
    letters: { step: 1, mastery: {} },
    numbers: { step: 1 },
    spanish: { seen: [] },
    sounds: { step: 1 },
    code: { level: 1 },
  },
  settings: { sessionMinutes: 20 },
});

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && saved.version === 1) return { ...fresh(), ...saved };
  } catch {}
  return fresh();
}

export const state = load();

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch {}
}

export function world(id) {
  return (state.worlds[id] ??= { levelsDone: 0, bossDone: false });
}

export function exportSave() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `grand-voyage-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function importSave(file) {
  const data = JSON.parse(await file.text());
  if (data.version !== 1) throw new Error('Fichier non reconnu');
  Object.assign(state, fresh(), data);
  save();
}

export function resetSave() {
  Object.assign(state, fresh());
  save();
}
