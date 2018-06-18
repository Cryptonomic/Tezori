"use strict";
exports.__esModule = true;
var base58Check = require("bs58check");
var bip39 = require("bip39");
var sodium = require("libsodium-wrappers-sumo");
var crypto = require("crypto");
/**
 * Cryptography helpers
 */
/**
 * Generates a salt for key derivation.
 * @returns {Buffer}    Salt
 */
function generateSaltForPwHash() {
    return crypto.randomBytes(sodium.crypto_pwhash_SALTBYTES);
}
exports.generateSaltForPwHash = generateSaltForPwHash;
/**
 * Encrypts a given message using a passphrase
 * @param {string} message  Message to encrypt
 * @param {string} passphrase   User-supplied passphrase
 * @param {Buffer} salt Salt for key derivation
 * @returns {Buffer}    Concatenated bytes of nonce and cipher text
 */
function encryptMessage(message, passphrase, salt) {
    var messageBytes = sodium.from_string(message);
    var keyBytes = sodium.crypto_pwhash(sodium.crypto_box_SEEDBYTES, passphrase, salt, sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE, sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE, sodium.crypto_pwhash_ALG_DEFAULT);
    var nonce = Buffer.from(sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES));
    var cipherText = Buffer.from(sodium.crypto_secretbox_easy(messageBytes, nonce, keyBytes));
    return Buffer.concat([nonce, cipherText]);
}
exports.encryptMessage = encryptMessage;
/**
 * Decrypts a given message using a passphrase
 * @param {Buffer} nonce_and_ciphertext Concatenated bytes of nonce and cipher text
 * @param {string} passphrase   User-supplied passphrase
 * @param {Buffer} salt Salt for key derivation
 * @returns {any}   Decrypted message
 */
function decryptMessage(nonce_and_ciphertext, passphrase, salt) {
    var keyBytes = sodium.crypto_pwhash(sodium.crypto_box_SEEDBYTES, passphrase, salt, sodium.crypto_pwhash_OPSLIMIT_INTERACTIVE, sodium.crypto_pwhash_MEMLIMIT_INTERACTIVE, sodium.crypto_pwhash_ALG_DEFAULT);
    if (nonce_and_ciphertext.length < sodium.crypto_secretbox_NONCEBYTES + sodium.crypto_secretbox_MACBYTES) {
        throw "The cipher text is of insufficient length";
    }
    var nonce = nonce_and_ciphertext.slice(0, sodium.crypto_secretbox_NONCEBYTES);
    var ciphertext = nonce_and_ciphertext.slice(sodium.crypto_secretbox_NONCEBYTES);
    return sodium.crypto_secretbox_open_easy(ciphertext, nonce, keyBytes, 'text');
}
exports.decryptMessage = decryptMessage;
/**
 * Get byte prefix for Base58Check encoding and decoding of a given type of data.
 * @param {String} prefix   The type of data
 * @returns {Buffer}    Byte prefix
 */
function getBase58BytesForPrefix(prefix) {
    switch (prefix) {
        case "tz1":
            return new Buffer([6, 161, 159]);
        case "edpk":
            return new Buffer([13, 15, 37, 217]);
        case "edsk":
            return new Buffer([43, 246, 78, 7]);
        case "edsig":
            return new Buffer([9, 245, 205, 134, 18]);
        case "op":
            return new Buffer([5, 116]);
        case "":
            return new Buffer([]);
        default:
            throw new RangeError("Unknown prefix");
    }
}
exports.getBase58BytesForPrefix = getBase58BytesForPrefix;
/**
 * Base58Check encodes a given binary payload using a given prefix.
 * @param {Buffer} payload  Binary payload
 * @param {String} prefix   Prefix
 * @returns {String}    Encoded string
 */
function base58CheckEncode(payload, prefix) {
    var prefixBytes = getBase58BytesForPrefix(prefix);
    var prefixedPayload = Buffer.concat([prefixBytes, payload]);
    return base58Check.encode(prefixedPayload);
}
exports.base58CheckEncode = base58CheckEncode;
/**
 * Base58Check decodes a given binary payload using a given prefix.
 * @param {String} s    Base58Check-encoded string
 * @param {String} prefix   Prefix
 * @returns {Buffer}    Decoded bytes
 */
function base58CheckDecode(s, prefix) {
    var prefixBytes = getBase58BytesForPrefix(prefix);
    var charsToSlice = prefixBytes.length;
    var decoded = base58Check.decode(s);
    return decoded.slice(charsToSlice);
}
exports.base58CheckDecode = base58CheckDecode;
/**
 * Generates keys from a user-supplied mnemonic and passphrase.
 * @param {string} mnemonic Fifteen word mnemonic phrase from fundraiser PDF.
 * @param {string} passphrase   User-supplied passphrase
 * @returns {KeyStore}  Generated keys
 */
function getKeysFromMnemonicAndPassphrase(mnemonic, passphrase) {
    var seed = bip39.mnemonicToSeed(mnemonic, passphrase).slice(0, 32);
    var key_pair = sodium.crypto_sign_seed_keypair(seed, "");
    var privateKey = base58CheckEncode(key_pair.privateKey, "edsk");
    var publicKey = base58CheckEncode(key_pair.publicKey, "edpk");
    var publicKeyHash = base58CheckEncode(sodium.crypto_generichash(20, key_pair.publicKey), "tz1");
    return {
        publicKey: publicKey,
        privateKey: privateKey,
        publicKeyHash: publicKeyHash
    };
}
exports.getKeysFromMnemonicAndPassphrase = getKeysFromMnemonicAndPassphrase;
/**
 * Generates a new bip39 mnemonic
 * @returns {string}    Fifteen word mnemonic
 */
function generateMnemonic() {
    return bip39.generateMnemonic(160);
}
exports.generateMnemonic = generateMnemonic;
