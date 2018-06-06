"use strict";
exports.__esModule = true;
var sodium = require("libsodium-wrappers");
var CryptoUtils = require("../utils/CryptoUtils");
var TezosNode = require("./TezosNodeQuery");
function signOperationGroup(forgedOperation, keyStore) {
    var watermark = '03';
    var watermarkedForgedOperationBytes = sodium.from_hex(watermark + forgedOperation);
    var privateKeyBytes = CryptoUtils.base58CheckDecode(keyStore.privateKey, "edsk");
    var hashedWatermarkedOpBytes = sodium.crypto_generichash(32, watermarkedForgedOperationBytes);
    var opSignature = sodium.crypto_sign_detached(hashedWatermarkedOpBytes, privateKeyBytes);
    var hexSignature = CryptoUtils.base58CheckEncode(opSignature, "edsig").toString();
    var signedOpBytes = Buffer.concat([sodium.from_hex(forgedOperation), opSignature]);
    return {
        bytes: signedOpBytes,
        signature: hexSignature.toString()
    };
}
exports.signOperationGroup = signOperationGroup;
function computeOperationHash(signedOpGroup) {
    var hash = sodium.crypto_generichash(32, signedOpGroup.bytes);
    return CryptoUtils.base58CheckEncode(hash, "op").toString();
}
exports.computeOperationHash = computeOperationHash;
function handleKeyRevealForOperations(operations, managerKey, keyStore) {
    if (managerKey.key === null) {
        var revealOp = {
            kind: "reveal",
            public_key: keyStore.publicKey
        };
        return [revealOp].concat(operations);
    }
    else {
        return operations;
    }
}
exports.handleKeyRevealForOperations = handleKeyRevealForOperations;
function forgeOperations(network, blockHead, account, operations, keyStore, fee) {
    //For now we only support operations with fees.
    var payload = {
        branch: blockHead.hash,
        source: keyStore.publicKeyHash,
        operations: operations,
        counter: account.counter + 1,
        fee: fee,
        kind: 'manager',
        gas_limit: '120',
        storage_limit: 0
    };
    return TezosNode.forgeOperation(network, payload)
        .then(function (forgedOperation) { return forgedOperation.operation; });
}
exports.forgeOperations = forgeOperations;
function applyOperation(network, blockHead, operationGroupHash, forgedOperationGroup, signedOpGroup) {
    var payload = {
        pred_block: blockHead.predecessor,
        operation_hash: operationGroupHash,
        forged_operation: forgedOperationGroup,
        signature: signedOpGroup.signature
    };
    return TezosNode.applyOperation(network, payload);
}
exports.applyOperation = applyOperation;
function injectOperation(network, signedOpGroup) {
    var payload = {
        signedOperationContents: sodium.to_hex(signedOpGroup.bytes)
    };
    return TezosNode.injectOperation(network, payload);
}
exports.injectOperation = injectOperation;
function sendOperation(network, operations, keyStore, fee) {
    return TezosNode.getBlockHead(network)
        .then(function (blockHead) {
        return TezosNode.getAccountForBlock(network, blockHead.hash, keyStore.publicKeyHash)
            .then(function (account) {
            return TezosNode.getAccountManagerForBlock(network, blockHead.hash, keyStore.publicKeyHash)
                .then(function (accountManager) {
                var operationsWithKeyReveal = handleKeyRevealForOperations(operations, accountManager, keyStore);
                return forgeOperations(network, blockHead, account, operationsWithKeyReveal, keyStore, fee)
                    .then(function (forgedOperationGroup) {
                    var signedOpGroup = signOperationGroup(forgedOperationGroup, keyStore);
                    var operationGroupHash = computeOperationHash(signedOpGroup);
                    return applyOperation(network, blockHead, operationGroupHash, forgedOperationGroup, signedOpGroup)
                        .then(function (appliedOp) {
                        return injectOperation(network, signedOpGroup)
                            .then(function (operation) {
                            return {
                                results: appliedOp,
                                operationGroupID: operation.injectedOperation
                            };
                        });
                    });
                });
            });
        });
    });
}
exports.sendOperation = sendOperation;
function sendTransactionOperation(network, keyStore, to, amount, fee) {
    var transaction = {
        kind: "transaction",
        amount: amount,
        destination: to,
        parameters: { prim: "Unit", args: [] }
    };
    var operations = [transaction];
    return sendOperation(network, operations, keyStore, fee);
}
exports.sendTransactionOperation = sendTransactionOperation;
function sendDelegationOperation(network, keyStore, delegate, fee) {
    var delegation = {
        kind: "delegation",
        delegate: delegate
    };
    var operations = [delegation];
    return sendOperation(network, operations, keyStore, fee);
}
exports.sendDelegationOperation = sendDelegationOperation;
function sendOriginationOperation(network, keyStore, amount, delegate, spendable, delegatable, fee) {
    var origination = {
        kind: "origination",
        balance: amount,
        managerPubkey: keyStore.publicKeyHash,
        spendable: spendable,
        delegatable: delegatable,
        delegate: delegate
    };
    var operations = [origination];
    return sendOperation(network, operations, keyStore, fee);
}
exports.sendOriginationOperation = sendOriginationOperation;
