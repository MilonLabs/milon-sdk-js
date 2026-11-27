const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const idlDir = path.join(root, "IDL");
const index = JSON.parse(fs.readFileSync(path.join(idlDir, "index.json"), "utf8"));

// JSON numbers cannot represent every u64 exactly. Convert typeTag literals to
// decimal strings before JSON.parse so generated SDK IDLs retain the exact
// on-chain AnySerialize discriminator.
function parseIdl(filename) {
  const source = fs.readFileSync(filename, "utf8");
  const losslessTypeTags = source.replace(
    /(\"typeTag\"\s*:\s*)(\d+)/g,
    '$1"$2"',
  );
  return JSON.parse(losslessTypeTags);
}

const idls = index.apps.map((app) =>
  parseIdl(path.resolve(idlDir, app.idl)),
);
const output = [
  `export const DEFAULT_IDLS = ${JSON.stringify(idls, null, 2)} as const;`,
  "",
].join("\n");

fs.writeFileSync(path.join(root, "src", "idl", "default-idls.ts"), output);
