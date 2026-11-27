const fs = require("node:fs");
const path = require("node:path");

const distDir = path.resolve(__dirname, "..", "dist");

for (const file of listJsFiles(distDir)) {
  const source = fs.readFileSync(file, "utf8");
  const next = source.replace(
    /(["'])(\.\.?\/[^"'?#]+)(["'])/g,
    (_, prefix, specifier, suffix) => (
      /\.(?:[cm]?js|json)$/.test(specifier)
        ? prefix + specifier + suffix
        : prefix + specifier + ".js" + suffix
    ),
  );

  if (next !== source) {
    fs.writeFileSync(file, next);
  }
}

function listJsFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) return listJsFiles(fullPath);
    return fullPath.endsWith(".js") ? [fullPath] : [];
  });
}
