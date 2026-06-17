#!/usr/bin/env node
/**
 * Генерация картинок категорий через Hugging Face Inference Providers.
 * Требует HF_TOKEN в .env.local и активные кредиты на huggingface.co/settings/billing
 *
 * Использование: node scripts/generate-goal-images.mjs
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "../public/images/goals");

const GOALS = [
  {
    id: "immunity",
    icon: "shield",
    prompt:
      "glass shield symbol, vitamin C lemon zinc tablets, immune protection, cream beige background, editorial wellness, no text",
  },
  {
    id: "energy",
    icon: "bolt",
    prompt:
      "golden lightning bolt light, ginseng B-vitamins matcha, energy vitality, cream background, editorial, no text",
  },
  {
    id: "skin",
    icon: "auto_awesome",
    prompt:
      "collagen serum sparkle stars, dewy radiant glow, rose quartz, cream background, korean skincare, no text",
  },
  {
    id: "hair",
    icon: "spa",
    prompt:
      "spa argan oil silky hair biotin bottle eucalyptus, hair nails strength, cream background, no text",
  },
  {
    id: "gut",
    icon: "eco",
    prompt:
      "green leaves circle probiotic yogurt ginger mint, digestive gut health eco, cream background, no text",
  },
  {
    id: "kids",
    icon: "child_care",
    prompt:
      "kids gummy vitamins pastel growth ruler, children development, cream background, soft light, no text",
  },
  {
    id: "women",
    icon: "favorite",
    prompt:
      "pink heart herbal tea evening primrose peony, women hormonal balance, cream background, no text",
  },
  {
    id: "weight",
    icon: "fitness_center",
    prompt:
      "light dumbbells green tea metabolism capsules apple, weight fitness form, cream background, no text",
  },
];

const token = process.env.HF_TOKEN;
if (!token) {
  console.error("Задайте HF_TOKEN в окружении или .env.local");
  process.exit(1);
}

mkdirSync(OUT_DIR, { recursive: true });

const MODEL = "black-forest-labs/FLUX.1-schnell";
const URL = `https://router.huggingface.co/hf-inference/models/${MODEL}`;

for (const goal of GOALS) {
  const outPath = join(OUT_DIR, `goal-${goal.id}.png`);
  console.log(`Генерация: ${goal.id}...`);

  const res = await fetch(URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: goal.prompt,
      parameters: { width: 512, height: 640 },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error(`Ошибка ${goal.id} (${res.status}):`, err);
    continue;
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(outPath, buffer);
  console.log(`  → ${outPath}`);
  await new Promise((r) => setTimeout(r, 2000));
}

console.log("Готово.");
