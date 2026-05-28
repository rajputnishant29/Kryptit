import {
    createCipheriv,
    createDecipheriv,
    randomBytes
} from "node:crypto";

export interface CipherConfig {
    secretKeyHex: string;
}

export class FieldCipher {
    private readonly ALGORITHM = "aes-256-gcm";
    private readonly IV_LENGTH = 12;

    private readonly keyBuffer: Buffer;

    constructor(config: CipherConfig) {
        this.keyBuffer = Buffer.from(
            config.secretKeyHex,
            "hex"
        );

        if (this.keyBuffer.length !== 32) {
            throw new Error(
                "Encryption key must be exactly 32 bytes"
            );
        }
    }

    /**
     * Encrypts a plaintext string.
     * Returns a string in the format: ivHex:authTagHex:encryptedHex
     */
    public encryptString(plainText: string): string {
        if (!plainText) {
            throw new Error("Plaintext cannot be empty");
        }

        // 1. Generate a unique IV for every encryption operation
        const iv = randomBytes(this.IV_LENGTH);

        // 2. Create the cipher instance
        const cipher = createCipheriv(this.ALGORITHM, this.keyBuffer, iv);

        // 3. Encrypt the text
        let encrypted = cipher.update(plainText, "utf8", "hex");
        encrypted += cipher.final("hex");

        // 4. Retrieve the authentication tag (must be done AFTER cipher.final())
        const authTag = cipher.getAuthTag().toString("hex");

        // 5. Combine IV, Auth Tag, and Ciphertext into a single string
        return `v1:${iv.toString("hex")}:${authTag}:${encrypted}`;
    }

    /**
     * Decrypts an encrypted string formatted as: ivHex:authTagHex:encryptedHex
     */
    public decryptString(encryptedPayload: string): string {
        if (!encryptedPayload) {
            throw new Error("Encrypted payload cannot be empty");
        }

        // 1. Split the payload into its component parts
        const parts = encryptedPayload.split(":");
        if (parts.length !== 4) {
            throw new Error("Invalid encrypted payload format");
        }

        const [version, ivHex, authTagHex, encryptedHex] = parts;

        if (version !== "v1") {
            throw new Error("Unsupported token version");
        }

        const iv = Buffer.from(ivHex, "hex");
        const authTag = Buffer.from(authTagHex, "hex");

        // 2. Create the decipher instance
        const decipher = createDecipheriv(this.ALGORITHM, this.keyBuffer, iv);

        // 3. Set the expected authentication tag
        decipher.setAuthTag(authTag);

        // 4. Decrypt the text
        let decrypted = decipher.update(encryptedHex, "hex", "utf8");
        decrypted += decipher.final("utf8");


        return decrypted;
    }

    public destroy(): void {
        this.keyBuffer.fill(0);
    }
}