"use strict";
exports.__esModule = true;
var ConseilQuery_1 = require("../utils/ConseilQuery");
/**
 * Fetches the most recent block stored in the database.
 * @param {string} network  Which Tezos network to go against
 * @returns {Promise<TezosBlock>}   Latest block.
 */
function getBlockHead(network) {
    return ConseilQuery_1.queryConseilServer(network, 'blocks/head')
        .then(function (json) {
        return json;
    });
}
exports.getBlockHead = getBlockHead;
/**
 * Fetches a block by block hash from the db.
 * @param {string} network  Which Tezos network to go against
 * @param {String} hash The block's hash
 * @returns {Promise<TezosBlock>}   The block
 */
function getBlock(network, hash) {
    return ConseilQuery_1.queryConseilServer(network, "blocks/" + hash)
        .then(function (json) {
        return json;
    });
}
exports.getBlock = getBlock;
/**
 * Fetches all blocks from the db.
 * @param {string} network  Which Tezos network to go against
 * @param {TezosFilter} filter  Filters to apply
 * @returns {Promise<TezosBlock[]>} List of blocks
 */
function getBlocks(network, filter) {
    return ConseilQuery_1.queryConseilServerWithFilter(network, 'blocks', filter)
        .then(function (json) {
        return json;
    });
}
exports.getBlocks = getBlocks;
/**
 * Fetch a given operation group
 * @param {string} network  Which Tezos network to go against
 * @param {String} hash Operation group hash
 * @returns {Promise<TezosOperationGroupWithOperations>}    Operation group along with associated operations and accounts
 */
function getOperationGroup(network, hash) {
    return ConseilQuery_1.queryConseilServer(network, "operations/" + hash)
        .then(function (json) {
        return json;
    });
}
exports.getOperationGroup = getOperationGroup;
/**
 * Fetches all operation groups.
 * @param {string} network  Which Tezos network to go against
 * @param {TezosFilter} filter  Filters to apply
 * @returns {Promise<TezosOperationGroup[]>}    List of operation groups
 */
function getOperationGroups(network, filter) {
    return ConseilQuery_1.queryConseilServerWithFilter(network, 'operations', filter)
        .then(function (json) {
        return json;
    });
}
exports.getOperationGroups = getOperationGroups;
/**
 * Fetches an account by account id from the db.
 * @param {string} network  Which Tezos network to go against
 * @param {String} hash The account's id number
 * @returns {Promise<TezosAccountWithOperationGroups>}  The account with its associated operation groups
 */
function getAccount(network, hash) {
    return ConseilQuery_1.queryConseilServer(network, "accounts/" + hash)
        .then(function (json) {
        return json;
    });
}
exports.getAccount = getAccount;
/**
 * Fetches a list of accounts from the db.
 * @param {string} network  Which Tezos network to go against
 * @param {TezosFilter} filter  Filters to apply
 * @returns {Promise<TezosAccount[]>}   List of accounts
 */
function getAccounts(network, filter) {
    return ConseilQuery_1.queryConseilServerWithFilter(network, 'accounts', filter)
        .then(function (json) {
        return json;
    });
}
exports.getAccounts = getAccounts;
