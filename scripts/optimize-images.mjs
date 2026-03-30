import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const args = process.argv.slice(2);
const hasFlag = (flag) => args.includes(flag);
const getArgValue = (name, fallback) => {
  const prefix = `${name}=`;
  const found = args.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length) : fallback;
};

const dryRun = hasFlag("--dry-run");
const updateContent = hasFlag("--update-content");
const deleteOriginal = hasFlag("--delete-original");
const quality = Number(getArgValue("--quality", "72"));
const maxWidth = Number(getArgValue("--max-width", "1800"));
const imageDir = getArgValue("--dir", "public/images");

const supportedInput = new Set([".png", ".jpg", ".jpeg"]);

const asPosix = (value) => value.replaceAll("\\", "/");
const bytesToMb = (value) => `${(value / (1024 * 1024)).toFixed(2)} MB`;

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const collectFiles = async (dir) => {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
      continue;
    }
    files.push(fullPath);
  }

  return files;
};

const getReferencePath = (absolutePath) => {
  const publicDir = path.join(process.cwd(), "public");
  const relative = path.relative(publicDir, absolutePath);
  return `/${asPosix(relative)}`;
};

const main = async () => {
  let sharp;
  try {
    ({ default: sharp } = await import("sharp"));
  } catch {
    throw new Error(
      "Missing dependency 'sharp'. Run 'npm install' first so image optimization can run."
    );
  }

  const sourceRoot = path.join(process.cwd(), imageDir);
  const allFiles = await collectFiles(sourceRoot);
  const targetFiles = allFiles.filter((file) => supportedInput.has(path.extname(file).toLowerCase()));

  if (targetFiles.length === 0) {
    process.stdout.write(`No image files found in ${imageDir} for extensions: ${Array.from(supportedInput).join(", ")}\n`);
    return;
  }

  const mapping = new Map();
  let totalBefore = 0;
  let totalAfter = 0;
  let optimizedCount = 0;

  for (const inputPath of targetFiles) {
    const stats = await fs.stat(inputPath);
    const beforeBytes = stats.size;
    const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, ".webp");

    const metadata = await sharp(inputPath).metadata();
    const transformer = sharp(inputPath).rotate();
    if (metadata.width && metadata.width > maxWidth) {
      transformer.resize({ width: maxWidth, withoutEnlargement: true });
    }

    const outputBuffer = await transformer.webp({ quality }).toBuffer();
    const afterBytes = outputBuffer.length;

    totalBefore += beforeBytes;
    totalAfter += afterBytes;

    const inputRef = getReferencePath(inputPath);
    const outputRef = getReferencePath(outputPath);
    mapping.set(inputRef, outputRef);

    if (!dryRun) {
      await fs.writeFile(outputPath, outputBuffer);
      if (deleteOriginal) {
        await fs.unlink(inputPath);
      }
    }

    optimizedCount += 1;
    const ratio = beforeBytes > 0 ? ((1 - afterBytes / beforeBytes) * 100).toFixed(1) : "0.0";
    process.stdout.write(
      `${dryRun ? "[dry-run] " : ""}${asPosix(path.relative(process.cwd(), inputPath))} -> ${asPosix(path.relative(process.cwd(), outputPath))} (${bytesToMb(beforeBytes)} -> ${bytesToMb(afterBytes)}, ${ratio}% smaller)\n`
    );
  }

  if (updateContent && !dryRun) {
    const contentFiles = [
      ...(await collectFiles(path.join(process.cwd(), "content"))).filter((file) => file.endsWith(".mdx")),
      path.join(process.cwd(), "app", "[locale]", "page.tsx")
    ];

    for (const filePath of contentFiles) {
      let text;
      try {
        text = await fs.readFile(filePath, "utf8");
      } catch {
        continue;
      }

      let updated = text;
      for (const [from, to] of mapping.entries()) {
        updated = updated.replace(new RegExp(escapeRegExp(from), "g"), to);
      }

      if (updated !== text) {
        await fs.writeFile(filePath, updated);
        process.stdout.write(`Updated references: ${asPosix(path.relative(process.cwd(), filePath))}\n`);
      }
    }
  }

  const totalRatio = totalBefore > 0 ? ((1 - totalAfter / totalBefore) * 100).toFixed(1) : "0.0";
  process.stdout.write(
    `\nOptimized ${optimizedCount} images (${bytesToMb(totalBefore)} -> ${bytesToMb(totalAfter)}, ${totalRatio}% smaller).\n`
  );
  if (dryRun) {
    process.stdout.write("Dry run only; no files were written.\n");
  } else {
    process.stdout.write("WebP files written.\n");
  }
};

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});
