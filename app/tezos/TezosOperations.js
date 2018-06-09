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
var sodium = require("libsodium-wrappers");
var CryptoUtils = require("../utils/CryptoUtils");
var TezosNode = require("./TezosNodeQuery");
/**
 * Signs a forged operation
 * @param {string} forgedOperation  Forged operation group returned by the Tezos client (as a hex string)
 * @param {KeyStore} keyStore   Key pair along with public key hash
 * @returns {SignedOperationGroup}  Bytes of the signed operation along with the actual signature
 */
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
/**
 * Computes the ID of an operation group using Base58Check.
 * @param {SignedOperationGroup} signedOpGroup  Signed operation group
 * @returns {string}    Base58Check hash of signed operation
 */
function computeOperationHash(signedOpGroup) {
    var hash = sodium.crypto_generichash(32, signedOpGroup.bytes);
    return CryptoUtils.base58CheckEncode(hash, "op");
}
exports.computeOperationHash = computeOperationHash;
/**
 * Appends a key reveal operation to an operation group if needed.
 * @param {object[]} operations The operations being forged as part of this operation group
 * @param {ManagerKey} managerKey   The sending account's manager information
 * @param {KeyStore} keyStore   Key pair along with public key hash
 * @returns {object[]}  Operation group enriched with a key reveal if necessary
 */
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
/**
 * Forge an operation group using the Tezos RPC client.
 * @param {string} network  Which Tezos network to go against
 * @param {BlockMetadata} blockHead The block head
 * @param {Account} account The sender's account
 * @param {object[]} operations The operations being forged as part of this operation group
 * @param {KeyStore} keyStore   Key pair along with public key hash
 * @param {number} fee  Fee to be paid
 * @returns {Promise<string>}   Forged operation bytes (as a hex string)
 */
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
/**
 * Applies an operation using the Tezos RPC client.
 * @param {string} network  Which Tezos network to go against
 * @param {BlockMetadata} blockHead Block head
 * @param {string} operationGroupHash   Hash of the operation group being applied (in Base58Check format)
 * @param {string} forgedOperationGroup Forged operation group returned by the Tezos client (as a hex string)
 * @param {SignedOperationGroup} signedOpGroup  Signed operation group
 * @returns {Promise<AppliedOperation>} Array of contract handles
 */
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
/**
 * Injects an opertion using the Tezos RPC client.
 * @param {string} network  Which Tezos network to go against
 * @param {SignedOperationGroup} signedOpGroup  Signed operation group
 * @returns {Promise<InjectedOperation>}    ID of injected operation
 */
function injectOperation(network, signedOpGroup) {
    var payload = {
        signedOperationContents: sodium.to_hex(signedOpGroup.bytes)
    };
    return TezosNode.injectOperation(network, payload);
}
exports.injectOperation = injectOperation;
/**
 * Master function for creating and sending all supported types of operations.
 * @param {string} network  Which Tezos network to go against
 * @param {object[]} operations The operations to create and send
 * @param {KeyStore} keyStore   Key pair along with public key hash
 * @param {number} fee  The fee to use
 * @returns {Promise<OperationResult>}  The ID of the created operation group
 */
function sendOperation(network, operations, keyStore, fee) {
    return __awaiter(this, void 0, void 0, function () {
        var blockHead, account, accountManager, operationsWithKeyReveal, forgedOperationGroup, signedOpGroup, operationGroupHash, appliedOp, operation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, TezosNode.getBlockHead(network)];
                case 1:
                    blockHead = _a.sent();
                    return [4 /*yield*/, TezosNode.getAccountForBlock(network, blockHead.hash, keyStore.publicKeyHash)];
                case 2:
                    account = _a.sent();
                    return [4 /*yield*/, TezosNode.getAccountManagerForBlock(network, blockHead.hash, keyStore.publicKeyHash)];
                case 3:
                    accountManager = _a.sent();
                    operationsWithKeyReveal = handleKeyRevealForOperations(operations, accountManager, keyStore);
                    return [4 /*yield*/, forgeOperations(network, blockHead, account, operationsWithKeyReveal, keyStore, fee)];
                case 4:
                    forgedOperationGroup = _a.sent();
                    signedOpGroup = signOperationGroup(forgedOperationGroup, keyStore);
                    operationGroupHash = computeOperationHash(signedOpGroup);
                    return [4 /*yield*/, applyOperation(network, blockHead, operationGroupHash, forgedOperationGroup, signedOpGroup)];
                case 5:
                    appliedOp = _a.sent();
                    return [4 /*yield*/, injectOperation(network, signedOpGroup)];
                case 6:
                    operation = _a.sent();
                    return [2 /*return*/, {
                            results: appliedOp,
                            operationGroupID: operation.injectedOperation
                        }];
            }
        });
    });
}
exports.sendOperation = sendOperation;
/**
 * Creates and sends a transaction operation.
 * @param {string} network  Which Tezos network to go against
 * @param {KeyStore} keyStore   Key pair along with public key hash
 * @param {String} to   Destination public key hash
 * @param {number} amount   Amount to send
 * @param {number} fee  Fee to use
 * @returns {Promise<OperationResult>}  Result of the operation
 */
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
/**
 * Creates and sends a delegation operation.
 * @param {string} network  Which Tezos network to go against
 * @param {KeyStore} keyStore   Key pair along with public key hash
 * @param {String} delegate Account ID to delegate to
 * @param {number} fee  Operation fee
 * @returns {Promise<OperationResult>}  Result of the operation
 */
function sendDelegationOperation(network, keyStore, delegate, fee) {
    var delegation = {
        kind: "delegation",
        delegate: delegate
    };
    var operations = [delegation];
    return sendOperation(network, operations, keyStore, fee);
}
exports.sendDelegationOperation = sendDelegationOperation;
/**
 * Creates and sends an origination operation.
 * @param {string} network  Which Tezos network to go against
 * @param {KeyStore} keyStore   Key pair along with public key hash
 * @param {number} amount   Initial funding amount of new account
 * @param {string} delegate Account ID to delegate to, blank if none
 * @param {boolean} spendable   Is account spendable?
 * @param {boolean} delegatable Is account delegatable?
 * @param {number} fee  Operation fee
 * @returns {Promise<OperationResult>}  Result of the operation
 */
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
