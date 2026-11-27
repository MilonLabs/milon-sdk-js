import test from "node:test";
import assert from "node:assert/strict";
import { Bcs, Postcard, isSerializable } from "../dist/index.js";

class BcsPair extends Bcs.BcsSerializable {
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }

  serialize(serializer) {
    serializer.serializeU8(this.left);
    serializer.serializeStr(this.right);
  }

  static deserialize(deserializer) {
    return new BcsPair(
      deserializer.deserializeU8(),
      deserializer.deserializeStr(),
    );
  }
}

class PostcardPair extends Postcard.PostcardSerializable {
  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
  }

  serialize(serializer) {
    serializer.serializeU8(this.left);
    serializer.serializeStr(this.right);
  }

  static deserialize(deserializer) {
    return new PostcardPair(
      deserializer.deserializeU8(),
      deserializer.deserializeStr(),
    );
  }
}

class Person extends Postcard.PostcardSerializable {
  constructor(Name, Age) {
    super();
    this.Name = Name;
    this.Age = Age;
  }

  serialize(serializer) {
    serializer.serializeStr(this.Name);
    serializer.serializeU8(this.Age);
  }

  static deserialize(deserializer) {
    return new Person(
      deserializer.deserializeStr(),
      deserializer.deserializeU8(),
    );
  }
}

test("BCS serializer/deserializer handles public primitive methods", () => {
  const s = new Bcs.Serializer(2);
  s.serializeBool(true);
  s.serializeBool(false);
  s.serializeU8(255);
  s.serializeU16(0x1234);
  s.serializeU32(0x12345678);
  s.serializeU64(0x0102030405060708n);
  s.serializeU128(0x0102030405060708090a0b0c0d0e0f10n);
  s.serializeU256(1n);
  s.serializeU32AsUleb128(300);
  s.serializeStr("hi");
  s.serializeBytes(new Uint8Array([1, 2]));
  s.serializeFixedBytes(new Uint8Array([3, 4]));
  s.serialize(new BcsPair(5, "x"));
  s.serializeVector([new BcsPair(6, "y")]);
  s.serializeOption(new BcsPair(7, "z"));
  s.serializeOption();
  s.serializeOptionStr("ok");
  s.serializeOptionStr();

  const d = new Bcs.Deserializer(s.toUint8Array());
  assert.equal(d.deserializeBool(), true);
  assert.equal(d.deserializeBool(), false);
  assert.equal(d.deserializeU8(), 255);
  assert.equal(d.deserializeU16(), 0x1234);
  assert.equal(d.deserializeU32(), 0x12345678);
  assert.equal(d.deserializeU64(), 0x0102030405060708n);
  assert.equal(d.deserializeU128(), 0x0102030405060708090a0b0c0d0e0f10n);
  assert.equal(d.deserializeU256(), 1n);
  assert.equal(d.deserializeUleb128AsU32(), 300);
  assert.equal(d.deserializeStr(), "hi");
  assert.deepEqual(Array.from(d.deserializeBytes()), [1, 2]);
  assert.deepEqual(Array.from(d.deserializeFixedBytes(2)), [3, 4]);
  assert.deepEqual(d.deserialize(BcsPair), new BcsPair(5, "x"));
  assert.deepEqual(d.deserializeVector(BcsPair), [new BcsPair(6, "y")]);
  assert.deepEqual(d.deserializeOption(BcsPair), new BcsPair(7, "z"));
  assert.equal(d.deserializeOption(BcsPair), undefined);
  assert.equal(d.deserializeOptionStr(), "ok");
  assert.equal(d.deserializeOptionStr(), undefined);
  assert.equal(d.remaining, 0);
  d.assertEnd();
});

test("BCS helpers reject invalid ranges and trailing bytes", () => {
  assert.throws(() => new Bcs.Serializer(0), /greater than 0/);
  assert.throws(
    () => new Bcs.Serializer().serializeBool(1),
    /expected boolean/,
  );
  assert.throws(() => new Bcs.Serializer().serializeU8(256), /u8 out of range/);
  assert.throws(
    () => new Bcs.Serializer().serializeU16(-1),
    /u16 out of range/,
  );
  assert.throws(
    () => new Bcs.Serializer().serializeU32(1.1),
    /u32 out of range/,
  );
  assert.throws(
    () => new Bcs.Serializer().serializeU64(-1n),
    /u64 out of range/,
  );
  assert.throws(
    () => new Bcs.Deserializer(new Uint8Array([2])).deserializeBool(),
    /invalid BCS boolean/,
  );
  assert.throws(
    () => new Bcs.Deserializer(new Uint8Array([1])).deserializeFixedBytes(2),
    /end of buffer/,
  );
  assert.throws(
    () =>
      new Bcs.Deserializer(
        new Uint8Array([0xff, 0xff, 0xff, 0xff, 0x10]),
      ).deserializeUleb128AsU32(),
    /overflow/,
  );
  assert.throws(
    () => Bcs.deserializeBcs(new Uint8Array([1, 2]), BcsPair),
    /end of buffer/,
  );

  const bytes = new BcsPair(1, "").bcsToBytes();
  const withTrailing = new Uint8Array([...bytes, 9]);
  assert.throws(
    () => Bcs.deserializeBcs(withTrailing, BcsPair),
    /trailing bytes/,
  );
  assert.deepEqual(
    Bcs.deserializeBcs(withTrailing, BcsPair, { allowTrailingBytes: true }),
    new BcsPair(1, ""),
  );
  assert.equal(Bcs.validateIntegerRange(1, 0, 2, "n"), undefined);
});

