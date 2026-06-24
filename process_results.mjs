import sharp from 'sharp';
import { readdirSync, mkdirSync } from 'fs';
import { join, extname } from 'path';

const args = process.argv.slice(2);
const input = args[args.indexOf('--input') + 1];
const output = args[args.indexOf('--output') + 1];
const condition = args[args.indexOf('--condition') + 1];

if (!input || !output || !condition) {
  console.log('Usage: node process_results.mjs --input ./raw-photos/acne --output ./public/images/results/acne --condition acne');
  process.exit(1);
}

const EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tiff'];
const TARGET_WIDTH = 1000;

mkdirSync(output, { recursive: true });

const files = readdirSync(input)
  .filter(f => EXTENSIONS.includes(extname(f).toLowerCase()))
  .sort();

console.log(`Found ${files.length} images in ${input}`);
console.log(`Processing to ${output}...`);
console.log('-'.repeat(50));

for (let i = 0; i < files.length; i++) {
  const src = join(input, files[i]);
  const num = String(i + 1).padStart(2, '0');
  const dest = join(output, `${condition}-result-${num}.jpg`);

  try {
    const img = sharp(src);
    const meta = await img.metadata();

    let pipeline = img;
    if (meta.width > TARGET_WIDTH) {
      pipeline = pipeline.resize(TARGET_WIDTH);
    }

    await pipeline.jpeg({ quality: 87 }).toFile(dest);
    const outMeta = await sharp(dest).metadata();
    console.log(`  ${files[i].padEnd(40)} → ${condition}-result-${num}.jpg (${outMeta.width}×${outMeta.height})`);
  } catch (e) {
    console.log(`  ERROR: ${files[i]} — ${e.message}`);
  }
}

console.log('-'.repeat(50));
console.log(`Done. ${files.length} images saved to ${output}`);