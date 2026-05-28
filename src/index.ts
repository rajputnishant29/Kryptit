import { FieldCipher } from "./crypto/cipher";
import { SchemaTraverser } from "./core/traverser";

export interface FieldGuardConfig {
    secretKeyHex: string;
}

export class FieldGuard {
    private readonly traverser: SchemaTraverser;
    constructor(config: FieldGuardConfig) {

        const cipher =
            new FieldCipher({
                secretKeyHex:
                    config.secretKeyHex
            });

        this.traverser =
            new SchemaTraverser(cipher);
    }
    public encrypt<T extends object>(
        data: T,
        fields: string[]
    ): T {

        return this.traverser.processObject(
            data,
            fields,
            "ENCRYPT"
        );
    }
    public decrypt<T extends object>(
        data: T,
        fields: string[]
    ): T {

        return this.traverser.processObject(
            data,
            fields,
            "DECRYPT"
        );
    }
}
export { generateKey } from "./keygen";


