const test = require("node:test");
const assert = require("node:assert");

const {
  FieldGuard,
  generateKey
} = require("../dist/index");

test("FieldGuard public API works", () => {

  const guard =
    new FieldGuard({
      secretKeyHex:
        generateKey()
    });

  const user = {
    email: "n@test.com"
  };

  const encrypted =
    guard.encrypt(
      user,
      ["email"]
    );

  assert.notStrictEqual(
    encrypted.email,
    user.email
  );

  const decrypted =
    guard.decrypt(
      encrypted,
      ["email"]
    );

  assert.deepStrictEqual(
    decrypted,
    user
  );
});