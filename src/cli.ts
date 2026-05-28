#!/usr/bin/env node

import { generateKey } from "./keygen";

const command = process.argv[2];

if (command === "keygen") {

    console.log(generateKey());

} else {

    console.log(`
Usage:

npx enkrypt keygen
`);
}