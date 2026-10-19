import { readFile, writeFile } from "node:fs/promises";

const sourceUrl = new URL("../page-registry.json", import.meta.url);
const outputUrl = new URL("../assets/js/page-registry-data.js", import.meta.url);
const registry = JSON.parse(await readFile(sourceUrl, "utf8"));
const output = `// Generated from page-registry.json. Run scripts/build-page-registry-data.mjs after editing the registry.\nwindow.PAGE_REGISTRY=${JSON.stringify(registry)};\n`;

await writeFile(outputUrl, output, "utf8");
