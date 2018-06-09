"use strict";
exports.__esModule = true;
var node_fetch_1 = require("node-fetch");
/**
 * Generic functions for running queries against blockchain nodes.
 */
/**
 * Runs a query against a Tezos node.
 * TODO: Make blockchain agnostic
 * @param {string} network  Network to query against
 * @param {string} command  RPC route to invoke
 * @param {{}} payload  Payload to submit
 * @returns {Promise<object>}   JSON-encoded response
 */
function runQuery(network, command, payload) {
    if (payload === void 0) { payload = {}; }
    var url = "http://nautilus.cryptonomic.tech:8732/tezos/" + network + "/" + command;
    var payloadStr = JSON.stringify(payload);
    console.log("Querying Tezos node with URL " + url + " and payload: " + payloadStr);
    return node_fetch_1["default"](url, {
        method: 'post',
        body: payloadStr,
        headers: {
            'content-type': 'application/json'
        }
    })
        .then(function (response) { return response.json(); })
        .then(function (json) {
        console.log("Reponse from Tezos node: " + JSON.stringify(json));
        return new Promise(function (resolve) { return resolve(json); });
    });
}
exports.runQuery = runQuery;
