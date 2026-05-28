import { FieldCipher } from "../crypto/cipher";

type TraversalMode = "ENCRYPT" | "DECRYPT";

function isPlainObject(
    value: unknown
): value is Record<string, unknown> {
    if (typeof value !== "object" || value === null) {
        return false;
    }
    return Object.getPrototypeOf(value) === Object.prototype;
}

export class SchemaTraverser {
    constructor(
        private readonly cipher: FieldCipher
    ) { }

    public processObject<T>(
        target: T,
        keysToEncrypt: string[],
        mode: TraversalMode
    ): T {
        // 1. Handle primitives
        if (target === null || typeof target !== "object") {
            return target;
        }

        // 2. Handle arrays recursively
        if (Array.isArray(target)) {
            return target.map(item =>
                this.processObject(item, keysToEncrypt, mode)
            ) as unknown as T;
        }

        // 3. Handle non-plain objects (like Dates, Maps, etc.) by returning them as-is
        if (!isPlainObject(target)) {
            return target;
        }

        // 4. Create a shallow clone to avoid mutating the original input
        const output = { ...target } as Record<string, unknown>;

        for (const key of Object.keys(output)) {
            const value = output[key];
            const shouldProcess = keysToEncrypt.includes(key);

            if (shouldProcess && typeof value === "string") {
                // Perform encryption/decryption on target string keys
                if (mode === "ENCRYPT") {

                    output[key] =
                        this.cipher.encryptString(value);

                } else {

                    // Legacy plaintext passthrough
                    if (!value.startsWith("v1:")) {
                        output[key] = value;
                        continue;
                    }

                    try {

                        output[key] =
                            this.cipher.decryptString(value);

                    } catch {

                        throw new Error(
                            `Failed to decrypt field "${key}"`
                        );
                    }
                }
            } else if (typeof value === "object" && value !== null) {
                // Recursively traverse inner objects/arrays
                output[key] = this.processObject(value, keysToEncrypt, mode);
            }
        }

        return output as T;
    }
}