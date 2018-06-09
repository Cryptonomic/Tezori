"use strict";
exports.__esModule = true;
var Nautilus = require("../utils/NautilusQuery");
/**
 * Utility functions for interacting with the Tezos node.
 */
/**
 * Gets a given block.
 * @param {string} network  Which Tezos network to go against
 * @param {String} hash Hash of the given block
 * @returns {Promise<BlockMetadata>}    Block
 */
function getBlock(network, hash) {
    return Nautilus.runQuery(network, "blocks/" + hash)
        .then(function (json) { return json; });
}
exports.getBlock = getBlock;
/**
 * Gets the block head.
 * @param {string} network  Which Tezos network to go against
 * @returns {Promise<BlockMetadata>}    Block head
 */
function getBlockHead(network) {
    return getBlock(network, "head");
}
exports.getBlockHead = getBlockHead;
/**
 * Fetches a specific account for a given block.
 * @param {string} network  Which Tezos network to go against
 * @param {string} blockHash    Hash of given block
 * @param {string} accountID    Account ID
 * @returns {Promise<Account>}  The account
 */
function getAccountForBlock(network, blockHash, accountID) {
    return Nautilus.runQuery(network, "blocks/" + blockHash + "/proto/context/contracts/" + accountID)
        .then(function (json) { return json; });
}
exports.getAccountForBlock = getAccountForBlock;
/**
 * Fetches the manager of a specific account for a given block.
 * @param {string} network  Which Tezos network to go against
 * @param {string} blockHash    Hash of given block
 * @param {string} accountID    Account ID
 * @returns {Promise<ManagerKey>}   The account
 */
function getAccountManagerForBlock(network, blockHash, accountID) {
    return Nautilus.runQuery(network, "blocks/" + blockHash + "/proto/context/contracts/" + accountID + "/manager_key")
        .then(function (json) { return json; });
}
exports.getAccountManagerForBlock = getAccountManagerForBlock;
/**
 * Forge an operation group using the Tezos RPC client.
 * @param {string} network  Which Tezos network to go against
 * @param {object} opGroup  Operation group payload
 * @returns {Promise<ForgedOperation>}  Forged operation
 */
function forgeOperation(network, opGroup) {
    return Nautilus.runQuery(network, "/blocks/head/proto/helpers/forge/operations", opGroup)
        .then(function (json) { return json; });
}
exports.forgeOperation = forgeOperation;
/**
 * Applies an operation using the Tezos RPC client.
 * @param {string} network  Which Tezos network to go against
 * @param {object} payload  Payload set according to protocol spec
 * @returns {Promise<AppliedOperation>} Applied operation
 */
function applyOperation(network, payload) {
    return Nautilus.runQuery(network, "/blocks/head/proto/helpers/apply_operation", payload)
        .then(function (json) { return json; });
}
exports.applyOperation = applyOperation;
/**
 *
 * @param {string} network  Which Tezos network to go against
 * @param {object} payload  Payload set according to protocol spec
 * @returns {Promise<InjectedOperation>} Injected operation
 */
function injectOperation(network, payload) {
    return Nautilus.runQuery(network, "/inject_operation", payload)
        .then(function (json) { return json; });
}
exports.injectOperation = injectOperation;
