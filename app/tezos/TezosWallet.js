"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var CryptoUtils = require("../utils/CryptoUtils");
var fs = require('fs');
/**
 * Functions for Tezos wallet functionality.
 */
/**
 * Saves a wallet to a given file.
 * @param {string} filename Name of file
 * @param {Wallet} wallet   Wallet object
 * @param {string} passphrase User-supplied passphrase
 * @returns {Promise<Wallet>} Wallet object loaded from disk
 */
function saveWallet(filename, wallet, passphrase) {
    return __awaiter(this, void 0, void 0, function () {
        var keys, salt, encryptedKeys, encryptedWallet;
        return __generator(this, function (_a) {
            keys = JSON.stringify(wallet.identities);
            salt = CryptoUtils.generateSaltForPwHash();
            encryptedKeys = CryptoUtils.encryptMessage(keys, passphrase, salt);
            encryptedWallet = {
                version: '1',
                salt: CryptoUtils.base58CheckEncode(salt, ""),
                ciphertext: CryptoUtils.base58CheckEncode(encryptedKeys, ""),
                kdf: 'Argon2'
            };
            fs.writeFileSync(filename, JSON.stringify(encryptedWallet));
            return [2 /*return*/, loadWallet(filename, passphrase)];
        });
    });
}
exports.saveWallet = saveWallet;
/**
 * Loads a wallet from a given file.
 * @param {string} filename Name of file
 * @param {string} passphrase User-supplied passphrase
 * @returns {Promise<Wallet>}   Loaded wallet
 */
function loadWallet(filename, passphrase) {
    return __awaiter(this, void 0, void 0, function () {
        var data, encryptedWallet, encryptedKeys, salt, keys;
        return __generator(this, function (_a) {
            data = fs.readFileSync(filename);
            encryptedWallet = JSON.parse(data.toString());
            encryptedKeys = CryptoUtils.base58CheckDecode(encryptedWallet.ciphertext, "");
            salt = CryptoUtils.base58CheckDecode(encryptedWallet.salt, "");
            keys = JSON.parse(CryptoUtils.decryptMessage(encryptedKeys, passphrase, salt));
            return [2 /*return*/, { identities: keys }];
        });
    });
}
exports.loadWallet = loadWallet;
/**
 * Creates a new wallet file.
 * @param {string} filename Where to save the wallet file
 * @param {string} password User-supplied passphrase used to secure wallet file
 * @returns {Promise<Wallet>}   Object corresponding to newly-created wallet
 */
function createWallet(filename, password) {
    return __awaiter(this, void 0, void 0, function () {
        var wallet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    wallet = {
                        identities: []
                    };
                    return [4 /*yield*/, saveWallet(filename, wallet, password)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, wallet];
            }
        });
    });
}
exports.createWallet = createWallet;
/**
 * Unlocks an identity supplied during the 2017 Tezos fundraiser.
 * @param {string} mnemonic Fifteen word mnemonic phrase from fundraiser PDF.
 * @param {string} email    Email address from fundraiser PDF.
 * @param {string} password Password from fundraiser PDF.
 * @returns {KeyStore}  Wallet file
 */
function unlockFundraiserIdentity(mnemonic, email, password) {
    var passphrase = email + password;
    return CryptoUtils.getKeysFromMnemonicAndPassphrase(mnemonic, passphrase);
}
exports.unlockFundraiserIdentity = unlockFundraiserIdentity;
/**
 * Generates a fifteen word mnemonic phrase using the BIP39 standard.
 * @returns {string}
 */
function generateMnemonic() {
    return CryptoUtils.generateMnemonic();
}
exports.generateMnemonic = generateMnemonic;
/**
 * Generates a key pair based on a mnemonic.
 * @param {string} mnemonic Fifteen word memonic phrase
 * @param {string} passphrase   User-supplied passphrase
 * @returns {KeyStore}  Unlocked key pair
 */
function unlockIdentityWithMnemonic(mnemonic, passphrase) {
    return CryptoUtils.getKeysFromMnemonicAndPassphrase(mnemonic, passphrase);
}
exports.unlockIdentityWithMnemonic = unlockIdentityWithMnemonic;
