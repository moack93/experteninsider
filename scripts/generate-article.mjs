/**
 * Xperten Insider - KI-Artikel-Generator
 * Aufruf: node scripts/generate-article.mjs
 * Mit Keyword: node scripts/generate-article.mjs "LinkedIn Akquise B2B"
 */

import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const KATEGORIEN = ['Marketing', 'Business', 'Unternehmertum', 'Strategie', 'Vertrieb'];

const KEYWORD_POOL = [
  'LinkedIn Akquise für Selbstständige',
  'Kundengewinnung ohne Werbebudget',
  'Preiserhöhung kommunizieren',
  'Erstkunden gewinnen als Freelancer',
  'Email Marketing für kleine Unternehmen',
  'Vertriebsgespräch führen',
  'Positionierung als Experte',
  'Umsatz steigern ohne Neukundenakquise',
  'Angebotsschreiben Vorlage',
  'Selbstständig machen 2026',
  'Passives Einkommen Unternehmer',
  'Team aufbauen als Solopreneur',
  'Social Media Marketing kleines Unternehmen',
  'Kunden binden Strategien',
  'Netzwerken als Introvertierter',
  'Produktivität Unternehmer',
  'Buchhaltung Selbstständige einfach',
  'Geschäftsidee validieren',
  'Wachstum skalieren ohne Mitarbeiter',
  'Personal Branding aufbauen',
];

const keyword = process.argv[2] ?? KEYWORD_POOL[Math.floor(Math.random() * KEYWORD_POOL.length)];

console.log(`\n🔍 Keyword: "${keyword}"`);
console.log('📝 Generiere Artikel...\n');

const client = new Anthropic();

const prompt = `Du bist ein erfahrener deutschsprachiger Content-Autor für den Blog "Xperten Insider" (experteninsider.de).
Thema: Business, Marketing, Unternehmertum für deutschsprachige Selbstständige und Unternehmer.

Erstelle einen SEO-optimierten Blogartikel zum Keyword: "${keyword}"

ANFORDERUNGEN:
- Sprache: Deutsch, Du-Anrede, direkt, faktisch, keine Floskeln
- Länge: 1.500-2.000 Wörter (Hauptinhalt)
- Struktur: 1x H1 (im Frontmatter als title), mehrere H2/H3 im Artikel
- Ton: Insider-Wissen, praxisnah, ehrlich - kein Bullshit
- Keyword natürlich im Text verwenden (ca. 3-5x)

AUSGABE NUR ALS YAML FRONTMATTER + MARKDOWN, kein anderer Text:

---
title: "[SEO-optimierter Titel mit Keyword, max 60 Zeichen]"
description: "[140-155 Zeichen, Keyword drin, Mehrwert klar]"
datum: ${new Date().toISOString().slice(0, 10)}
kategorie: [Marketing|Business|Unternehmertum|Strategie|Vertrieb]
autor: Xperten Insider Redaktion
freigabe: true
featured: false
---

## [Erster H2]

[Inhalt...]

## [Zweiter H2]

[Inhalt...]

Schreibe jetzt den vollständigen Artikel. Nur Frontmatter + Markdown, nichts sonst.`;

const message = await client.messages.create({
  model: 'claude-opus-4-8',
  max_tokens: 4000,
  messages: [{ role: 'user', content: prompt }],
});

const content = message.content[0].text;

// Titel aus Frontmatter extrahieren für Dateinamen
const titleMatch = content.match(/title:\s*"([^"]+)"/);
const title = titleMatch ? titleMatch[1] : keyword;

const slug = title
  .toLowerCase()
  .replace(/[äöüß]/g, (c) => ({ ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss' }[c]))
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '')
  .slice(0, 60);

const filename = `${slug}.md`;
const filepath = path.join(__dirname, '..', 'src', 'content', 'blog', filename);

// Nicht überschreiben falls bereits vorhanden
if (fs.existsSync(filepath)) {
  const timestamp = Date.now();
  const altFilepath = path.join(__dirname, '..', 'src', 'content', 'blog', `${slug}-${timestamp}.md`);
  fs.writeFileSync(altFilepath, content, 'utf-8');
  console.log(`✅ Artikel gespeichert: src/content/blog/${slug}-${timestamp}.md`);
} else {
  fs.writeFileSync(filepath, content, 'utf-8');
  console.log(`✅ Artikel gespeichert: src/content/blog/${filename}`);
}

console.log(`📊 Tokens: ${message.usage.input_tokens} input / ${message.usage.output_tokens} output`);
console.log(`💰 Kosten ca.: $${((message.usage.input_tokens * 0.000015) + (message.usage.output_tokens * 0.000075)).toFixed(4)}`);
