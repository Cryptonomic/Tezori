"use strict";
exports.__esModule = true;
var CryptoUtils = require("./utils/CryptoUtils");
var TezosQuery = require("./tezos/TezosQuery");
var fs = require("fs");
var tezos;
(function (tezos) {
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
    tezos.createWallet = createWallet;
    function saveWallet(filename, wallet) {
        return new Promise(function (resolve, reject) {
            fs.writeFile(filename, JSON.stringify(wallet), function (err) {
                if (err)
                    reject(err);
                resolve(wallet);
            });
        });
    }
    tezos.saveWallet = saveWallet;
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
    tezos.loadWallet = loadWallet;
    function unlockFundraiserIdentity(mnemonic, email, password) {
        var passphrase = email + password;
        return CryptoUtils.getKeysFromMnemonicAndPassphrase(mnemonic, passphrase);
    }
    tezos.unlockFundraiserIdentity = unlockFundraiserIdentity;
    function generateMnemonic() {
        return CryptoUtils.generateMnemonic();
    }
    tezos.generateMnemonic = generateMnemonic;
    function unlockIdentityWithMnemonic(mnemonic, passphrase) {
        return CryptoUtils.getKeysFromMnemonicAndPassphrase(mnemonic, passphrase);
    }
    tezos.unlockIdentityWithMnemonic = unlockIdentityWithMnemonic;
    function getAccountsForIdentity(id, network) {
        var filter = {
            limit: 100,
            block_id: [],
            block_level: [],
            block_netid: [],
            block_protocol: [],
            operation_id: [],
            operation_source: [],
            operation_group_kind: [],
            operation_kind: [],
            account_id: [],
            account_manager: [id],
            account_delegate: []
        };
        return TezosQuery.getAccounts(network, filter);
    }
    tezos.getAccountsForIdentity = getAccountsForIdentity;
    function getBalance(id, network) {
        return TezosQuery.getAccount(network, id)
            .then(function (result) { return result.account.balance; });
    }
    tezos.getBalance = getBalance;
    function getTransactionsForAddress(id, network) {
        var filter = {
            limit: 100,
            block_id: [],
            block_level: [],
            block_netid: [],
            block_protocol: [],
            operation_id: [],
            operation_source: [id],
            operation_group_kind: [],
            operation_kind: ['transaction'],
            account_id: [],
            account_manager: [],
            account_delegate: []
        };
        return TezosQuery.getOperationGroups(network, filter);
    }
    tezos.getTransactionsForAddress = getTransactionsForAddress;
    function sendTransaction(network, keyPair, from, to, amount, fee) {
        return new Promise(function (resolve, reject) {
            resolve('op4prKdhMfcGraxqe45KYEs8W3Yyf7BXiDxn5LNssRs54XLdmBo');
        });
    }
    tezos.sendTransaction = sendTransaction;
    function createAccount(network, keyPair) {
        return new Promise(function (resolve, reject) {
            resolve('op4prKdhMfcGraxqe45KYEs8W3Yyf7BXiDxn5LNssRs54XLdmBo');
        });
    }
    tezos.createAccount = createAccount;
    function delegateAccount(network, keyPair, id, delegate) {
        return new Promise(function (resolve, reject) {
            resolve('op4prKdhMfcGraxqe45KYEs8W3Yyf7BXiDxn5LNssRs54XLdmBo');
        });
    }
    tezos.delegateAccount = delegateAccount;
})(tezos = exports.tezos || (exports.tezos = {}));
