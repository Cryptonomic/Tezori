"use strict";
exports.__esModule = true;
var Nautilus = require("../utils/NautilusQuery");
function getBlock(network, hash) {
    return Nautilus.runQuery(network, "blocks/" + hash)
        .then(function (json) { return json; });
}
exports.getBlock = getBlock;
function getBlockHead(network) {
    return getBlock(network, "head");
}
exports.getBlockHead = getBlockHead;
function getAccountForBlock(network, blockHash, accountID) {
    return Nautilus.runQuery(network, "blocks/" + blockHash + "/proto/context/contracts/" + accountID)
        .then(function (json) { return json; });
}
exports.getAccountForBlock = getAccountForBlock;
function getAccountManagerForBlock(network, blockHash, accountID) {
    return Nautilus.runQuery(network, "blocks/" + blockHash + "/proto/context/contracts/" + accountID + "/manager_key")
        .then(function (json) { return json; });
}
exports.getAccountManagerForBlock = getAccountManagerForBlock;
function forgeOperation(network, opGroup) {
    return Nautilus.runQuery(network, "/blocks/head/proto/helpers/forge/operations", opGroup)
        .then(function (json) { return json; });
}
exports.forgeOperation = forgeOperation;
function applyOperation(network, payload) {
    return Nautilus.runQuery(network, "/blocks/head/proto/helpers/apply_operation", payload)
        .then(function (json) { return json; });
}
exports.applyOperation = applyOperation;
function injectOperation(network, payload) {
    return Nautilus.runQuery(network, "/inject_operation", payload)
        .then(function (json) { return json; });
}
exports.injectOperation = injectOperation;
