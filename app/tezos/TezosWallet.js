"use strict";
import { getAccount } from './TezosQuery';

exports.__esModule = true;
var fs = require("fs");
var CryptoUtils = require("../utils/CryptoUtils");

function createWallet(filename, password) {
    return new Promise(function (resolve, reject) {
        if (fs.existsSync(filename))
            reject("A wallet already exists at this path!");
        var wallet = {
            identities: []
        };
        fs.writeFile(filename, JSON.stringify(wallet), function (err) {
            if (err)
                reject(err);
            resolve(wallet);
        });
    });
}
exports.createWallet = createWallet;
function saveWallet(filename, wallet) {
    return new Promise(function (resolve, reject) {
        fs.writeFile(filename, JSON.stringify(wallet), function (err) {
            if (err)
                reject(err);
            resolve(wallet);
        });
    });
}
exports.saveWallet = saveWallet;
function loadWallet(filename, password) {
    return new Promise(function (resolve, reject) {
        fs.readFile(filename, function (err, data) {
            if (err)
                reject(err);
            var wallet = JSON.parse(data.toString());
            resolve(wallet);
        });
    });
}
exports.loadWallet = loadWallet;
function unlockFundraiserIdentity(mnemonic, email, password) {
    var passphrase = email + password;
    return CryptoUtils.getKeysFromMnemonicAndPassphrase(mnemonic, passphrase);
}
exports.unlockFundraiserIdentity = unlockFundraiserIdentity;
function generateMnemonic() {
    return CryptoUtils.generateMnemonic();
}
exports.generateMnemonic = generateMnemonic;
function unlockIdentityWithMnemonic(mnemonic, passphrase) {
    return CryptoUtils.getKeysFromMnemonicAndPassphrase(mnemonic, passphrase);
}
exports.unlockIdentityWithMnemonic = unlockIdentityWithMnemonic;

exports.getBalance = (id, network) => {
  return getAccount(network, id)
  .then(res => res.account.balance);
};
