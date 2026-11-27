import { Avatar, Style } from "@dicebear/core";
import glyphsDefinition from "@dicebear/styles/glyphs.json" with { type: "json" };

export const GLYPHS_SHAPE_IDS = [
  "01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11",
  "12", "13", "14", "15", "17", "18", "19", "20", "21", "22", "23",
  "24", "25", "26", "27", "28", "29", "30", "31", "32", "33", "34",
  "35",
] as const;

export const GLYPHS_COLORS = [
  "76a7ff", "525fa3", "8c8c8c", "75c675", "ffaa64", "ff4d6f", "af61f2",
] as const;

export type GlyphsShapeId = (typeof GLYPHS_SHAPE_IDS)[number];
export type GlyphsColor = (typeof GLYPHS_COLORS)[number];
type GlyphsShapeVariant = `variant${GlyphsShapeId}`;
type GlyphsColorValue = `#${GlyphsColor}`;

const shapeIds = new Set<string>(GLYPHS_SHAPE_IDS);
const colors = new Set<string>(GLYPHS_COLORS);
const glyphsStyle = new Style(glyphsDefinition);

export interface DIDAvatarOptions {
  /** Custom avatar URL. Omit or leave empty to use the default glyph collections. */
  url?: string;
  /** Address used as the deterministic DiceBear seed. */
  address: string;
}

export interface DIDAvatarSelection {
  shape: GlyphsShapeId;
  color: GlyphsColor;
}

const invalidAvatar = (): never => {
  throw new Error("Invalid DID avatar configuration.");
};

const parseDIDAvatarUrl = (url: string): {
  shape: GlyphsShapeId;
  color: GlyphsColor;
} => {
  const match = /^milon::\/\/avatar\/v1\/dicebear\/glyphs\/([^/]+)\/([^/]+)$/.exec(url);
  const shape = match?.[1];
  const color = match?.[2];
  if (!shape || !color || !shapeIds.has(shape) || !colors.has(color)) invalidAvatar();

  return { shape: shape as GlyphsShapeId, color: color as GlyphsColor };
};

const createDefaultAvatar = (address: string): Avatar => {
  if (!address) invalidAvatar();

  return new Avatar(glyphsStyle, {
    seed: address,
    shapeVariant: GLYPHS_SHAPE_IDS.map((id) => `variant${id}` as const),
    glyphColor: GLYPHS_COLORS.map((value) => `#${value}` as const),
  });
};

export const getDIDAvatarSelection = (address: string): DIDAvatarSelection => {
  const options = createDefaultAvatar(address).toJSON().options;
  const shape =
    typeof options.shapeVariant === "string"
      ? options.shapeVariant.replace(/^variant/, "")
      : "";
  const color = Array.isArray(options.glyphColor)
    ? options.glyphColor[0]?.replace(/^#/, "") ?? ""
    : "";

  if (!shapeIds.has(shape) || !colors.has(color)) invalidAvatar();

  return {
    shape: shape as GlyphsShapeId,
    color: color as GlyphsColor,
  };
};



/** Render a validated DID avatar URL or the default glyph collections as an SVG data URI. */
export const getDIDAvatar = ({ url, address }: DIDAvatarOptions): string => {
  if (!address) invalidAvatar();

  const avatar = url
    ? (() => {
        const { shape, color } = parseDIDAvatarUrl(url);
        const shapeVariant: GlyphsShapeVariant[] = [`variant${shape}`];
        const glyphColor: GlyphsColorValue[] = [`#${color}`];

        return new Avatar(glyphsStyle, {
          seed: address,
          shapeVariant,
          glyphColor,
        });
      })()
    : createDefaultAvatar(address);

  return avatar.toDataUri();
};
