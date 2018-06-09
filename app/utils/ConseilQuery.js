"use strict";
exports.__esModule = true;
var querystring = require("querystring");
var node_fetch_1 = require("node-fetch");
/**
 * Utility functions for querying backend Conseil API
 */
/**
 * Runs a query against Conseil backend API
 * TODO: Remove hard coded URL
 * TODO: Also make the blockchain a parameter
 * @param {string} network  Network to go against
 * @param {string} route API route to query
 * @param {string} payload  Body of query
 * @returns {Promise<object>}   JSON representation of response from Conseil
 */
function queryConseilServer(network, route) {
    var https = require("https");
    var agent = new https.Agent({
        rejectUnauthorized: false
    });
    var url = "https://conseil.cryptonomic.tech:1337/tezos/" + network + "/" + route;
    console.log("Querying Conseil server at URL " + url);
    return node_fetch_1["default"](url, {
        method: 'get',
        headers: {
            "apiKey": "hooman"
        },
        agent: agent
    })
        .then(function (response) { return response.json(); });
}
exports.queryConseilServer = queryConseilServer;
/**
 * Runs a query against Conseil backend API with the given filter
 * @param {string} network  Network to go against
 * @param {string} route    API route to query
 * @param {TezosFilter} filter  Conseil filter
 * @returns {Promise<object>}   Data returned by Conseil as a JSON object
 */
function queryConseilServerWithFilter(network, route, filter) {
    var params = querystring.stringify(sanitizeFilter(filter));
    var cmdWithParams = route + "?" + params;
    return queryConseilServer(network, cmdWithParams);
}
exports.queryConseilServerWithFilter = queryConseilServerWithFilter;
/**
 * Removes extraneous data from Conseil fitler predicates.
 * @param {TezosFilter} filter  Conseil filter
 * @returns {TezosFilter}   Sanitized Conseil filter
 */
function sanitizeFilter(filter) {
    return {
        limit: filter.limit,
        block_id: filter.block_id.filter(Boolean),
        block_level: filter.block_level.filter(Boolean),
        block_netid: filter.block_netid.filter(Boolean),
        block_protocol: filter.block_protocol.filter(Boolean),
        operation_id: filter.operation_id.filter(Boolean),
        operation_source: filter.operation_source.filter(Boolean),
        operation_group_kind: filter.operation_group_kind.filter(Boolean),
        operation_kind: filter.operation_kind.filter(Boolean),
        account_id: filter.account_id.filter(Boolean),
        account_manager: filter.account_manager.filter(Boolean),
        account_delegate: filter.account_delegate.filter(Boolean)
    };
}
