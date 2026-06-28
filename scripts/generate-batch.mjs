/**
 * Batch-Generator: mehrere Artikel auf einmal
 * Aufruf: node scripts/generate-batch.mjs 10
 */

import { execSync } from 'child_process';

const count = parseInt(process.argv[2] ?? '5', 10);

console.log(`\n🚀 Generiere ${count} Artikel...\n`);

for (let i = 0; i < count; i++) {
  console.log(`\n--- Artikel ${i + 1}/${count} ---`);
  try {
    execSync('node scripts/generate-article.mjs', { stdio: 'inherit' });
    // Kurze Pause zwischen Requests
    await new Promise((r) => setTimeout(r, 2000));
  } catch (e) {
    console.error(`Fehler bei Artikel ${i + 1}:`, e.message);
  }
}

console.log(`\n✅ Fertig! ${count} Artikel generiert.`);
console.log('👉 Starte "npm run dev" um sie zu sehen.');
