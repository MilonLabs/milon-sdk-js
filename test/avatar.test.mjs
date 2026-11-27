import assert from "node:assert/strict";
import test from "node:test";

import { getDIDAvatar, getDIDAvatarSelection } from "../dist/index.js";

test("getDIDAvatar renders a valid custom avatar descriptor", () => {
  const url = "milon:://avatar/v1/dicebear/glyphs/01/76a7ff";
  const options = { url, address: "0x1234" };
  const result = getDIDAvatar(options);

  assert.match(result, /^data:image\/svg\+xml/);
  assert.equal(result, getDIDAvatar(options));
});

test("getDIDAvatar rejects invalid descriptors", () => {
  assert.throws(
    () => getDIDAvatar({
      url: "milon:://avatar/v1/dicebear/glyphs/16/76a7ff",
      address: "0x1234",
    }),
    /Invalid DID avatar configuration/,
  );
});

test("getDIDAvatarSelection matches the default avatar", () => {
  const address = "0x1234";
  const selection = getDIDAvatarSelection(address);
  const url = `milon:://avatar/v1/dicebear/glyphs/${selection.shape}/${selection.color}`;

  assert.equal(getDIDAvatar({ address }), getDIDAvatar({ url, address }));
});

test("getDIDAvatar uses the default glyph collections without a URL", () => {
  const options = { address: "0x1234" };
  const result = getDIDAvatar(options);

  assert.match(result, /^data:image\/svg\+xml/);
  assert.equal(result, getDIDAvatar({ ...options, url: "" }));
  assert.throws(
    () => getDIDAvatar({ ...options, url: "not-a-did-avatar-url" }),
    /Invalid DID avatar configuration/,
  );
});
