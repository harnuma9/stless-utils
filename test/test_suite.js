import test from 'node:test';
import assert from 'node:assert/strict';
import Utils from '@stless/utils';

/**
 * @stless/utils - Unified Test Suite
 * Covers: Core, Codecs, Crypto, PQC, and Mnemonics
 */

test('Core Utilities & Memory Safety', async (t) => {
  await t.test('hardenRNG & alloc', async () => {
    const buf = await Utils.hardenRNG(32);
    assert.strictEqual(buf.length, 32);

    const allocated = Utils.alloc(16);
    assert.strictEqual(allocated.length, 16);
    assert.strictEqual(allocated[0], 0, 'Allocated buffer must be zero-filled');
  });

  await t.test('Constant-Time Comparison', () => {
    const a = Utils.buff('secret');
    const b = Utils.buff('secret');
    const c = Utils.buff('wrong!');

    assert.strictEqual(Utils.compare(a, b), true);
    assert.strictEqual(Utils.compare(a, c), false);
    assert.strictEqual(Utils.compare('test', 'test', { harden: true }), true);
  });

  await t.test('Memory Sanitization (zeroBuf)', () => {
    const buf = Utils.buff('sensitive data');
    Utils.zeroBuf(buf);
    assert.ok(buf.every(byte => byte === 0), 'Buffer should be wiped to zeros');

    const ui8 = new Uint8Array([1, 2, 3]);
    Utils.zeroBuf(ui8);
    assert.strictEqual(ui8[0], 0);
  });

  await t.test('bool utility flags', () => {
    // Standard truthiness evaluation
    assert.strictEqual(Utils.bool(true), true);
    assert.strictEqual(Utils.bool('data'), true);
    assert.strictEqual(Utils.bool(''), false);
    assert.strictEqual(Utils.bool(0), false);
    assert.strictEqual(Utils.bool(null), false);

    // Length-constrained truthiness validation
    assert.strictEqual(Utils.bool('A', true), true);
    assert.strictEqual(Utils.bool([1], true), true);
    assert.strictEqual(Utils.bool('', true), false);
    assert.strictEqual(Utils.bool([], true), false);
  });

  await t.test('copyBuf clone protection & sanitization', () => {
    const original = Utils.buff('immutable payload');
    const clone = Utils.copyBuf(original, original.length, false);

    assert.deepEqual(clone, original, 'Cloned buffer data alignment match');
    assert.notEqual(clone, original, 'References must point to distinct memory addresses');

    // Destructive isolation test copy
    const target = Utils.buff('volatile target');
    const cleanClone = Utils.copyBuf(target, target.length, true);
    
    assert.strictEqual(cleanClone.toString(), 'volatile target', 'Extracted value valid');
    assert.ok(target.every(b => b === 0), 'Source allocation cleared immediately after extraction');
  });
});

test('Dynamic Type Assertion Primitives', async (t) => {
  await t.test('Primitive type checking matrix validation', () => {
    // True positive evaluations
    assert.strictEqual(Utils.isString('hello world'), true);
    assert.strictEqual(Utils.isNumber(42), true);
    assert.strictEqual(Utils.isBoolean(false), true);
    assert.strictEqual(Utils.isObject({ key: 'val' }), true);
    assert.strictEqual(Utils.isUndefined(undefined), true);
    assert.strictEqual(Utils.isFunction(() => {}), true);
    assert.strictEqual(Utils.isSymbol(Symbol('id')), true);
    assert.strictEqual(Utils.isBigInt(100n), true);

    // Null safety exclusions (typeof null === 'object')
    assert.strictEqual(Utils.isObject(null), false, 'Null must not resolve as an object');

    // Type crossed-boundary negatives
    assert.strictEqual(Utils.isString(123), false);
    assert.strictEqual(Utils.isNumber('123'), false);
    assert.strictEqual(Utils.isBoolean(null), false);
  });
});

