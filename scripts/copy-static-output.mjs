// Copies the prerendered site into dist/client, which is where static hosts
// (Spacefast) expect to find it. Safe to run repeatedly.
import { cp, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, ".output", "public");
const target = path.join(root, "dist", "client");

async function isDirectory(dir) {
  try {
    return (await stat(dir)).isDirectory();
  } catch {
    return false;
  }
}

async function main() {
  if (!(await isDirectory(source))) {
    if (await isDirectory(target)) {
      console.log("[copy-static-output] dist/client already holds the build; nothing to copy.");
      return;
    }
    throw new Error("[copy-static-output] No build output at .output/public. Run the build first.");
  }

  await rm(target, { recursive: true, force: true });
  await mkdir(path.dirname(target), { recursive: true });
  await cp(source, target, { recursive: true });
  console.log("[copy-static-output] Copied .output/public -> dist/client");
}

await main();