test("Postcard serializer/deserializer handles public primitive methods", () => {
  const s = new Postcard.PostcardSerializer();
  s.serializeBool(true);
  s.serializeBool(false);
  s.serializeU8(255);
  s.serializeU16(300);
  s.serializeU32(300);
  s.serializeU64(300n);
  s.serializeU128(300n);
  s.serializeI8(-2);
  s.serializeI16(-3);
  s.serializeI32(-4);
  s.serializeI64(-5n);
  s.serializeEnumVariant(11);
  s.serializeStr("hi");
  s.serializeBytes(new Uint8Array([1, 2]));
  s.serializeFixedBytes(new Uint8Array([3, 4]));
  s.serialize(new PostcardPair(5, "x"));
  s.serializeSeq([new PostcardPair(6, "y")]);
  s.serializeOption(new PostcardPair(7, "z"));
  s.serializeOption();

  const d = new Postcard.PostcardDeserializer(s.toUint8Array());
  assert.equal(d.deserializeBool(), true);
  assert.equal(d.deserializeBool(), false);
  assert.equal(d.deserializeU8(), 255);
  assert.equal(d.deserializeU16(), 300);
  assert.equal(d.deserializeU32(), 300);
  assert.equal(d.deserializeU64(), 300n);
  assert.equal(d.deserializeU128(), 300n);
  assert.equal(d.deserializeI8(), -2);
  assert.equal(d.deserializeI16(), -3);
  assert.equal(d.deserializeI32(), -4);
  assert.equal(d.deserializeI64(), -5n);
  assert.equal(d.deserializeEnumVariant(), 11);
  assert.equal(d.deserializeStr(), "hi");
  assert.deepEqual(Array.from(d.deserializeBytes()), [1, 2]);
  assert.deepEqual(Array.from(d.deserializeFixedBytes(2)), [3, 4]);
  assert.deepEqual(d.deserialize(PostcardPair), new PostcardPair(5, "x"));
  assert.deepEqual(d.deserializeSeq(PostcardPair), [new PostcardPair(6, "y")]);
  assert.deepEqual(d.deserializeOption(PostcardPair), new PostcardPair(7, "z"));
  assert.equal(d.deserializeOption(PostcardPair), undefined);
  assert.equal(d.remaining, 0);
  d.assertEnd();
});

test("Postcard serializes Person object deterministically", () => {
  const original = new Person("Alice", 30);
  const bytes = Postcard.serializePostcard(original);
  const hex = Buffer.from(bytes).toString("hex");

  assert.equal(hex, "05416c6963651e");
  assert.deepEqual(Postcard.deserializePostcard(bytes, Person), original);
});

test("Postcard helpers reject invalid data and support helper functions", () => {
  assert.deepEqual(
    Postcard.deserializePostcard(
      Postcard.serializePostcard(new PostcardPair(1, "a")),
      PostcardPair,
    ),
    new PostcardPair(1, "a"),
  );
  assert.equal(new PostcardPair(2, "b").postcardToBytes()[0], 2);
  assert.throws(
    () => new Postcard.PostcardSerializer().serializeBool(1),
    /expected boolean/,
  );
  assert.throws(
    () => new Postcard.PostcardSerializer().serializeU8(256),
    /u8 out of range/,
  );
  assert.throws(
    () => new Postcard.PostcardSerializer().serializeI8(128),
    /i8 out of range/,
  );
  assert.throws(
    () =>
      new Postcard.PostcardDeserializer(new Uint8Array([2])).deserializeBool(),
    /invalid postcard boolean/,
  );
  assert.throws(
    () =>
      new Postcard.PostcardDeserializer(
        new Uint8Array([0x80]),
      ).deserializeU32(),
    /end of postcard buffer/,
  );
  assert.throws(
    () =>
      new Postcard.PostcardDeserializer(
        new Uint8Array([1]),
      ).deserializeFixedBytes(2),
    /end of postcard buffer/,
  );
  assert.throws(
    () => Postcard.deserializePostcard(new Uint8Array([1, 0, 9]), PostcardPair),
    /trailing bytes/,
  );
  assert.deepEqual(
    Postcard.deserializePostcard(new Uint8Array([1, 0, 9]), PostcardPair, {
      allowTrailingBytes: true,
    }),
    new PostcardPair(1, ""),
  );
});

test("serde helper detects serializable values", () => {
  assert.equal(isSerializable(new BcsPair(1, "x")), true);
  assert.equal(isSerializable({ serialize: () => undefined }), true);
  assert.equal(isSerializable({}), false);
  assert.equal(isSerializable(null), false);
});
