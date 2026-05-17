/** @type {typeof _aes} */
export const aes: typeof _aes;
/** @type {typeof _chacha} */
export const chacha: typeof _chacha;
/** @type {typeof _salsa} */
export const salsa: typeof _salsa;
/** @type {typeof _noble_hmac} */
export const noble_hmac: typeof _noble_hmac;
/** @type {typeof _sha2} */
export const sha2: typeof _sha2;
/** @type {typeof _sha3} */
export const sha3: typeof _sha3;
/** @type {typeof _sha3_addons} */
export const sha3_addons: typeof _sha3_addons;
/** @type {typeof _blake3_mod} */
export const blake3_mod: typeof _blake3_mod;
/** @type {typeof _blake2} */
export const blake2: typeof _blake2;
/** @type {typeof _legacy} */
export const legacy: typeof _legacy;
/** @type {typeof _ml_kem512} */
export const ml_kem512: typeof _ml_kem512;
/** @type {typeof _ml_kem768} */
export const ml_kem768: typeof _ml_kem768;
/** @type {typeof _ml_kem1024} */
export const ml_kem1024: typeof _ml_kem1024;
/** @type {typeof _ml_dsa44} */
export const ml_dsa44: typeof _ml_dsa44;
/** @type {typeof _ml_dsa65} */
export const ml_dsa65: typeof _ml_dsa65;
/** @type {typeof _ml_dsa87} */
export const ml_dsa87: typeof _ml_dsa87;
/** @type {typeof _slh_dsa} */
export const slh_dsa: typeof _slh_dsa;
/** @type {typeof _falcon512} */
export const falcon512: typeof _falcon512;
/** @type {typeof _falcon1024} */
export const falcon1024: typeof _falcon1024;
/**
 * Map of Module-Lattice-Based Key-Encapsulation Mechanisms (ML-KEM)
 * FIPS 203 standardized (formerly Kyber)
 * @type {Readonly<Record<string, any>>}
 */
export const nobleMlkemMap: Readonly<Record<string, any>>;
/**
 * Map of Module-Lattice-Based Digital Signature Algorithms (ML-DSA)
 * FIPS 204 standardized (formerly Dilithium)
 * @type {Readonly<Record<string, any>>}
 */
export const nobleMldsaMap: Readonly<Record<string, any>>;
/**
 * Map of Falcon Digital Signature Algorithms
 * Fast Lattice-based Compact Signatures over NTRU
 * @type {Readonly<Record<string, any>>}
 */
export const nobleFalconMap: Readonly<Record<string, any>>;
/**
 * Map of Symmetric Ciphers (AES, ChaCha, Salsa)
 * @type {Readonly<Record<string, any>>}
 */
export const nobleCipherMap: Readonly<Record<string, any>>;
/**
 * Map of HMAC implementations using various Hash functions
 * @type {Readonly<Record<string, any>>}
 */
export const nobleHmacMap: Readonly<Record<string, any>>;
/**
 * Map of Cryptographic Hash Functions
 * Includes SHA-2, SHA-3, Keccak, Blake2/3 and Legacy support.
 * @type {Readonly<Record<string, any>>}
 */
export const nobleHashMap: Readonly<Record<string, any>>;
/**
 * Map of Extendable-Output Functions (XOF)
 * Includes SHAKE, cSHAKE, TurboSHAKE and KangarooTwelve.
 * @type {Readonly<Record<string, any>>}
 */
export const nobleXofMap: Readonly<Record<string, any>>;
/**
 * Map of KMAC (Keccak Message Authentication Code) implementations
 * @type {Readonly<Record<string, any>>}
 */
export const nobleKmacMap: Readonly<Record<string, any>>;
/**
 * Master Algorithm Map
 * Consolidates all available cryptographic primitives.
 * @type {Readonly<Record<string, any>>}
 */
export const nobleAlgMap: Readonly<Record<string, any>>;
import * as _aes from '@noble/ciphers/aes.js';
import * as _chacha from '@noble/ciphers/chacha.js';
import * as _salsa from '@noble/ciphers/salsa.js';
import { hmac as _noble_hmac } from '@noble/hashes/hmac.js';
import * as _sha2 from '@noble/hashes/sha2.js';
import * as _sha3 from '@noble/hashes/sha3.js';
import * as _sha3_addons from '@noble/hashes/sha3-addons.js';
import * as _blake3_mod from '@noble/hashes/blake3.js';
import * as _blake2 from '@noble/hashes/blake2.js';
import * as _legacy from '@noble/hashes/legacy.js';
import { ml_kem512 as _ml_kem512 } from '@noble/post-quantum/ml-kem.js';
import { ml_kem768 as _ml_kem768 } from '@noble/post-quantum/ml-kem.js';
import { ml_kem1024 as _ml_kem1024 } from '@noble/post-quantum/ml-kem.js';
import { ml_dsa44 as _ml_dsa44 } from '@noble/post-quantum/ml-dsa.js';
import { ml_dsa65 as _ml_dsa65 } from '@noble/post-quantum/ml-dsa.js';
import { ml_dsa87 as _ml_dsa87 } from '@noble/post-quantum/ml-dsa.js';
import * as _slh_dsa from '@noble/post-quantum/slh-dsa.js';
import { falcon512 as _falcon512 } from '@noble/post-quantum/falcon.js';
import { falcon1024 as _falcon1024 } from '@noble/post-quantum/falcon.js';
