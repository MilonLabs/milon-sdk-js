import {
  Bcs,
  Postcard,
  ResourceId,
  bytesToHex,
  resourcePathKey,
} from "../dist/index.js";

class Person extends Postcard.PostcardSerializable {
  constructor(name, age, tags) {
    super();
    this.name = name;
    this.age = age;
    this.tags = tags;
  }

  serialize(serializer) {
    serializer.serializeStr(this.name);
    serializer.serializeU8(this.age);
    serializer.serializeU32(this.tags.length);
    for (const tag of this.tags) serializer.serializeStr(tag);
  }

  static deserialize(deserializer) {
    const name = deserializer.deserializeStr();
    const age = deserializer.deserializeU8();
    const count = deserializer.deserializeU32();
    const tags = Array.from({ length: count }, () => deserializer.deserializeStr());
    return new Person(name, age, tags);
  }
}

const source = new Person("Alice", 30, ["sdk", "postcard"]);
const postcard = Postcard.serializePostcard(source);
const restored = Postcard.deserializePostcard(postcard, Person);

// The BCS helper works with SDK or custom types that implement serialize/deserialize.
const bcs = Bcs.serializeBcs(source);
const restoredFromBcs = Bcs.deserializeBcs(bcs, Person);

const resourceId = new ResourceId({
  app: "token",
  name: "Balance",
  path: ["account", 7n],
});

console.log({
  postcard: bytesToHex(postcard),
  postcardValue: restored,
  bcsValue: restoredFromBcs,
  resourceId: resourceId.toJSON(),
  resourcePathKey: bytesToHex(resourcePathKey("account", 7n)),
});
