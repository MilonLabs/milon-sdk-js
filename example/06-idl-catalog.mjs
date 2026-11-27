import { DEFAULT_IDLS, IdlName, IdlProvider } from "../dist/index.js";

// DEFAULT_IDLS is the authoritative list of capabilities built into the SDK; this example reflects new methods after an SDK upgrade.
for (const idl of DEFAULT_IDLS) {
  const entries = idl.instructions.filter(({ kind }) => kind !== "view");
  const views = idl.instructions.filter(({ kind }) => kind === "view");
  console.log(`\n${idl.metadata.name} (app_id=${idl.metadata.app_id})`);
  console.log("  entries:", entries.map(({ name }) => name).join(", ") || "-");
  console.log("  views:  ", views.map(({ name }) => name).join(", ") || "-");
}

// Only instantiate providers that exist in DEFAULT_IDLS to keep the documentation aligned with the installed version.
// provider.method(name) supports selecting a method dynamically at runtime.
const enumValues = new Set(Object.values(IdlName));
for (const idl of DEFAULT_IDLS) {
  const name = `${idl.metadata.name}-${idl.metadata.app_id}`;
  if (!enumValues.has(name)) continue;
  new IdlProvider(name);
  console.log("provider ready:", name);
}
