# Kryptit

TypeScript field-level encryption SDK for securely storing backend data using AES-256-GCM.

---

## Why Kryptit?

Kryptit helps backend applications securely store sensitive data in encrypted form before it reaches the database layer.

Instead of storing plaintext values directly inside your database, Kryptit encrypts selected fields inside your application runtime using authenticated AES-256-GCM encryption.

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
npm install kryptit
```

---

## Generate Encryption Key

```bash
npx kryptit keygen
```

Example output:

```txt
fa5a8b25cc6426b746c5f5457d038ff0d49d67d948bd7d1d392285d77be98a9c
```

---

## Basic Usage

```ts
import { FieldGuard } from "kryptit";

const guard = new FieldGuard({
  secretKeyHex: process.env.KRYPTIT_SECRET!
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
const express = require("express");
const mongoose = require("mongoose");

const { FieldGuard } = require("kryptit");

const guard = new FieldGuard({
  secretKeyHex: process.env.KRYPTIT_SECRET,
});

const messageSchema = new mongoose.Schema({
  text: String,
});

const Message = mongoose.model(
  "Message",
  messageSchema
);

// Encrypt before saving
app.post("/send", async (req, res) => {

  const encrypted = guard.encrypt(
    {
      text: req.body.text
    },
    ["text"]
  );

  const message =
    await Message.create(encrypted);

  res.json(message);
});

// Decrypt after reading
app.get("/messages", async (req, res) => {

  const messages =
    await Message.find();

  const decrypted =
    messages.map(message =>
      guard.decrypt(
        message.toObject(),
        ["text"]
      )
    );

  res.json(decrypted);
});
```

---

## Security Notes

* Kryptit uses AES-256-GCM authenticated encryption.
* Encryption keys should always be stored in environment variables.
* Encryption keys must never be stored inside source code.
* Kryptit is designed for backend/server-side environments only.
* Encrypted fields are not searchable.
* This package has not yet undergone a third-party security audit.

---

## Current Limitations

* No searchable encrypted fields
* No key rotation support
* No ORM middleware integrations yet

---

## Development Status

Kryptit is currently in beta and under active development.

---

## License

MIT
