const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const sourceDir = path.resolve(process.argv[2] || path.join(root, "..", "milon", "app", "idl"));
const targetDir = path.join(root, "IDL");
const index = JSON.parse(fs.readFileSync(path.join(sourceDir, "index.json"), "utf8"));
const expectedFiles = new Set(index.apps.map((app) => path.basename(app.idl)));

for (const filename of fs.readdirSync(targetDir)) {
  if (
    filename.endsWith(".idl.json")
    && !expectedFiles.has(filename)
  ) {
    fs.unlinkSync(path.join(targetDir, filename));
  }
}

for (const app of index.apps) {
  const filename = path.basename(app.idl);
  const source = path.join(sourceDir, filename);
  // Rust emits u64 type tags as JSON numbers. Preserve them as decimal strings
  // because values above Number.MAX_SAFE_INTEGER are otherwise rounded by
  // JSON.parse before the SDK can turn them into bigint values.
  const sourceText = fs.readFileSync(source, "utf8");
  const normalizedText = sourceText.replace(
    /("typeTag"\s*:\s*)(\d{16,})/g,
    '$1"$2"',
  );
  const idl = JSON.parse(normalizedText);
  if (idl.metadata?.app_id !== app.app_id || idl.metadata?.name !== app.name) {
    throw new Error(`IDL metadata does not match index entry: ${filename}`);
  }
  fs.writeFileSync(path.join(targetDir, filename), normalizedText);
}

fs.copyFileSync(path.join(sourceDir, "index.json"), path.join(targetDir, "index.json"));
require("./generate-default-idls.cjs");
