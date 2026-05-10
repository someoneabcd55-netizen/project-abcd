#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const ROOT = process.cwd();
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

function loadSimpleEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const raw = fs.readFileSync(filePath, 'utf8');
  const lines = raw.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadSimpleEnvFile(path.join(ROOT, '.env'));
loadSimpleEnvFile(path.join(ROOT, '.env.local'));

const apiKey = (process.env.GEMINI_API_KEY || '').trim();
const model = DEFAULT_MODEL.trim();

if (!apiKey) {
  console.error('Missing GEMINI_API_KEY. Add it to .env or export it in your shell.');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'you> ',
});

async function askGemini(userText) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const body = {
    contents: [{ parts: [{ text: userText }] }],
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errorText}`);
  }

  const data = await res.json();
  const text =
    data?.candidates?.[0]?.content?.parts
      ?.map((p) => (typeof p?.text === 'string' ? p.text : ''))
      .join('')
      .trim() || '';

  if (!text) {
    return '[No text response returned by model]';
  }
  return text;
}

console.log(`Gemini terminal chat ready. Model: ${model}`);
console.log("Type your message. Type 'exit' to quit.");
rl.prompt();

rl.on('line', async (line) => {
  const input = line.trim();
  if (!input) {
    rl.prompt();
    return;
  }
  if (input.toLowerCase() === 'exit') {
    rl.close();
    return;
  }

  try {
    const reply = await askGemini(input);
    process.stdout.write(`bot> ${reply}\n`);
  } catch (err) {
    process.stdout.write(`error> ${err.message}\n`);
  }
  rl.prompt();
});

rl.on('close', () => {
  process.stdout.write('bye\n');
  process.exit(0);
});
