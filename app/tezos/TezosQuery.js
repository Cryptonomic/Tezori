"use strict";
exports.__esModule = true;
var ConseilQuery_1 = require("../utils/ConseilQuery");
function getBlockHead(network) {
    return ConseilQuery_1.queryConseilServer(network, 'blocks/head', '')
        .then(function (json) {
        return json;
    });
}
exports.getBlockHead = getBlockHead;
function getBlock(network, hash) {
    return ConseilQuery_1.queryConseilServer(network, "blocks/" + hash, '')
        .then(function (json) {
        return json;
    });
}
exports.getBlock = getBlock;
function getBlocks(network, filter) {
    return ConseilQuery_1.queryConseilServerWithFilter(network, 'blocks', filter)
        .then(function (json) {
        return json;
    });
}
exports.getBlocks = getBlocks;
function getOperationGroup(network, hash) {
    return ConseilQuery_1.queryConseilServer(network, "operations/" + hash, '')
        .then(function (json) {
        return json;
    });
}
exports.getOperationGroup = getOperationGroup;
function getOperationGroups(network, filter) {
    return ConseilQuery_1.queryConseilServerWithFilter(network, 'operations', filter)
        .then(function (json) {
        return json;
    });
}
exports.getOperationGroups = getOperationGroups;
function getAccount(network, hash) {
    return ConseilQuery_1.queryConseilServer(network, "accounts/" + hash, '')
        .then(function (json) {
        return json;
    });
}
exports.getAccount = getAccount;
function getAccounts(network, filter) {
    return ConseilQuery_1.queryConseilServerWithFilter(network, 'accounts', filter)
        .then(function (json) {
        return json;
    });
}
exports.getAccounts = getAccounts;