test('Encoding & Codecs', async (t) => {
  await t.test('Base16 & Base58 Roundtrip', () => {
    const hex = '48656C6C6F'; // "Hello"
    const buf = Utils.buff(hex, { encoding: 'base16' });
    assert.strictEqual(buf.toString(), 'Hello');

    const b58 = Utils.codec('base58').encode(buf);
    const decoded = Utils.codec('base58').decode(b58);
    assert.deepEqual(Buffer.from(decoded), buf);
  });

  await t.test('Dynamic Scure-Base Codec Modules Roundtrip', () => {
    const data = Utils.buff('CryptographicPayload2026');

    // Base16 Check
    const b16Str = Utils.toBase16(data);
    assert.strictEqual(Utils.fromBase16(b16Str).toString(), 'CryptographicPayload2026');

    // Base32 Check
    const b32Str = Utils.toBase32(data);
    assert.strictEqual(Utils.fromBase32(b32Str).toString(), 'CryptographicPayload2026');

    // Base58 Check
    const b58Str = Utils.toBase58(data);
    assert.strictEqual(Utils.fromBase58(b58Str).toString(), 'CryptographicPayload2026');

    // Base64 Check
    const b64Str = Utils.toBase64(data);
    assert.strictEqual(Utils.fromBase64(b64Str).toString(), 'CryptographicPayload2026');

    // Base64Url Check
    const b64UrlStr = Utils.toBase64Url(data);
    assert.strictEqual(Utils.fromBase64Url(b64UrlStr).toString(), 'CryptographicPayload2026');
  });

  await t.test('Dynamic Codec clear memory options flag verification', () => {
    const bufferA = Utils.buff('sensitive secret data');
    const encoded = Utils.toBase64(bufferA, true);

    assert.ok(encoded.length > 0);
    assert.ok(bufferA.every(b => b === 0), 'Underlying raw source input must be zero-wiped out post encoding operation');
  });

  await t.test('Bitcoin WIF (Wallet Import Format)', async () => {
    const privKey = await Utils.hardenRNG(32);
    const encoded = Utils.wif.encode(privKey, { compressed: true });

    assert.match(encoded, /^[LK]/, 'Compressed Mainnet WIF starts with L or K');

    const decoded = Utils.wif.decode(encoded);
    assert.deepEqual(decoded.privateKey, Buffer.from(privKey));
    assert.strictEqual(decoded.version, 0x80);
  });
});

test('Post-Quantum Cryptography (PQC)', async (t) => {
  // Helper for checking determinism across NIST algorithms
  const checkPQC = (name, fn, seedSize, pubLen) => {
    const seed = Buffer.alloc(seedSize, 0x42);
    const keys1 = fn(name, { seed });
    const keys2 = fn(name, { seed });

    assert.deepEqual(keys1.publicKey, keys2.publicKey, `${name} should be deterministic`);
    assert.strictEqual(keys1.publicKey.length, pubLen, `${name} public key length mismatch`);
  };

  await t.test('ML-KEM (FIPS 203)', () => {
    checkPQC('ml-kem-768', Utils.mlkem, 64, 1184);
  });

  await t.test('ML-DSA (FIPS 204)', () => {
    checkPQC('ml-dsa-65', Utils.mldsa, 32, 1952);
  });

  await t.test('SLH-DSA (FIPS 205)', () => {
    checkPQC('slh-dsa-sha2-128f', Utils.slhdsa, 64, 32);
  });

  await t.test('Falcon (NIST Round 3)', async () => {
    const seed = await Utils.hardenRNG(48);
    const keys = Utils.falcon('falcon512', { seed });
    assert.ok(keys.publicKey instanceof Uint8Array);
  });
});

