"use strict";
exports.__esModule = true;
var base58Check = require("bs58check");
var bip39 = require("bip39");
var sodium = require("libsodium-wrappers");
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
        default:
            throw new RangeError("Unknown prefix");
    }
}
exports.getBase58BytesForPrefix = getBase58BytesForPrefix;
function base58CheckEncode(payload, prefix) {
    var prefixBytes = getBase58BytesForPrefix(prefix);
    var prefixedPayload = Buffer.concat([prefixBytes, payload]);
    return base58Check.encode(prefixedPayload);
}
exports.base58CheckEncode = base58CheckEncode;
function base58CheckDecode(s, prefix) {
    var prefixBytes = getBase58BytesForPrefix(prefix);
    var charsToSlice = prefixBytes.length;
    var decoded = base58Check.decode(s);
    return decoded.slice(charsToSlice);
}
exports.base58CheckDecode = base58CheckDecode;
function getKeysFromMnemonicAndPassphrase(mnemonic, passphrase) {
    var seed = bip39.mnemonicToSeed(mnemonic, passphrase).slice(0, 32);
    var key_pair = sodium.crypto_sign_seed_keypair(seed);
    var privateKey = base58CheckEncode(key_pair.privateKey, "edsk");
    var publicKey = base58CheckEncode(key_pair.publicKey, "edpk");
    var publicKeyHash = base58CheckEncode(sodium.crypto_generichash(20, key_pair.publicKey), "tz1");
    return {
        publicKey: publicKey.toString(),
        privateKey: privateKey.toString(),
        publicKeyHash: publicKeyHash.toString()
    };
}
exports.getKeysFromMnemonicAndPassphrase = getKeysFromMnemonicAndPassphrase;
function generateMnemonic() {
    return bip39.generateMnemonic(160);
}
exports.generateMnemonic = generateMnemonic;
