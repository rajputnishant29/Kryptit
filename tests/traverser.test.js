const test = require("node:test");
const assert = require("node:assert");

const {
  FieldCipher
} = require("../dist/crypto/cipher");

const {
  SchemaTraverser
} = require("../dist/core/traverser");

const SECRET =
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

test(
  "nested encryption and decryption works",
  () => {

    const cipher =
      new FieldCipher({
        secretKeyHex: SECRET
      });

    const traverser =
      new SchemaTraverser(cipher);

    const user = {
      name: "Nishant",

      email: "n@test.com",

      profile: {
        phone: "9999999999"
      }
    };

    const encrypted =
      traverser.processObject(
        user,
        ["email", "phone"],
        "ENCRYPT"
      );

    assert.notStrictEqual(
      encrypted.email,
      user.email
    );

    assert.notStrictEqual(
      encrypted.profile.phone,
      user.profile.phone
    );

    const decrypted =
      traverser.processObject(
        encrypted,
        ["email", "phone"],
        "DECRYPT"
      );

    assert.deepStrictEqual(
      decrypted,
      user
    );
});