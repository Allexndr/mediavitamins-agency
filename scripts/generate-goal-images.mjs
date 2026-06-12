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
    prompt:
      "minimalist premium wellness still life, citrus and echinacea, soft cream beige background, warm natural light, korean supplement editorial, no text",
  },
  {
    id: "energy",
    prompt:
      "minimalist wellness still life, ginger root and green tea, golden light, cream background, energy vitality aesthetic, editorial photo, no text",
  },
  {
    id: "skin",
    prompt:
      "luxury korean skincare serum bottle, dewy glow, rose petals, cream background, editorial beauty photography, no text",
  },
  {
    id: "hair",
    prompt:
      "silky hair wellness supplements biotin capsules, botanical leaves, cream background, premium editorial, no text",
  },
  {
    id: "gut",
    prompt:
      "probiotic capsules fresh green leaves, digestive wellness, cream background, minimalist editorial, no text",
  },
  {
    id: "kids",
    prompt:
      "children gummy vitamins soft pastel, friendly wellness, cream background, gentle light, no text",
  },
  {
    id: "women",
    prompt:
      "feminine wellness flowers supplements, soft pink cream tones, elegant editorial, no text",
  },
  {
    id: "weight",
    prompt:
      "green tea metabolism wellness, healthy lifestyle, cream background, clean editorial, no text",
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
