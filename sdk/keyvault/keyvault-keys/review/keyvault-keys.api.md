## API Report File for "@azure/keyvault-keys"

> Do not edit this file. It is a report generated by [API Extractor](https://api-extractor.com/).

```ts

import * as coreHttp from '@azure/core-http';
import { PagedAsyncIterableIterator } from '@azure/core-paging';
import { PageSettings } from '@azure/core-paging';
import { PipelineOptions } from '@azure/core-http';
import { PollerLike } from '@azure/core-lro';
import { PollOperationState } from '@azure/core-lro';
import { TokenCredential } from '@azure/core-http';

// @public
export interface BackupKeyOptions extends coreHttp.OperationOptions {
}

// @public
export interface BeginDeleteKeyOptions extends KeyPollerOptions {
}

// @public
export interface BeginRecoverDeletedKeyOptions extends KeyPollerOptions {
}

// @public
export interface CreateEcKeyOptions extends CreateKeyOptions {
    curve?: KeyCurveName;
    hsm?: boolean;
}

// @public
export interface CreateKeyOptions extends coreHttp.OperationOptions {
    enabled?: boolean;
    readonly expiresOn?: Date;
    keyOps?: KeyOperation[];
    keySize?: number;
    notBefore?: Date;
    tags?: {
        [propertyName: string]: string;
    };
}

// @public
export interface CreateRsaKeyOptions extends CreateKeyOptions {
    hsm?: boolean;
    keySize?: number;
}

// @public
export class CryptographyClient {
    constructor(key: string | KeyVaultKey, // keyUrl or KeyVaultKey
    credential: TokenCredential, pipelineOptions?: PipelineOptions);
    decrypt(algorithm: EncryptionAlgorithm, ciphertext: Uint8Array, options?: DecryptOptions): Promise<DecryptResult>;
    encrypt(algorithm: EncryptionAlgorithm, plaintext: Uint8Array, options?: EncryptOptions): Promise<EncryptResult>;
    sign(algorithm: SignatureAlgorithm, digest: Uint8Array, options?: SignOptions): Promise<SignResult>;
    signData(algorithm: SignatureAlgorithm, data: Uint8Array, options?: SignOptions): Promise<SignResult>;
    unwrapKey(algorithm: KeyWrapAlgorithm, encryptedKey: Uint8Array, options?: UnwrapKeyOptions): Promise<UnwrapResult>;
    verify(algorithm: SignatureAlgorithm, digest: Uint8Array, signature: Uint8Array, options?: VerifyOptions): Promise<VerifyResult>;
    verifyData(algorithm: SignatureAlgorithm, data: Uint8Array, signature: Uint8Array, options?: VerifyOptions): Promise<VerifyResult>;
    wrapKey(algorithm: KeyWrapAlgorithm, key: Uint8Array, options?: WrapKeyOptions): Promise<WrapResult>;
}

// @public
export interface CryptographyOptions extends coreHttp.OperationOptions {
}

// @public
export interface DecryptOptions extends CryptographyOptions {
}

// @public
export interface DecryptResult {
    algorithm: EncryptionAlgorithm;
    keyID?: string;
    result: Uint8Array;
}

// @public
export interface DeletedKey {
    id?: string;
    key?: JsonWebKey;
    keyOperations?: KeyOperation[];
    keyType?: KeyType;
    name: string;
    properties: KeyProperties & {
        readonly recoveryId?: string;
        readonly scheduledPurgeDate?: Date;
        deletedOn?: Date;
    };
}

// @public
export type DeletionRecoveryLevel = "Purgeable" | "Recoverable+Purgeable" | "Recoverable" | "Recoverable+ProtectedSubscription";

// @public
export type EncryptionAlgorithm = "RSA-OAEP" | "RSA-OAEP-256" | "RSA1_5";

// @public
export interface EncryptOptions extends CryptographyOptions {
}

// @public
export interface EncryptResult {
    algorithm: EncryptionAlgorithm;
    keyID?: string;
    result: Uint8Array;
}

// @public
export interface GetDeletedKeyOptions extends coreHttp.OperationOptions {
}

// @public
export interface GetKeyOptions extends coreHttp.OperationOptions {
    version?: string;
}

// @public
export interface ImportKeyOptions extends coreHttp.OperationOptions {
    enabled?: boolean;
    expiresOn?: Date;
    hardwareProtected?: boolean;
    notBefore?: Date;
    tags?: {
        [propertyName: string]: string;
    };
}

// @public
export interface JsonWebKey {
    crv?: KeyCurveName;
    d?: Uint8Array;
    dp?: Uint8Array;
    dq?: Uint8Array;
    e?: Uint8Array;
    k?: Uint8Array;
    keyOps?: KeyOperation[];
    kid?: string;
    kty?: KeyType;
    n?: Uint8Array;
    p?: Uint8Array;
    q?: Uint8Array;
    qi?: Uint8Array;
    t?: Uint8Array;
    x?: Uint8Array;
    y?: Uint8Array;
}

// @public
export class KeyClient {
    constructor(vaultUrl: string, credential: TokenCredential, pipelineOptions?: PipelineOptions);
    backupKey(name: string, options?: BackupKeyOptions): Promise<Uint8Array | undefined>;
    beginDeleteKey(name: string, options?: BeginDeleteKeyOptions): Promise<PollerLike<PollOperationState<DeletedKey>, DeletedKey>>;
    beginRecoverDeletedKey(name: string, options?: BeginRecoverDeletedKeyOptions): Promise<PollerLike<PollOperationState<DeletedKey>, DeletedKey>>;
    createEcKey(name: string, options?: CreateEcKeyOptions): Promise<KeyVaultKey>;
    createKey(name: string, keyType: KeyType, options?: CreateKeyOptions): Promise<KeyVaultKey>;
    createRsaKey(name: string, options?: CreateRsaKeyOptions): Promise<KeyVaultKey>;
    getDeletedKey(name: string, options?: GetDeletedKeyOptions): Promise<DeletedKey>;
    getKey(name: string, options?: GetKeyOptions): Promise<KeyVaultKey>;
    importKey(name: string, key: JsonWebKey, options: ImportKeyOptions): Promise<KeyVaultKey>;
    listDeletedKeys(options?: ListDeletedKeysOptions): PagedAsyncIterableIterator<DeletedKey, DeletedKey[]>;
    listPropertiesOfKeys(options?: ListPropertiesOfKeysOptions): PagedAsyncIterableIterator<KeyProperties, KeyProperties[]>;
    listPropertiesOfKeyVersions(name: string, options?: ListPropertiesOfKeyVersionsOptions): PagedAsyncIterableIterator<KeyProperties, KeyProperties[]>;
    purgeDeletedKey(name: string, options?: PurgeDeletedKeyOptions): Promise<void>;
    restoreKeyBackup(backup: Uint8Array, options?: RestoreKeyBackupOptions): Promise<KeyVaultKey>;
    updateKeyProperties(name: string, keyVersion: string, options?: UpdateKeyPropertiesOptions): Promise<KeyVaultKey>;
    readonly vaultUrl: string;
}

// @public
export type KeyCurveName = "P-256" | "P-384" | "P-521" | "P-256K";

// @public
export type KeyOperation = "encrypt" | "decrypt" | "sign" | "verify" | "wrapKey" | "unwrapKey";

// @public
export interface KeyPollerOptions extends coreHttp.OperationOptions {
    intervalInMs?: number;
    resumeFrom?: string;
}

// @public
export interface KeyProperties {
    readonly createdOn?: Date;
    enabled?: boolean;
    expiresOn?: Date;
    id?: string;
    name: string;
    notBefore?: Date;
    readonly recoveryLevel?: DeletionRecoveryLevel;
    tags?: {
        [propertyName: string]: string;
    };
    readonly updatedOn?: Date;
    vaultUrl: string;
    version?: string;
}

// @public
export type KeyType = "EC" | "EC-HSM" | "RSA" | "RSA-HSM" | "oct";

// @public
export interface KeyVaultKey {
    id?: string;
    key?: JsonWebKey;
    keyOperations?: KeyOperation[];
    keyType?: KeyType;
    name: string;
    properties: KeyProperties;
}

// @public
export type KeyWrapAlgorithm = "RSA-OAEP" | "RSA-OAEP-256" | "RSA1_5";

// @public
export interface ListDeletedKeysOptions extends coreHttp.OperationOptions {
}

// @public
export interface ListPropertiesOfKeysOptions extends coreHttp.OperationOptions {
}

// @public
export interface ListPropertiesOfKeyVersionsOptions extends coreHttp.OperationOptions {
}

// @public
export const logger: import("@azure/logger").AzureLogger;

export { PagedAsyncIterableIterator }

export { PageSettings }

export { PipelineOptions }

export { PollerLike }

export { PollOperationState }

// @public
export interface PurgeDeletedKeyOptions extends coreHttp.OperationOptions {
}

// @public
export interface RestoreKeyBackupOptions extends coreHttp.OperationOptions {
}

// @public
export type SignatureAlgorithm = "PS256" | "PS384" | "PS512" | "RS256" | "RS384" | "RS512" | "ES256" | "ES384" | "ES512" | "ES256K";

// @public
export interface SignOptions extends CryptographyOptions {
}

// @public
export interface SignResult {
    algorithm: SignatureAlgorithm;
    keyID?: string;
    result: Uint8Array;
}

// @public
export interface UnwrapKeyOptions extends CryptographyOptions {
}

// @public
export interface UnwrapResult {
    keyID?: string;
    result: Uint8Array;
}

// @public
export interface UpdateKeyPropertiesOptions extends coreHttp.OperationOptions {
    enabled?: boolean;
    expiresOn?: Date;
    keyOps?: KeyOperation[];
    notBefore?: Date;
    tags?: {
        [propertyName: string]: string;
    };
}

// @public
export interface VerifyOptions extends CryptographyOptions {
}

// @public
export interface VerifyResult {
    keyID?: string;
    result: boolean;
}

// @public
export interface WrapKeyOptions extends CryptographyOptions {
}

// @public
export interface WrapResult {
    algorithm: KeyWrapAlgorithm;
    keyID?: string;
    result: Uint8Array;
}


// (No @packageDocumentation comment for this package)

```
