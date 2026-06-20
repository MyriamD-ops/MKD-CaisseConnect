/**
 * generate-preview.js
 * Génère public/flyers-preview.html depuis resources/js/flyers/templates.js
 * Usage : node generate-preview.js
 */

const fs = require('fs');
const path = require('path');

// Données de démo
const ev = {
    nom: 'Marché de Noël',
    date_debut: '2025-12-20',
    date_fin: '2025-12-24',
    lieu: 'Fort-de-France',
    code_public: 'demo',
};

// ── helpers identiques à templates.js ──────────────────────────────────────
const formatDateFR = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('fr-FR', {
        day: 'numeric', month: 'long', year: 'numeric',
    });
};
const dateRange = (ev) => {
    const d1 = formatDateFR(ev.date_debut);
    if (!ev.date_fin || ev.date_debut === ev.date_fin) return d1;
    return `Du ${d1} au ${formatDateFR(ev.date_fin)}`;
};
const qrSrc = (ev) => {
    const code = ev.code_public || ev.code_unique;
    if (!code) return null;
    const url = encodeURIComponent(`https://srv1442975.hstgr.cloud/events/${code}`);
    return `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${url}`;
};

// ── Lecture de templates.js et extraction des fonctions ────────────────────
const tplPath = path.join(__dirname, 'resources/js/flyers/templates.js');
let tplSrc = fs.readFileSync(tplPath, 'utf8');

// Supprimer les imports/exports ES6 pour pouvoir require() le fichier en CJS
tplSrc = tplSrc
    .replace(/^export\s+const\s+TEMPLATES[\s\S]*$/m, '')
    .replace(/^import\s+.*$/gm, '');

// Eval le tout dans une fonction isolée
const fn = new Function(tplSrc + `
return { generatePrestige, generateAlpinia, generateSimple, generateGeo };
`);
const { generatePrestige, generateAlpinia, generateSimple, generateGeo } = fn();

// ── Génération du HTML ──────────────────────────────────────────────────────
const sections = [
    { id: 'prestige', label: '🌿 Prestige', html: generatePrestige(ev) },
    { id: 'alpinia',  label: '🌺 Alpinia',  html: generateAlpinia(ev)  },
    { id: 'simple',   label: '⬜ Simple',   html: generateSimple(ev)   },
    { id: 'geo',      label: '◆ Géo',       html: generateGeo(ev)      },
];

const output = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Prévisualisation Flyers AMI 3D</title>
<style>
  body { margin: 0; background: #2a2a2a; font-family: Arial, sans-serif; }
  .nav { position: sticky; top: 0; z-index: 100; background: #1a1a1a; display: flex; gap: 8px; padding: 12px 20px; }
  .nav a { color: #DC5F00; text-decoration: none; font-weight: 700; padding: 8px 16px; border: 1px solid #DC5F00; border-radius: 8px; font-size: 13px; }
  .nav a:hover { background: #DC5F00; color: white; }
  .section { padding: 40px 20px; border-bottom: 2px solid #444; }
  .section h2 { color: #fff; font-size: 22px; margin: 0 0 20px; letter-spacing: 3px; text-transform: uppercase; }
  .flyer-wrap { transform-origin: top left; display: inline-block; }
  .scale-wrap { overflow: hidden; display: inline-block; }
</style>
</head>
<body>

<div class="nav">
  <span style="color:#aaa;line-height:2;">Flyers AMI 3D ·</span>
  ${sections.map(s => `<a href="#${s.id}">${s.label.split(' ').slice(1).join(' ')}</a>`).join('\n  ')}
</div>

${sections.map(s => `<!-- ─── ${s.label.toUpperCase()} ─── -->
<div class="section" id="${s.id}">
  <h2>${s.label}</h2>
  <div class="scale-wrap" style="width:540px;height:540px;">
    <div class="flyer-wrap" style="transform:scale(0.5);">
      ${s.html}
    </div>
  </div>
</div>`).join('\n\n')}

</body>
</html>`;

const outPath = path.join(__dirname, 'public/flyers-preview.html');
fs.writeFileSync(outPath, output, 'utf8');
console.log('✅ flyers-preview.html généré avec succès !');