test('Standard Cryptography & KDF', async (t) => {
  await t.test('AES-256-CTR & ChaCha20 Encryption', async () => {
    const key = await Utils.hardenRNG(32);
    const iv = await Utils.hardenRNG(16);
    const iv2 = await Utils.hardenRNG(12);
    const msg = Utils.buff('top secret');
  
    const cipher = Utils.getCipher('aes-256-ctr', { key, iv, extra: true, e: true });
    const encrypted = cipher.update(msg);
  
    const decipher = Utils.getCipher('aes-256-ctr', { key, iv, extra: true, e: false });
    const decrypted = decipher.update(encrypted);
  
    assert.strictEqual(Buffer.from(decrypted).toString(), 'top secret');
  
    const cipher2 = Utils.getCipher('chacha20', { key, iv: iv2, extra: true, e: true });
    const encrypted2 = cipher2.update(msg);
  
    const decipher2 = Utils.getCipher('chacha20', { key, iv: iv2, extra: true, e: false });
    const decrypted2 = decipher2.update(encrypted2);
    assert.strictEqual(Buffer.from(decrypted2).toString(), 'top secret');
  });

  await t.test('XSalsa20 & XChaCha20 Encryption', async () => {
    const key = await Utils.hardenRNG(32);
    const iv = await Utils.hardenRNG(24);
    const iv2 = await Utils.hardenRNG(24);
    const msg = Utils.buff('top secret');
  
    const cipher = Utils.getCipher('xsalsa20', { key, iv, extra: true, e: true });
    const encrypted = cipher.update(msg);
  
    const decipher = Utils.getCipher('xsalsa20', { key, iv, extra: true, e: false });
    const decrypted = decipher.update(encrypted);
  
    assert.strictEqual(Buffer.from(decrypted).toString(), 'top secret');
  
    const cipher2 = Utils.getCipher('xchacha20', { key, iv: iv2, extra: true, e: true });
    const encrypted2 = cipher2.update(msg);
  
    const decipher2 = Utils.getCipher('xchacha20', { key, iv: iv2, extra: true, e: false });
    const decrypted2 = decipher2.update(encrypted2);
    assert.strictEqual(Buffer.from(decrypted2).toString(), 'top secret');
  });
  
  await t.test('AES-256-GCM & XChaCha20-Poly1305 Encryption', async () => {
    const key = await Utils.hardenRNG(32);
    const iv = await Utils.hardenRNG(12);
    const iv2 = await Utils.hardenRNG(24);
    const msg = Utils.buff('top secret');

    const cipher = Utils.getCipher('aes-256-gcm', { key, iv, extra: true, e: true });
    const encrypted = cipher.update(msg);

    const decipher = Utils.getCipher('aes-256-gcm', { key, iv, extra: true, e: false });
    const decrypted = decipher.update(encrypted);

    assert.strictEqual(Buffer.from(decrypted).toString(), 'top secret');

    const cipher2 = Utils.getCipher('xchacha20-poly1305', { key, iv: iv2, extra: true, e: true });
    const encrypted2 = cipher2.update(msg);

    const decipher2 = Utils.getCipher('xchacha20-poly1305', { key, iv: iv2, extra: true, e: false });
    const decrypted2 = decipher2.update(encrypted2);
    assert.strictEqual(Buffer.from(decrypted2).toString(), 'top secret');
  });

  await t.test('Argon2id Determinism', async () => {
    const pass = Utils.buff('password123');
    const salt = Buffer.alloc(16, 0x01);
    const opts = { msg: pass, salt, t: 2, m: 16384 };

    const hash1 = await Utils.argon2('argon2id', opts);
    const hash2 = await Utils.argon2('argon2id', opts);
    assert.deepEqual(hash1, hash2);
  });

  await t.test('Modern XOF (BLAKE3 & SHAKE)', () => {
    const b3 = Utils.getHash('blake3', { extra: true }).update(Utils.buff('hi')).digest();
    assert.strictEqual(b3.length, 32);

    const shake = Utils.getXof('shake256', { extra: true, o: { dkLen: 64 } }).update(Utils.buff('hi')).digest();
    assert.strictEqual(shake.length, 64);
  });
});

test('Mnemonics (BIP39 & iKey)', async (t) => {
  await t.test('BIP39 Entropy Recovery', async () => {
    const entropy = await Utils.hardenRNG(16);
    const mnemonic = Utils.bip39.toMnemonic(entropy);
    const recovered = Utils.bip39.toEntropy(mnemonic);
    assert.strictEqual(recovered, entropy.toString('hex'));
  });

  await t.test('BIP39 Seed Derivation', () => {
    const mnemonic = 'abandon '.repeat(11) + 'about';
    const seed = Utils.bip39.toSeed(mnemonic);
    assert.strictEqual(seed.length, 64);
  });

  await t.test('iKey 256-bit Generation', async () => {
    const phrase = await Utils.ikey.generate(256);
    assert.strictEqual(phrase.split(' ').length, 17, '256-bit iKey should be 17 words');
    assert.ok(Utils.ikey.validate(phrase));
  });

  await t.test('Mnemonic Validation', () => {
    const valid = 'abandon '.repeat(11) + 'about';
    assert.strictEqual(Utils.bip39.validate(valid), true);
    assert.strictEqual(Utils.bip39.validate('wrong mnemonic here'), false);
  });
});