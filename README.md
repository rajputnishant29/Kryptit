# Enkrypt

TypeScript field-level encryption SDK for securely storing backend data using AES-256-GCM.

---

## Features

* AES-256-GCM encryption
* Authenticated decryption
* Nested object encryption
* Array traversal support
* TypeScript support
* MongoDB-friendly
* CLI key generation
* Zero external crypto dependencies

---

## Installation

```bash
npm install enkrypt
```

---

## Generate Encryption Key

```bash
npx enkrypt keygen
```

---

## Basic Usage

```ts
import { FieldGuard } from "enkrypt";

const guard = new FieldGuard({
  secretKeyHex: process.env.ENKRYPT_SECRET!
});

const encrypted = guard.encrypt(
  {
    text: "hello encrypted world"
  },
  ["text"]
);

console.log(encrypted);

const decrypted = guard.decrypt(
  encrypted,
  ["text"]
);

console.log(decrypted);
```

---

## Example Encrypted Output

```txt
v1:a4f91b7d3e20c19a44b1029c:f58d2c91a3b4c5d6e7f8e1d2c3b4a5f6:7ca91b4d...
```

---

## Express + MongoDB Example

```js
const { FieldGuard } = require("enkrypt");

const guard = new FieldGuard({
  secretKeyHex: process.env.ENKRYPT_SECRET,
});

const encrypted = guard.encrypt(
  {
    text: "Hello encrypted chat"
  },
  ["text"]
);

await Message.create(encrypted);

const messages = await Message.find();

const decrypted = messages.map(message =>
  guard.decrypt(
    message.toObject(),
    ["text"]
  )
);
```

---

## Security Notes

* Enkrypt uses AES-256-GCM authenticated encryption.
* Encryption keys should always be stored in environment variables.
* This package is intended for backend/server-side usage only.
* Encrypted fields are not searchable.
* This package has not yet undergone a third-party security audit.

---

## Current Limitations

* No searchable encrypted fields
* No key rotation support
* No ORM middleware integrations yet

---

## License

MIT
