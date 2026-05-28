const test = require("node:test");
const assert = require("node:assert");

const { FieldCipher } = require("../dist/crypto/cipher");

const SECRET =
  "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

test("encrypt and decrypt works", () => {
  const cipher = new FieldCipher({
    secretKeyHex: SECRET,
  });

  const original = "hello world";

  const encrypted =
    cipher.encryptString(original);

  const decrypted =
    cipher.decryptString(encrypted);

  assert.strictEqual(
    decrypted,
    original
  );
});
test("wrong key throws error", () => {
  const cipher1 = new FieldCipher({
    secretKeyHex: SECRET,
  });

  const cipher2 = new FieldCipher({
    secretKeyHex:
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  });

  const encrypted =
    cipher1.encryptString("secret");

  assert.throws(() => {
    cipher2.decryptString(encrypted);
  });
});