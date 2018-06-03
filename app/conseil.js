"use strict";
exports.__esModule = true;
var CryptoUtils = require("./utils/CryptoUtils");
var fs = require("fs");
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
function getAccountsForIdentity(id, network) {
    return new Promise(function (resolve, reject) {
        resolve([
            {
                address: 'TZ1tmv69RYRXaney2zX6QA5J8ZwM1SPnZaM4',
                isContract: false,
                balance: 100
            }
        ]);
    });
}
exports.getAccountsForIdentity = getAccountsForIdentity;
function getBalance(id, network) {
    return new Promise(function (resolve, reject) {
        resolve(50);
    });
}
exports.getBalance = getBalance;
function getTransactionsForAddress(id, network) {
    return new Promise(function (resolve, reject) {
        resolve([
            {
                id: 'oo3g2w3h9pK56GafXEHuu3FWZGKy6ctMjViw46aTT41qUK3FWEW',
                sender: id,
                recipient: id,
                amount: 10
            },
            {
                id: 'oo3g2w3h9pK56GafXEHuu3FWZGKy6ctMjViw46aTT41qUK3FWEW',
                sender: id,
                recipient: id,
                amount: -20
            }
        ]);
    });
}
exports.getTransactionsForAddress = getTransactionsForAddress;
function sendTransaction(network, from, to, amount, fee) {
    return new Promise(function (resolve, reject) {
        resolve('op4prKdhMfcGraxqe45KYEs8W3Yyf7BXiDxn5LNssRs54XLdmBo');
    });
}
exports.sendTransaction = sendTransaction;
function createAccount(network, from, to, amount, fee) {
    return new Promise(function (resolve, reject) {
        resolve('op4prKdhMfcGraxqe45KYEs8W3Yyf7BXiDxn5LNssRs54XLdmBo');
    });
}
exports.createAccount = createAccount;
function delegateAccount(network, id, delegate) {
    return new Promise(function (resolve, reject) {
        resolve('op4prKdhMfcGraxqe45KYEs8W3Yyf7BXiDxn5LNssRs54XLdmBo');
    });
}
exports.delegateAccount = delegateAccount;
